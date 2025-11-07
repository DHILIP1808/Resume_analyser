// components/ATSAnalyzer.jsx
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import LoadingSpinner from './LoadingSpinner';
import ResultsDisplay from './ResultsDisplay';
import { getATSScore, getATSScoreFromFile } from '../services/api';
import { RESUME_MIN_LENGTH } from '../utils/constants';

export default function ATSAnalyzer({ onError }) {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    try {
      // Validate input
      if (!resumeText && !resumeFile) {
        onError('Please enter resume text or upload a file');
        return;
      }

      if (resumeText && resumeText.length < RESUME_MIN_LENGTH) {
        onError(`Resume must be at least ${RESUME_MIN_LENGTH} characters`);
        return;
      }

      setLoading(true);
      setResults(null);

      let result;
      if (resumeFile) {
        result = await getATSScoreFromFile(resumeFile);
      } else {
        result = await getATSScore(resumeText);
      }

      if (result.status === 'success') {
        setResults(result.data);
      } else {
        onError(result.error || 'Failed to analyze resume');
      }
    } catch (error) {
      onError(error.message || 'An error occurred while analyzing the resume');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setResumeFile(null);
    setResults(null);
  };

  if (results) {
    return (
      <ResultsDisplay
        results={results}
        type="ats"
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100 2h3a1 1 0 100-2H7zm3 4a1 1 0 100 2H7a1 1 0 100-2h3z" clipRule="evenodd" />
          </svg>
          ATS Score Analysis
        </h3>
        <p className="text-blue-800 text-sm mt-2">
          Get your resume's ATS (Applicant Tracking System) compatibility score. Upload your resume or paste the text to analyze how well it will be parsed by automated systems.
        </p>
      </div>

      {/* File/Text Input */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload or Paste Resume</h4>
        <FileUpload
          onFileSelect={setResumeFile}
          onTextInput={setResumeText}
          placeholder="Paste your resume here (minimum 500 characters)..."
        />
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Analyze Button */}
      <div className="flex gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading || (!resumeText && !resumeFile)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
          </svg>
          Analyze ATS Score
        </button>
      </div>
    </div>
  );
}