// components/JDMatcher.jsx
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import LoadingSpinner from './LoadingSpinner';
import ResultsDisplay from './ResultsDisplay';
import { getJDMatch, getJDMatchFromFile } from '../services/api';
import { RESUME_MIN_LENGTH, JD_MIN_LENGTH } from '../utils/constants';

export default function JDMatcher({ onError }) {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleMatch = async () => {
    try {
      // Validate inputs
      if (!resumeText && !resumeFile) {
        onError('Please enter resume text or upload a file');
        return;
      }

      if (resumeText && resumeText.length < RESUME_MIN_LENGTH) {
        onError(`Resume must be at least ${RESUME_MIN_LENGTH} characters`);
        return;
      }

      if (!jdText) {
        onError('Please enter a job description');
        return;
      }

      if (jdText.length < JD_MIN_LENGTH) {
        onError(`Job description must be at least ${JD_MIN_LENGTH} characters`);
        return;
      }

      setLoading(true);
      setResults(null);

      let result;
      if (resumeFile) {
        result = await getJDMatchFromFile(resumeFile, jdText);
      } else {
        result = await getJDMatch(resumeText, jdText);
      }

      if (result.status === 'success') {
        setResults(result.data);
      } else {
        onError(result.error || 'Failed to match resume with job description');
      }
    } catch (error) {
      onError(error.message || 'An error occurred while matching the resume');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setResumeFile(null);
    setJdText('');
    setResults(null);
  };

  if (results) {
    return (
      <ResultsDisplay
        results={results}
        type="jd-match"
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Resume vs Job Description Matcher
        </h3>
        <p className="text-purple-800 text-sm mt-2">
          Compare your resume against a job description to get a detailed match score and recommendations for improvement.
        </p>
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Resume</h4>
        <FileUpload
          onFileSelect={setResumeFile}
          onTextInput={setResumeText}
          placeholder="Paste your resume here (minimum 500 characters)..."
        />
      </div>

      {/* Job Description Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h4>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description here (minimum 200 characters)..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        {jdText && (
          <div className="flex items-center justify-between text-sm mt-3">
            <span className="text-gray-600">{jdText.length} characters</span>
            <button
              onClick={() => setJdText('')}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Match Button */}
      <div className="flex gap-3">
        <button
          onClick={handleMatch}
          disabled={loading || (!resumeText && !resumeFile) || !jdText}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Match Resume with JD
        </button>
      </div>
    </div>
  );
}