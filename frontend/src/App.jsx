// App.jsx
import React, { useState, useEffect } from 'react';
import ATSAnalyzer from './components/ATSAnalyzer';
import JDMatcher from './components/JDMatcher';
import ErrorAlert from './components/ErrorAlert';
import { healthCheck } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('ats');
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await healthCheck();
      setServerStatus('connected');
    } catch (err) {
      setServerStatus('disconnected');
      setError('Backend server is not running. Please start the server at http://localhost:8000');
    }
  };

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Resume Analyzer</h1>
                <p className="text-xs text-gray-600">AI-Powered ATS & JD Matching</p>
              </div>
            </div>

            {/* Server Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${serverStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                {serverStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Resume Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze your resume's ATS compatibility and match it against job descriptions using AI-powered insights.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'ats'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 100-2H4a4 4 0 000 8v2a1 1 0 100 2v2a4 4 0 000-8V5a1 1 0 000-2 2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-2.5a1 1 0 100 2H16v12H4V5z" clipRule="evenodd" />
              </svg>
              ATS Score
            </div>
          </button>

          <button
            onClick={() => setActiveTab('jd-match')}
            className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'jd-match'
                ? 'text-purple-600 border-purple-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
              JD Matcher
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {serverStatus === 'disconnected' ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <h3 className="text-red-900 font-bold text-lg mb-2">Backend Server Not Connected</h3>
              <p className="text-red-800 mb-4">
                The backend server is not running. Please ensure the backend is started on http://localhost:8000
              </p>
              <button
                onClick={checkServerHealth}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'ats' && (
                <ATSAnalyzer onError={handleError} />
              )}
              {activeTab === 'jd-match' && (
                <JDMatcher onError={handleError} />
              )}
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 100-2H4a4 4 0 000 8v2a1 1 0 100 2v2a4 4 0 000-8V5a1 1 0 000-2 2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-2.5a1 1 0 100 2H16v12H4V5z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ATS Optimization</h3>
            <p className="text-gray-600">
              Get a detailed score on how well your resume will be parsed by Applicant Tracking Systems.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">JD Matching</h3>
            <p className="text-gray-600">
              Compare your resume against job descriptions to identify skill gaps and get targeted recommendations.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-2.723 3.066 3.066 0 00-3.58 3.58 3.066 3.066 0 002.835.94l.5.5a.75.75 0 11-1.06 1.061l-.5-.5a3.066 3.066 0 00-3.58 3.58 3.066 3.066 0 003.737 3.737l.5-.5a.75.75 0 111.06 1.06l-.5.5a3.066 3.066 0 01-3.737-3.737 3.066 3.066 0 003.58-3.58.75.75 0 101.06-1.061l-.5.5a3.066 3.066 0 002.834-.94l.5-.5a.75.75 0 11-1.06-1.06l-.5.5a3.066 3.066 0 00-2.743-1.745z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Uses advanced AI to provide detailed insights and actionable recommendations for improvement.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 202 Resume Analyzer. Powered by AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;