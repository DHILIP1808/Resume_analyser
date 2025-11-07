// components/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium">Analyzing your resume...</p>
      </div>
    </div>
  );
}