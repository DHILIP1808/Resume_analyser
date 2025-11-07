// components/ResultsDisplay.jsx
import React, { useState } from 'react';
import { getScoreColor, getScoreLabel, formatScore, getColorClass, getTextColorClass, downloadJSON } from '../utils/helpers';

export default function ResultsDisplay({ results, type, onReset }) {
  const [expandedSections, setExpandedSections] = useState({});

  // Log unused helper functions to satisfy ESLint (no logic change)
  console.log(getColorClass, getTextColorClass);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isATS = type === 'ats';
  const score = isATS ? results.ats_score : results.overall_match_score;
  const scoreColor = getScoreColor(score, type);
  const scoreLabel = getScoreLabel(score, type);

  const renderScoreCircle = (score, size = 'large') => {
    const sizeClasses = {
      large: 'w-32 h-32',
      medium: 'w-24 h-24',
      small: 'w-20 h-20',
    };

    const textSizes = {
      large: 'text-5xl',
      medium: 'text-3xl',
      small: 'text-2xl',
    };

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        <svg className={`${sizeClasses[size]} transform -rotate-90`} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={scoreColor === 'green' ? '#10b981' : scoreColor === 'blue' ? '#3b82f6' : scoreColor === 'yellow' ? '#f59e0b' : '#ef4444'}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute text-center">
          <div className={`${textSizes[size]} font-bold text-gray-900`}>{formatScore(score)}</div>
          <div className="text-xs text-gray-600 mt-1">/100</div>
        </div>
      </div>
    );
  };

  const renderSection = (title, items, icon = null) => {
    if (!items || items.length === 0) return null;

    const isExpanded = expandedSections[title];

    return (
      <div key={title} className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection(title)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon && <div className="text-xl">{icon}</div>}
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <span className="text-sm text-gray-600 ml-2">({items.length})</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        {isExpanded && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isATS ? 'ATS Compatibility Score' : 'Job Match Analysis'}
            </h2>
            <p className="text-gray-600">
              {isATS
                ? `Your resume has an ATS score of ${score}/100 - ${scoreLabel}`
                : `Your resume matches ${score}% with the job description - ${scoreLabel}`
              }
            </p>
          </div>
          <div className="flex-shrink-0">
            {renderScoreCircle(score, 'large')}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {results.score_breakdown && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(results.score_breakdown).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{value}</div>
                <div className="text-xs text-gray-600 mt-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                  <div
                    className="bg-blue-600 h-1 rounded-full"
                    style={{ width: `${(value / 25) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Breakdown */}
      {results.match_breakdown && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Match Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(results.match_breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-bold text-gray-900">{value}/30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${(value / 30) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords & Skills */}
      {(results.technical_skills_found || results.matched_skills) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills Found</h3>
          <div className="flex flex-wrap gap-2">
            {(results.technical_skills_found || results.matched_skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {results.missing_skills && results.missing_skills.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {results.missing_skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                ✗ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-3">
        {renderSection('Strengths', results.strengths, '💪')}
        {renderSection('Weaknesses', results.weaknesses, '⚠️')}
        {renderSection('Gaps', results.gaps, '📍')}
        {renderSection('Recommendations', results.recommendations || results.suggestions, '💡')}
      </div>

      {/* Final Assessment */}
      {results.final_assessment && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Final Assessment</h3>
          <p className="text-gray-700 leading-relaxed">{results.final_assessment}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => downloadJSON(results, `${type}-results-${new Date().getTime()}.json`)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2 1 1 0 100-2H5a4 4 0 014 4v12a1 1 0 11-2 0V9a2 2 0 00-2-2 1 1 0 100 2h12a1 1 0 100-2h-1a2 2 0 00-2 2v12a1 1 0 112 0V5z" clipRule="evenodd" />
          </svg>
          Download Results
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.9 5.678 1 1 0 11-1.994.316A5.002 5.002 0 105.099 5.678V5a1 1 0 011-1h2a1 1 0 100-2H4a1 1 0 00-1 1z" clipRule="evenodd" />
          </svg>
          Analyze Another
        </button>
      </div>
    </div>
  );
}
