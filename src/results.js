import { Link, useLocation } from 'react-router-dom';

function Results() {
    const location = useLocation();
    const analysisData = location.state?.analysisData;

    if (!analysisData) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
                    <p className="mb-4">Please complete an interview recording first.</p>
                    <Link to="/interview" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Start Interview
                    </Link>
                </div>
            </div>
        );
    }
//dont add the red and not green for all of them
    const { facial_analysis, transcript_analysis, coaching_advice } = analysisData;

      const getScoreColor = (score) => {
        if (score >= 0.7) return 'text-green-600';
        if (score >= 0.4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 0.7) return 'bg-green-100';
        if (score >= 0.4) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const formatPercentage = (value) => {
        return (value * 100).toFixed(1) + '%';
    };

    const getHighestEmotion = (emotions) => {
        let highestEmotion = '';
        let highestValue = -1;
        
        Object.entries(emotions).forEach(([emotion, value]) => {
            if (value > highestValue) {
                highestValue = value;
                highestEmotion = emotion;
            }
        });
        
        return { emotion: highestEmotion, value: highestValue };
    };

    const highestEmotion = getHighestEmotion(facial_analysis.emotions);

    return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
                    <img src="/icon.webp" alt="Logo" className="h-20 w-20"/>
                    <h1 className="text-2xl font-bold text-gray-900">Interview Analysis Results</h1>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Overall Scores Section */}
                {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-4xl">📊</span>
                        Overall Performance
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`${getScoreBg(coaching_advice.confidence_score)} rounded-lg p-6`}>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Confidence Score</h3>
                            <p className={`text-4xl font-bold ${getScoreColor(coaching_advice.confidence_score)}`}>
                                {formatPercentage(coaching_advice.confidence_score)}
                            </p>
                        </div>

                        <div className={`${getScoreBg(1 - coaching_advice.anxiety_score)} rounded-lg p-6`}>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Anxiety Score</h3>
                            <p className={`text-4xl font-bold ${getScoreColor(1 - coaching_advice.anxiety_score)}`}>
                                {formatPercentage(coaching_advice.anxiety_score)}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Lower is better</p>
                        </div>
                    </div>
                </div> */}

                {/* Facial Analysis Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-3xl">📷</span>
                        Facial Analysis
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Engagement</h4>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatPercentage(facial_analysis.engagement)}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Positivity</h4>
                            <p className="text-2xl font-bold text-green-600">
                                {formatPercentage(facial_analysis.positivity)}
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Anxiety Hint</h4>
                            <p className="text-2xl font-bold text-purple-600">
                                {formatPercentage(facial_analysis.anxiety_hint)}
                            </p>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Confidence</h4>
                            <p className="text-2xl font-bold text-orange-600">
                                {formatPercentage(facial_analysis.confidence)}
                            </p>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Dominant Emotion</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm text-gray-600 capitalize">{highestEmotion.emotion}</span>
                        <p className="text-lg font-semibold text-gray-900">{highestEmotion.value}%</p>
                    </div>
                </div>

                {/* Speech Analysis Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-3xl">🎤</span>
                        Speech Analysis
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Filler Ratio</h4>
                            <p className="text-2xl font-bold text-indigo-600">
                                {formatPercentage(transcript_analysis.filler_ratio)}
                            </p>
                        </div>

                        <div className="bg-pink-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Filler Hits</h4>
                            <p className="text-2xl font-bold text-pink-600">
                                {transcript_analysis.filler_hits}
                            </p>
                        </div>

                        <div className="bg-teal-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Mumble Score</h4>
                            <p className="text-2xl font-bold text-teal-600">
                                {transcript_analysis.mumble_score}
                            </p>
                        </div>
                    </div>

                    {transcript_analysis.full_text && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Transcript</h4>
                            <p className="text-gray-800 leading-relaxed">{transcript_analysis.full_text}</p>
                        </div>
                    )}
                </div>

                {/* Coaching Advice Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-3xl">💬</span>
                        Coaching Advice
                    </h2>
                    
                    <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Tip</h3>
                        <p className="text-gray-800 leading-relaxed">{coaching_advice.tip}</p>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                    <div className="space-y-3">
                        {coaching_advice.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
                                <span className="text-green-600 text-xl">✓</span>
                                <p className="text-gray-800">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 justify-center">
                    <Link 
                        to="/interview" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg inline-block transition-colors"
                    >
                        Practice Again
                    </Link>
                    <Link 
                        to="/" 
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg inline-block transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Results;