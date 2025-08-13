import { FILE_SIZE_LIMITS, SUPPORTED_FILE_TYPES, ERROR_MESSAGES } from '../lib/constants';

/**
 * Validate file before processing
 * @param {File} file - File object to validate
 * @param {string} category - File category (image, pdf, audio, etc.)
 * @returns {Object} - Validation result
 */
export function validateFile(file, category = 'general') {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  // Check file size
  const sizeLimit = FILE_SIZE_LIMITS[category] || FILE_SIZE_LIMITS.general;
  if (file.size > sizeLimit) {
    errors.push(`${ERROR_MESSAGES.fileSize}. Maximum allowed: ${formatFileSize(sizeLimit)}`);
  }
  
  // Check file type
  const allowedTypes = SUPPORTED_FILE_TYPES[category];
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    errors.push(`${ERROR_MESSAGES.fileType}. Supported formats: ${allowedTypes.join(', ')}`);
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }
  };
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} - Data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Read file as array buffer
 * @param {File} file - File to read
 * @returns {Promise<ArrayBuffer>} - Array buffer
 */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Read file as text
 * @param {File} file - File to read
 * @param {string} encoding - Text encoding (default: UTF-8)
 * @returns {Promise<string>} - File content as text
 */
export function readFileAsText(file, encoding = 'UTF-8') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsText(file, encoding);
  });
}

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Download filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Convert image to different format
 * @param {File} file - Image file
 * @param {string} format - Target format (jpeg, png, webp)
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<Blob>} - Converted image blob
 */
export function convertImageFormat(file, format = 'jpeg', quality = 0.9) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Handle PNG transparency for JPEG conversion
      if (format === 'jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => resolve(blob),
        `image/${format}`,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Resize image
 * @param {File} file - Image file
 * @param {Object} dimensions - Target dimensions {width, height}
 * @param {boolean} maintainAspectRatio - Whether to maintain aspect ratio
 * @returns {Promise<Blob>} - Resized image blob
 */
export function resizeImage(file, dimensions, maintainAspectRatio = true) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = dimensions;
      
      if (maintainAspectRatio) {
        const aspectRatio = img.width / img.height;
        
        if (width && !height) {
          height = width / aspectRatio;
        } else if (height && !width) {
          width = height * aspectRatio;
        } else if (width && height) {
          const targetAspectRatio = width / height;
          if (aspectRatio > targetAspectRatio) {
            height = width / aspectRatio;
          } else {
            width = height * aspectRatio;
          }
        }
      }
      
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => resolve(blob));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Compress image
 * @param {File} file - Image file
 * @param {number} quality - Compression quality (0-1)
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} - Compressed image blob
 */
export function compressImage(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => resolve(blob),
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Extract text from image using OCR (placeholder for future implementation)
 * @param {File} file - Image file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromImage(file) {
  // Placeholder for OCR implementation
  // Would use libraries like Tesseract.js
  throw new Error('OCR functionality not implemented yet');
}

/**
 * Create image thumbnail
 * @param {File} file - Image file
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<Blob>} - Thumbnail blob
 */
export function createImageThumbnail(file, size = 150) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      
      // Calculate crop area to maintain aspect ratio
      const sourceSize = Math.min(img.width, img.height);
      const sourceX = (img.width - sourceSize) / 2;
      const sourceY = (img.height - sourceSize) / 2;
      
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceSize, sourceSize,
        0, 0, size, size
      );
      
      canvas.toBlob((blob) => resolve(blob));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get image metadata
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Image metadata
 */
export function getImageMetadata(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        size: file.size,
        type: file.type,
        name: file.name,
        lastModified: new Date(file.lastModified)
      });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Check browser support for file operations
 * @returns {Object} - Browser support information
 */
export function checkBrowserSupport() {
  return {
    fileAPI: !!(window.File && window.FileReader && window.FileList && window.Blob),
    canvas: !!document.createElement('canvas').getContext,
    webGL: !!document.createElement('canvas').getContext('webgl'),
    webWorkers: !!window.Worker,
    webAssembly: !!window.WebAssembly,
    mediaRecorder: !!window.MediaRecorder,
    speechSynthesis: !!window.speechSynthesis,
    speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
}

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @param {string} suffix - Suffix to add
 * @param {string} extension - New extension (optional)
 * @returns {string} - Unique filename
 */
export function generateUniqueFilename(originalName, suffix = '', extension = null) {
  const timestamp = Date.now();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const originalExtension = originalName.split('.').pop();
  const finalExtension = extension || originalExtension;
  
  return `${baseName}${suffix ? '_' + suffix : ''}_${timestamp}.${finalExtension}`;
}
