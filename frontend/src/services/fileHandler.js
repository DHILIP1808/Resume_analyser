// services/fileHandler.js
import { SUPPORTED_FORMATS, MAX_FILE_SIZE, RESUME_MIN_LENGTH } from '../utils/constants';

/**
 * Validate file before upload
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    };
  }

  // Check file format
  const fileExt = '.' + file.name.split('.').pop().toLowerCase();
  if (!SUPPORTED_FORMATS.includes(fileExt)) {
    return {
      valid: false,
      error: `Invalid file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate resume text
 */
export const validateResumeText = (text) => {
  if (!text || !text.trim()) {
    return { valid: false, error: 'Resume text is empty' };
  }

  if (text.length < RESUME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Resume must be at least ${RESUME_MIN_LENGTH} characters. Current: ${text.length}`
    };
  }

  return { valid: true };
};

/**
 * Validate JD text
 */
export const validateJDText = (text) => {
  if (!text || !text.trim()) {
    return { valid: false, error: 'Job description is empty' };
  }

  if (text.length < 200) {
    return {
      valid: false,
      error: `Job description must be at least 200 characters. Current: ${text.length}`
    };
  }

  return { valid: true };
};

/**
 * Read file as text (for preview)
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error));
    };
    
    // For text files, read as text
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      // For other formats, we'll send the file directly to backend
      reject(new Error('For PDF/DOCX files, upload directly. Backend handles extraction.'));
    }
  });
};

/**
 * Get file info
 */
export const getFileInfo = (file) => {
  if (!file) return null;

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeInMB: (file.size / 1024 / 1024).toFixed(2),
    extension: '.' + file.name.split('.').pop().toLowerCase(),
    lastModified: new Date(file.lastModified).toLocaleDateString()
  };
};

/**
 * Convert file to base64 (optional)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Validate both resume and JD
 */
export const validateResumeAndJD = (resumeText, resumeFile, jdText) => {
  // Check resume input
  if (!resumeText && !resumeFile) {
    return { valid: false, error: 'Please provide resume text or upload a file' };
  }

  if (resumeText) {
    const textValidation = validateResumeText(resumeText);
    if (!textValidation.valid) {
      return textValidation;
    }
  }

  if (resumeFile) {
    const fileValidation = validateFile(resumeFile);
    if (!fileValidation.valid) {
      return fileValidation;
    }
  }

  // Check JD input
  const jdValidation = validateJDText(jdText);
  if (!jdValidation.valid) {
    return jdValidation;
  }

  return { valid: true };
};

/**
 * Extract text preview from file name
 */
export const getFilePreview = (fileName) => {
  if (!fileName) return '';
  
  const ext = '.' + fileName.split('.').pop().toLowerCase();
  const nameWithoutExt = fileName.replace(ext, '');
  
  return {
    name: nameWithoutExt,
    extension: ext,
    displayName: fileName
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Create FormData for file upload
 */
export const createFormDataWithFile = (file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });
  
  return formData;
};

/**
 * Create FormData for text input
 */
export const createFormDataWithText = (resumeText, jdText = null) => {
  const formData = new FormData();
  formData.append('resume_text', resumeText);
  
  if (jdText) {
    formData.append('jd_text', jdText);
  }
  
  return formData;
};