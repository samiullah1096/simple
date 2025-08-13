// Application constants
export const APP_NAME = 'ToolsUniverse';
export const APP_DESCRIPTION = '60+ professional online tools for PDF, Image, Audio, Text, and Finance operations';
export const APP_URL = 'https://toolsuniverse.github.io';
export const APP_VERSION = '1.0.0';

// Social media links
export const SOCIAL_LINKS = {
  github: 'https://github.com/toolsuniverse',
  twitter: 'https://twitter.com/toolsuniverse',
  linkedin: 'https://linkedin.com/company/toolsuniverse',
  discord: 'https://discord.gg/toolsuniverse'
};

// Contact information
export const CONTACT_INFO = {
  email: 'contact@toolsuniverse.com',
  support: 'support@toolsuniverse.com',
  business: 'business@toolsuniverse.com'
};

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  image: 50 * 1024 * 1024, // 50MB
  pdf: 100 * 1024 * 1024,  // 100MB
  audio: 100 * 1024 * 1024, // 100MB
  text: 10 * 1024 * 1024,   // 10MB
  general: 50 * 1024 * 1024 // 50MB
};

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
  pdf: ['application/pdf'],
  audio: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/webm'],
  text: ['text/plain', 'text/csv', 'application/json', 'text/html', 'text/css', 'text/javascript'],
  document: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// API endpoints (for future expansion)
export const API_ENDPOINTS = {
  health: '/api/health',
  analytics: '/api/analytics',
  feedback: '/api/feedback'
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,  // Largest Contentful Paint (ms)
  FID: 100,   // First Input Delay (ms)
  CLS: 0.1,   // Cumulative Layout Shift
  INP: 200    // Interaction to Next Paint (ms)
};

// SEO defaults
export const SEO_DEFAULTS = {
  titleTemplate: '%s | ToolsUniverse',
  defaultTitle: 'ToolsUniverse - All-in-One Online Tools',
  description: '60+ professional online tools for PDF, Image, Audio, Text, and Finance operations. Free, secure, and privacy-focused.',
  keywords: 'online tools, PDF tools, image converter, audio editor, text tools, finance calculator, free tools, productivity',
  ogImage: '/og-image.jpg',
  twitterHandle: '@toolsuniverse'
};

// Animation delays and durations
export const ANIMATIONS = {
  fastDuration: 0.2,
  normalDuration: 0.3,
  slowDuration: 0.5,
  staggerDelay: 0.1,
  pageTransition: 0.4
};

// Breakpoints (should match Tailwind config)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'theme',
  cookieConsent: 'cookieConsent',
  userPreferences: 'userPreferences',
  recentTools: 'recentTools'
};

// Error messages
export const ERROR_MESSAGES = {
  fileSize: 'File size exceeds the maximum limit',
  fileType: 'File type not supported',
  networkError: 'Network error. Please check your connection',
  processingError: 'Error processing file. Please try again',
  browserSupport: 'This feature is not supported in your browser'
};

// Success messages
export const SUCCESS_MESSAGES = {
  fileProcessed: 'File processed successfully',
  fileSaved: 'File saved successfully',
  linkCopied: 'Link copied to clipboard',
  settingsSaved: 'Settings saved successfully'
};

// Tool categories configuration
export const TOOL_CATEGORIES = {
  pdf: {
    limit: 15,
    description: 'Professional PDF editing and conversion tools',
    color: 'red'
  },
  image: {
    limit: 15,
    description: 'Advanced image processing and editing tools',
    color: 'green'
  },
  audio: {
    limit: 15,
    description: 'Professional audio editing and conversion tools',
    color: 'purple'
  },
  text: {
    limit: 15,
    description: 'Powerful text processing and analysis tools',
    color: 'blue'
  },
  productivity: {
    limit: 15,
    description: 'Essential calculators and utility tools',
    color: 'yellow'
  },
  finance: {
    limit: 15,
    description: 'Financial calculators and planning tools',
    color: 'emerald'
  }
};

// Feature flags
export const FEATURE_FLAGS = {
  enableAnalytics: false,
  enablePWA: false,
  enableOfflineMode: false,
  enableBetaFeatures: false,
  enableUserAccounts: false
};

// Privacy and security settings
export const PRIVACY_SETTINGS = {
  enableCookies: true,
  enableAnalytics: false,
  enableAds: true,
  dataRetentionDays: 0, // 0 means no data retention
  encryptLocalStorage: false
};

// Default tool settings
export const DEFAULT_TOOL_SETTINGS = {
  pdf: {
    quality: 'high',
    compression: 'medium',
    format: 'pdf'
  },
  image: {
    quality: 90,
    format: 'original',
    maxDimensions: { width: 4096, height: 4096 }
  },
  audio: {
    quality: 'high',
    format: 'mp3',
    bitrate: 192
  }
};
