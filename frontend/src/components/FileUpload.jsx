// components/FileUpload.jsx
import React, { useRef } from 'react';
import { SUPPORTED_FORMATS, MAX_FILE_SIZE } from '../utils/constants';

export default function FileUpload({ onFileSelect, onTextInput, placeholder = 'Paste your resume here...' }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = React.useState('');
  const [textValue, setTextValue] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('text');

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // Validate file format
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!SUPPORTED_FORMATS.includes(fileExt)) {
      alert(`Invalid file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setTextValue(text);
    onTextInput(text);
  };

  const handleClearFile = () => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  const handleClearText = () => {
    setTextValue('');
    onTextInput('');
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'text'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'file'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Upload File
        </button>
      </div>

      {/* Text Input Tab */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          <textarea
            value={textValue}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {textValue && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {textValue.length} characters
              </span>
              <button
                onClick={handleClearText}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* File Upload Tab */}
      {activeTab === 'file' && (
        <div className="space-y-3">
          <div
            onClick={handleFileClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <div>
                <p className="text-gray-700 font-medium">Click to upload a file</p>
                <p className="text-gray-500 text-sm mt-1">PDF, DOCX, or DOC</p>
              </div>
            </div>
          </div>

          {fileName && (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 font-medium text-sm">{fileName}</span>
              </div>
              <button
                onClick={handleClearFile}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}