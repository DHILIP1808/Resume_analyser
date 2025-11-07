// services/api.js
const API_BASE_URL = 'http://localhost:8000';

// Headers for JSON requests
const jsonHeaders = {
  'Content-Type': 'application/json',
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: jsonHeaders,
    });
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Get ATS score for resume text
export const getATSScore = async (resumeText) => {
  try {
    const formData = new FormData();
    formData.append('resume_text', resumeText);

    const response = await fetch(`${API_BASE_URL}/api/ats-score`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze resume');
    }

    return await response.json();
  } catch (error) {
    console.error('ATS score error:', error);
    throw error;
  }
};

// Get ATS score for resume file
export const getATSScoreFromFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/ats-score`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze resume');
    }

    return await response.json();
  } catch (error) {
    console.error('ATS score file error:', error);
    throw error;
  }
};

// Get JD match analysis
export const getJDMatch = async (resumeText, jdText) => {
  try {
    const formData = new FormData();
    formData.append('resume_text', resumeText);
    formData.append('jd_text', jdText);

    const response = await fetch(`${API_BASE_URL}/api/jd-match`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to match resume with job description');
    }

    return await response.json();
  } catch (error) {
    console.error('JD match error:', error);
    throw error;
  }
};

// Get JD match for file
export const getJDMatchFromFile = async (file, jdText) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jd_text', jdText);

    const response = await fetch(`${API_BASE_URL}/api/jd-match`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to match resume with job description');
    }

    return await response.json();
  } catch (error) {
    console.error('JD match file error:', error);
    throw error;
  }
};

// Compare multiple job descriptions
export const compareMultipleJDs = async (resumeText, jdArray) => {
  try {
    const formData = new FormData();
    formData.append('resume_text', resumeText);
    
    jdArray.forEach((jd, index) => {
      formData.append('jd_texts', jd);
    });

    const response = await fetch(`${API_BASE_URL}/api/compare-jds`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to compare job descriptions');
    }

    return await response.json();
  } catch (error) {
    console.error('Compare JDs error:', error);
    throw error;
  }
};

// Compare multiple JDs from file
export const compareMultipleJDsFromFile = async (file, jdArray) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    jdArray.forEach((jd) => {
      formData.append('jd_texts', jd);
    });

    const response = await fetch(`${API_BASE_URL}/api/compare-jds`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to compare job descriptions');
    }

    return await response.json();
  } catch (error) {
    console.error('Compare JDs file error:', error);
    throw error;
  }
};