// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ATSAnalyzer from '../components/ATSAnalyzer';
import JDMatcher from '../components/JDMatcher';
import ErrorAlert from '../components/ErrorAlert';
import { healthCheck } from '../services/api';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'ats');
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    checkServerHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkServerHealth, 30000);
    return () => clearInterval(interval);
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
    setTimeout(() => setError(null), 6000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Resume Analyzer</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>

            {/* Server Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${serverStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {serverStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="ml-4 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Analyze Your Resume
          </h2>
          <p className="text-xl text-gray-600">
            Optimize your resume for ATS systems and match it with job descriptions
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Server Status Alert */}
        {serverStatus === 'disconnected' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-red-900 font-bold text-lg mb-2">Backend Server Not Connected</h3>
                <p className="text-red-800">
                  The backend server is not running. Please ensure the backend is started on http://localhost:8000
                </p>
              </div>
              <button
                onClick={checkServerHealth}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => handleTabChange('ats')}
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
              ATS Score Analysis
            </div>
          </button>

          <button
            onClick={() => handleTabChange('jd-match')}
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
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h3>
              <p className="text-gray-600 mb-6">
                Unable to connect to backend server. Please start the backend server first.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-left max-w-md mx-auto mb-6">
                <p className="font-mono text-sm text-gray-700">
                  cd backend<br/>
                  python main.py
                </p>
              </div>
              <button
                onClick={checkServerHealth}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
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

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Pro Tip</h4>
                <p className="text-gray-700 text-sm">
                  Use clear section headers and action verbs to improve your ATS score.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Best Practice</h4>
                <p className="text-gray-700 text-sm">
                  Match your resume keywords with the job description for better results.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Optimization</h4>
                <p className="text-gray-700 text-sm">
                  Highlight quantifiable achievements and relevant skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 Resume Analyzer. Powered by AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}