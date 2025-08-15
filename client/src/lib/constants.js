// Application constants
export const APP_NAME = 'ToolsUniverse';
export const APP_DESCRIPTION = 'Professional online toolkit with 60+ free tools for PDF editing, image conversion, audio processing, text manipulation, and financial calculations. Secure browser-based processing, no registration required.';
export const APP_URL = 'https://toolsuniverse.com';
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

// Enhanced SEO defaults for Google Page 1 ranking
export const SEO_DEFAULTS = {
  titleTemplate: '%s | ToolsUniverse - Free Online Tools',
  defaultTitle: 'ToolsUniverse - 60+ Free Online Tools for PDF, Image, Audio & Text Processing',
  description: 'Professional online tools for PDF editing, image conversion, audio processing, text manipulation & financial calculations. 100% free, secure, no registration required. Works offline.',
  keywords: 'free online tools, PDF tools, image converter, audio editor, text tools, finance calculator, productivity tools, online converter, file processor, document tools, web tools, browser tools, client-side processing, privacy-focused tools',
  ogImage: '/og-image.jpg',
  twitterHandle: '@toolsuniverse',
  // Advanced SEO metadata
  author: 'ToolsUniverse Team',
  publisher: 'ToolsUniverse',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  themeColor: '#0891b2',
  colorScheme: 'dark',
  // High-value long-tail keywords for ranking
  longTailKeywords: [
    'best free online tools 2024',
    'professional PDF tools online',
    'secure file processing browser',
    'privacy-focused online tools',
    'no registration required tools',
    'client-side file processing',
    'browser-based productivity tools',
    'free alternative to premium tools',
    'offline-capable web tools',
    'enterprise-grade free tools'
  ],
  // Semantic keywords for topic authority
  semanticKeywords: [
    'document processing',
    'file manipulation',
    'digital workflow',
    'productivity suite',
    'business tools',
    'creative tools',
    'utility software',
    'web-based applications',
    'SaaS alternatives',
    'professional toolkit'
  ],
  // Geographic and intent-based keywords
  locationKeywords: [
    'online tools worldwide',
    'global accessibility tools',
    'international file tools',
    'multilingual support tools'
  ],
  // Schema.org data
  organizationSchema: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'ToolsUniverse',
    'url': 'https://toolsuniverse.com',
    'logo': 'https://toolsuniverse.com/logo.png',
    'description': 'Professional online tools platform offering 60+ free tools for PDF, image, audio, text, and financial operations',
    'sameAs': [
      'https://github.com/toolsuniverse',
      'https://twitter.com/toolsuniverse',
      'https://linkedin.com/company/toolsuniverse'
    ],
    'foundingDate': '2024',
    'numberOfEmployees': '10-50',
    'knowsAbout': [
      'PDF Processing',
      'Image Conversion',
      'Audio Editing',
      'Text Manipulation',
      'Financial Calculations',
      'Productivity Tools',
      'File Processing',
      'Web Development',
      'Privacy Protection',
      'Browser Applications'
    ]
  }
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

