import { Routes, Route, Link } from 'react-router-dom';
import './App.css'; 
import Interview from './interview';

function Prompt() {
    return (
        <Routes>
            <Route path="/" element={
                <div>
                    <header className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
                            <img src="/icon.webp" alt="Logo" className="h-20 w-20"/>
                            <h1 className="text-2xl font-bold text-gray-900">Interview Coach</h1>
                        </div>
                    </header>
                    <section className='bg-gradient-to-br from-orange-50 to-orange-100 py-20'>
                        <div className="max-w-2xl mx-auto px-6">
                            <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Practice Your Interview</h1>
                            
                            <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="mb-6">
                                <label className="block text-lg font-semibold text-gray-900 mb-3">
                                Select Interview Type
                                </label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Choose an option...</option>
                                <option value="technical">Technical</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="both">Both</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <input 
                                type="text" 
                                placeholder="Job Role" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-8">
                                <textarea 
                                placeholder="Paste your job info..." 
                                rows="8"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="text-center">
                                <Link to="/interview" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all inline-flex items-center gap-2">
                                    <img src="/star.png" alt="" className="h-6 w-6"/>
                                    Start Practice
                                </Link>
                            </div>
                            </div>
                        </div>
                    </section>
                </div>
            }/>
            <Route path="/interview" element={<Interview />} />
        </Routes>
    );
}

export default Prompt;