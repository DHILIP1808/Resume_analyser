// utils/constants.js

export const RESUME_MIN_LENGTH = 500;
export const JD_MIN_LENGTH = 200;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_FORMATS = ['.pdf', '.docx', '.doc'];

export const ATS_SCORE_RANGES = {
  EXCELLENT: { min: 80, max: 100, label: 'Excellent', color: 'green' },
  GOOD: { min: 60, max: 79, label: 'Good', color: 'blue' },
  FAIR: { min: 40, max: 59, label: 'Fair', color: 'yellow' },
  POOR: { min: 0, max: 39, label: 'Needs Improvement', color: 'red' },
};

export const MATCH_SCORE_RANGES = {
  EXCELLENT: { min: 80, max: 100, label: 'Excellent Match', color: 'green' },
  VERY_GOOD: { min: 70, max: 79, label: 'Very Good Match', color: 'blue' },
  GOOD: { min: 60, max: 69, label: 'Good Match', color: 'cyan' },
  FAIR: { min: 50, max: 59, label: 'Fair Match', color: 'yellow' },
  POOR: { min: 0, max: 49, label: 'Needs Work', color: 'red' },
};

export const TABS = {
  ATS: 'ats',
  JD_MATCH: 'jd-match',
  COMPARE: 'compare',
};

export const ERROR_MESSAGES = {
  RESUME_TOO_SHORT: `Resume must be at least ${RESUME_MIN_LENGTH} characters`,
  JD_TOO_SHORT: `Job description must be at least ${JD_MIN_LENGTH} characters`,
  FILE_TOO_LARGE: `File size must be less than 10MB`,
  INVALID_FILE_FORMAT: `Please upload a PDF, DOCX, or DOC file`,
  NO_FILE_PROVIDED: 'Please upload a file or enter resume text',
  NO_JD_PROVIDED: 'Please enter a job description',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export const SUCCESS_MESSAGES = {
  ATS_ANALYZED: 'Resume analyzed successfully!',
  JD_MATCHED: 'Resume matched with job description!',
  JDS_COMPARED: 'Job descriptions compared successfully!',
};