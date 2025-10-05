import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Prompt from './prompt';
import Interview from './interview';
import Results from './results';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
              <img src="/icon.webp" alt="Logo" className="h-20 w-20"/>
              <h1 className="text-2xl font-bold text-gray-900">Interview Coach</h1>
            </div>
          </header>

          <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <img src="/homepage-bg.webp" alt="workspace" className="rounded-2xl shadow-2xl w-full h-96 object-cover"/>
                </div>

                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to land that dream job?</h2>
                  <p className="text-lg text-gray-600 mb-8">Our virtual interviewer coach provides instant, actionable feedback to help you conduct 
                    more effective interviews. Gain insights and identify areas of improvements.</p>
                  <Link to="/prompt" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all inline-flex items-center gap-2">
                    <img src="/star.png" alt="" className="h-6 w-6"/>
                    Start Practice
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="max-w-7xl mx-auto py-6 items-center text-center mt-10">
              <h2 className='text-4xl md:text-4xl font-bold text-gray-900 mb-4'>Key Features</h2>
              <p className="text-xl text-gray-600">Our coach will give you the confidence you need to ace that interview</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
              <div className="border py-10 px-6 rounded-lg shadow-lg bg-white text-center">
                <img src="/video-call.png" alt="Webcam & Voice Capture" className="mx-auto mb-5 w-16 h-16" />
                <h3 className='font-bold text-2xl text-gray-900 mb-4'>Webcam & Voice Capture</h3>
                <p>Real time capture of your facial expressions and voice during the interview</p>
              </div>
                      
              <div className="border py-10 px-6 rounded-lg shadow-lg bg-white text-center">
                <img src="/data-analysis.png" alt="Post Interview Feedback" className="mx-auto mb-5 w-16 h-16" />
                <h3 className='font-bold text-2xl text-gray-900 mb-4'>Post Interview Feedback</h3>
                <p>Receive detailed feedback based on your speech and facial expressions</p>
              </div>
            </div>
          </section>
        </div>
      } />
      
      <Route path="/practice" element={
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
              <img src="/icon.webp" alt="Logo" className="h-20 w-20"/>
              <h1 className="text-2xl font-bold text-gray-900">Interview Coach</h1>
            </div>
          </header>
          
          <div className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Practice Interview</h2>
            <p className="text-lg text-gray-600">Your practice interview content goes here...</p>
          </div>
        </div>
      } />
      <Route path="/prompt" element={<Prompt />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/interview" element={<Interview />} />
    </Routes>
  );
}

export default App;