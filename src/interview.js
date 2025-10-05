import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';


function Interview() {
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState('Ready to record');
    const [hasStream, setHasStream] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const ffmpegRef = useRef(null);
    const ffmpegLoadedRef = useRef(false);

    const startRecording = async () => {
        try {
            recordedChunksRef.current = [];
            
            // Get video and audio stream
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            
            videoRef.current.srcObject = stream;
            setHasStream(true);
            
            // Create MediaRecorder: prefer MP4/QuickTime if supported (Safari), otherwise fall back to WebM
            const preferredTypes = ['video/mp4', 'video/quicktime', 'video/webm;codecs=vp8,opus', 'video/webm'];
            let chosenType = '';
            for (const t of preferredTypes) {
                if (typeof MediaRecorder.isTypeSupported === 'function') {
                    try {
                        if (MediaRecorder.isTypeSupported(t)) {
                            chosenType = t;
                            break;
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
            // fallback to first preferred if none matched
            if (!chosenType) chosenType = preferredTypes[0];

            const mediaRecorder = new MediaRecorder(stream, { mimeType: chosenType });
            mediaRecorderRef.current = mediaRecorder;
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    recordedChunksRef.current.push(e.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                // Build a blob from recorded chunks
                (async () => {
                    try {
                        const mime = mediaRecorder.mimeType || 'video/webm';
                        const blob = new Blob(recordedChunksRef.current, { type: mime });

                        // If we already have an mp4/mov, upload directly
                        if (/mp4|quicktime|mov/i.test(blob.type) || /mp4|quicktime|mov/i.test(mime)) {
                            await uploadBlob(blob, 'interview.mp4');
                            return;
                        }

                        // Otherwise convert to MP4 using ffmpeg.wasm (dynamically import to avoid startup cost)
                        setStatus('Converting recording to MP4...');
                        await ensureFFmpeg();
                        const ffmpeg = ffmpegRef.current;
                        // write input
                        const { fetchFile } = ffmpeg;
                        ffmpeg.FS('writeFile', 'input.webm', await fetchFile(blob));
                        // convert - use libx264 + aac if available
                        await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-c:a', 'aac', '-movflags', 'faststart', 'output.mp4');
                        const data = ffmpeg.FS('readFile', 'output.mp4');
                        const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

                        // cleanup
                        try { ffmpeg.FS('unlink', 'input.webm'); ffmpeg.FS('unlink', 'output.mp4'); } catch (e) {}

                        await uploadBlob(mp4Blob, 'interview.mp4');
                    } catch (err) {
                        setStatus('Conversion/Upload error: ' + err.message);
                    }
                })();
            };
            
            mediaRecorder.start();
            setIsRecording(true);
            setStatus('Recording...');
            
        } catch (err) {
            setStatus('Error accessing camera: ' + err.message);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            
            // Stop tracks so camera turns off
            const stream = videoRef.current.srcObject;
            videoRef.current.srcObject = null;
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            setIsRecording(false);
            setHasStream(false);
            // status will be updated by onstop (Conversion/Uploading/Analysis)
        }
    };

    const ensureFFmpeg = async () => {
        if (ffmpegLoadedRef.current) return;
        // dynamic import to avoid requiring package at startup/build time
        const mod = await import('@ffmpeg/ffmpeg');
        const { createFFmpeg, fetchFile } = mod;
        const ffmpeg = createFFmpeg({ log: false });
        ffmpeg.fetchFile = fetchFile; // attach helper
        ffmpegRef.current = ffmpeg;
        setStatus('Loading ffmpeg (for mp4 conversion), this may take a moment...');
        await ffmpeg.load();
        ffmpegLoadedRef.current = true;
    };

    const uploadBlob = async (blob, filename) => {
        try {
            setStatus('Uploading...');
            const formData = new FormData();
            // field name 'file' matches backend UploadFile parameter
            formData.append('file', blob, filename);

            const resp = await fetch('https://squid-app-xh7j9.ondigitalocean.app/api/v1/analyze-interview', {
                method: 'POST',
                body: formData,
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`Upload failed: ${resp.status} ${text}`);
            }
            
            const json = await resp.json();
            setStatus('Analysis completed! Redirecting to results...');
            setAnalysisData(json);
            
            // Navigate to results page with the analysis data
            setTimeout(() => {
                navigate('/results', { state: { analysisData: json } });
            }, 1000);

        } catch (err) {
            setStatus('Error: ' + err.message);
        }
    };

    const viewResults = () => {
        if (analysisData) {
            navigate('/results', { state: { analysisData } });
        }
    };

    return (
        <div>
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
                    <img src="/icon.webp" alt="Logo" className="h-20 w-20"/>
                    <h1 className="text-2xl font-bold text-gray-900">Interview Coach</h1>
                </div>
            </header>
            
            <section className='bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen py-20'>
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
                        Interview Practice Session
                    </h1>
                    
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-6">
                            <video 
                                ref={videoRef}
                                autoPlay 
                                muted 
                                playsInline
                                className="w-full max-w-2xl mx-auto rounded-lg shadow-md bg-black"
                                style={{ width: '640px', height: '480px' }}
                            />
                        </div>

                        <div className="flex gap-4 justify-center mb-6">
                            <button
                                onClick={startRecording}
                                disabled={isRecording}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                    isRecording 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                }`}
                            >
                                Start Recording
                            </button>

                            <button
                                onClick={stopRecording}
                                disabled={!isRecording}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                    !isRecording 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                                }`}
                            >
                                Stop & Upload
                            </button>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                            <pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                                {status}
                            </pre>
                        </div>
                        
                        <div className="flex gap-4">
                            <Link 
                                to="/" 
                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg inline-block"
                            >
                                ← Back to Home
                            </Link>
                            
                            {analysisData && (
                                <button
                                    onClick={viewResults}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg"
                                >
                                    View Results →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Interview;