// Enhanced Tool categories configuration with SEO optimization
export const TOOL_CATEGORIES = {
  pdf: {
    limit: 15,
    name: 'PDF Tools',
    slug: 'pdf',
    description: 'Professional PDF editing, merging, splitting, and conversion tools. Compress, secure, and manipulate PDF documents with enterprise-grade quality.',
    seoTitle: 'Free PDF Tools - Edit, Merge, Split & Convert PDF Files Online',
    metaDescription: 'Professional PDF tools for editing, merging, splitting, compressing, and converting PDF files. 100% free, secure browser-based processing. No upload required.',
    keywords: 'PDF tools, PDF editor, PDF merger, PDF splitter, PDF converter, online PDF tools, free PDF editor, PDF compression, PDF security, document tools',
    longTailKeywords: 'best free PDF tools online, professional PDF editor browser, merge PDF files without upload, split PDF pages online free',
    color: 'red',
    icon: 'fas fa-file-pdf',
    popularity: 95,
    averageSearchVolume: 50000
  },
  image: {
    limit: 17,
    name: 'Image Tools',
    slug: 'image',
    description: 'Advanced image processing, conversion, and editing tools. Resize, compress, enhance, and transform images with professional quality results.',
    seoTitle: 'Free Image Tools - Convert, Resize, Compress & Edit Images Online',
    metaDescription: 'Professional image tools for converting, resizing, compressing, and editing images. Support all formats. Free, secure, browser-based processing.',
    keywords: 'image tools, image converter, image resizer, image compressor, photo editor, online image editor, free image tools, image processing, photo tools',
    longTailKeywords: 'best free image converter online, professional photo editor browser, compress images without quality loss, resize images bulk online',
    color: 'green',
    icon: 'fas fa-image',
    popularity: 90,
    averageSearchVolume: 45000
  },
  audio: {
    limit: 20,
    name: 'Audio Tools',
    slug: 'audio',
    description: 'Professional audio editing, conversion, and enhancement tools. Cut, join, compress, and process audio files with studio-quality results.',
    seoTitle: 'Free Audio Tools - Edit, Convert & Process Audio Files Online',
    metaDescription: 'Professional audio tools for editing, converting, and processing audio files. Cut, join, compress, and enhance audio with studio quality. Free and secure.',
    keywords: 'audio tools, audio editor, audio converter, audio cutter, music editor, online audio editor, free audio tools, sound editor, audio processing',
    longTailKeywords: 'best free audio editor online, professional music editor browser, cut audio files online free, convert audio formats without upload',
    color: 'purple',
    icon: 'fas fa-music',
    popularity: 85,
    averageSearchVolume: 35000
  },
  text: {
    limit: 15,
    name: 'Text Tools',
    slug: 'text',
    description: 'Powerful text processing, analysis, and manipulation tools. Format, encode, count, and transform text with advanced algorithms.',
    seoTitle: 'Free Text Tools - Process, Format & Analyze Text Online',
    metaDescription: 'Professional text tools for processing, formatting, and analyzing text. Word count, case conversion, encoding, and more. Free browser-based tools.',
    keywords: 'text tools, word counter, case converter, text formatter, text analyzer, online text tools, free text tools, string tools, text processing',
    longTailKeywords: 'best free text processing tools, professional text formatter online, word count tool with statistics, text case converter online',
    color: 'blue',
    icon: 'fas fa-font',
    popularity: 80,
    averageSearchVolume: 25000
  },
  productivity: {
    limit: 20,
    name: 'Productivity Tools',
    slug: 'productivity',
    description: 'Essential productivity and utility tools. Calculators, generators, converters, and time-saving tools for daily tasks and workflows.',
    seoTitle: 'Free Productivity Tools - Calculators, Generators & Utilities Online',
    metaDescription: 'Essential productivity tools including calculators, generators, converters, and utilities. Boost your workflow with professional-grade tools. Free and secure.',
    keywords: 'productivity tools, calculator tools, utility tools, online calculator, productivity suite, workflow tools, business tools, efficiency tools',
    longTailKeywords: 'best free productivity tools online, professional calculator suite browser, business utility tools free, workflow automation tools',
    color: 'yellow',
    icon: 'fas fa-calculator',
    popularity: 75,
    averageSearchVolume: 20000
  },
  finance: {
    limit: 10,
    name: 'Finance Tools',
    slug: 'finance',
    description: 'Professional financial calculators and planning tools. EMI, loan, investment, tax, and retirement calculators with accurate algorithms.',
    seoTitle: 'Free Finance Tools - EMI, Loan & Investment Calculators Online',
    metaDescription: 'Professional financial calculators for EMI, loans, investments, taxes, and retirement planning. Accurate algorithms, free to use, secure calculations.',
    keywords: 'finance calculator, EMI calculator, loan calculator, investment calculator, financial tools, online calculator, finance planning, money calculator',
    longTailKeywords: 'best free EMI calculator online, accurate loan calculator tool, investment return calculator free, financial planning tools online',
    color: 'emerald',
    icon: 'fas fa-chart-line',
    popularity: 70,
    averageSearchVolume: 30000
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

// Advanced SEO Configuration for Page 1 Rankings
export const ADVANCED_SEO = {
  // Core Web Vitals targets
  coreWebVitals: {
    LCP: 1.5, // Largest Contentful Paint (seconds)
    FID: 50,  // First Input Delay (ms)
    CLS: 0.05, // Cumulative Layout Shift
    INP: 150   // Interaction to Next Paint (ms)
  },
  
  // High-authority topics for content clusters
  topicClusters: {
    'file-processing': {
      pillarPage: '/file-processing-tools',
      relatedTerms: ['document processing', 'file manipulation', 'digital workflow', 'file converter'],
      searchVolume: 100000
    },
    'productivity-software': {
      pillarPage: '/productivity-tools',
      relatedTerms: ['business tools', 'workflow automation', 'efficiency tools', 'utility software'],
      searchVolume: 80000
    },
    'online-converters': {
      pillarPage: '/online-converters',
      relatedTerms: ['file converter', 'format converter', 'media converter', 'document converter'],
      searchVolume: 120000
    }
  },
  
  // Featured snippets targeting
  featuredSnippets: {
    howTo: {
      pattern: 'How to [action] [file type] online',
      examples: ['How to merge PDF files online', 'How to compress images online', 'How to convert audio files']
    },
    definition: {
      pattern: 'What is [tool name]',
      examples: ['What is PDF merger', 'What is image compressor', 'What is audio converter']
    },
    comparison: {
      pattern: '[Tool A] vs [Tool B]',
      examples: ['Online tools vs desktop software', 'Free vs paid converters']
    }
  },
  
  // International SEO
  hreflang: {
    'en': 'en',
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'en-CA': 'en-CA',
    'en-AU': 'en-AU'
  },
  
  // Rich snippets schema types
  richSnippets: {
    software: 'SoftwareApplication',
    howTo: 'HowTo',
    faq: 'FAQPage',
    article: 'Article',
    organization: 'Organization',
    breadcrumb: 'BreadcrumbList',
    rating: 'AggregateRating'
  }
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
