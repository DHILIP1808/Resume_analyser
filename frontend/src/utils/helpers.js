// utils/helpers.js
import { ATS_SCORE_RANGES, MATCH_SCORE_RANGES } from './constants';

export const getScoreColor = (score, type = 'ats') => {
  const ranges = type === 'ats' ? ATS_SCORE_RANGES : MATCH_SCORE_RANGES;
  
  for (const [_key, range] of Object.entries(ranges)) {
    if (score >= range.min && score <= range.max) {
      return range.color;
    }
  }
  return 'gray';
};

export const getScoreLabel = (score, type = 'ats') => {
  const ranges = type === 'ats' ? ATS_SCORE_RANGES : MATCH_SCORE_RANGES;
  
  for (const [_key, range] of Object.entries(ranges)) {
    if (score >= range.min && score <= range.max) {
      return range.label;
    }
  }
  return 'Unknown';
};

export const formatScore = (score) => {
  return Math.round(score);
};

export const getColorClass = (color) => {
  const colorMap = {
    green: 'bg-green-100 text-green-800 border-green-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colorMap[color] || colorMap.gray;
};

export const getTextColorClass = (color) => {
  const colorMap = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    cyan: 'text-cyan-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
  };
  return colorMap[color] || colorMap.gray;
};

export const getBgColorClass = (color) => {
  const colorMap = {
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    cyan: 'bg-cyan-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    gray: 'bg-gray-50',
  };
  return colorMap[color] || colorMap.gray;
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const downloadJSON = (data, filename) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy:', err);
  });
};

export const getFileExtension = (filename) => {
  return filename.substring(filename.lastIndexOf('.')).toLowerCase();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
