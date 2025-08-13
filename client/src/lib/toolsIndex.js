// Comprehensive tools registry for SEO and search functionality
export const TOOLS_REGISTRY = {
  pdf: [
    {
      name: 'PDF Merger',
      slug: 'merge',
      path: '/pdf/merge',
      description: 'Combine multiple PDF files into one document with custom ordering',
      keywords: 'pdf merge, combine pdf, join pdf files, pdf joiner',
      icon: 'fas fa-object-group',
      color: 'text-red-400',
      category: 'PDF Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Merger Tool',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }
    },
    {
      name: 'PDF Splitter',
      slug: 'split',
      path: '/pdf/split',
      description: 'Split PDF files into individual pages or custom ranges',
      keywords: 'pdf split, separate pdf, extract pdf pages, pdf divider',
      icon: 'fas fa-cut',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Compressor',
      slug: 'compress',
      path: '/pdf/compress',
      description: 'Reduce PDF file size while maintaining quality',
      keywords: 'pdf compress, reduce pdf size, optimize pdf, pdf optimizer',
      icon: 'fas fa-compress-arrows-alt',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF to Word',
      slug: 'to-word',
      path: '/pdf/to-word',
      description: 'Convert PDF documents to editable Word files',
      keywords: 'pdf to word, pdf to docx, convert pdf, pdf converter',
      icon: 'fas fa-file-word',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'Word to PDF',
      slug: 'word-to-pdf',
      path: '/pdf/word-to-pdf',
      description: 'Convert Word documents to PDF format',
      keywords: 'word to pdf, docx to pdf, document converter',
      icon: 'fas fa-file-pdf',
      color: 'text-red-400',
      category: 'PDF Tools'
    }
  ],
  image: [
    {
      name: 'Background Remover',
      slug: 'remove-background',
      path: '/image/remove-background',
      description: 'Remove image backgrounds automatically using AI',
      keywords: 'remove background, background remover, transparent background, ai background removal',
      icon: 'fas fa-magic',
      color: 'text-green-400',
      category: 'Image Tools',
      featured: true
    },
    {
      name: 'Image Resizer',
      slug: 'resize',
      path: '/image/resize',
      description: 'Resize images to specific dimensions or percentages',
      keywords: 'image resize, resize photo, image dimensions, scale image',
      icon: 'fas fa-expand-arrows-alt',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Image Compressor',
      slug: 'compress',
      path: '/image/compress',
      description: 'Reduce image file size while maintaining quality',
      keywords: 'image compress, optimize image, reduce image size, image optimizer',
      icon: 'fas fa-compress',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Image Converter',
      slug: 'convert',
      path: '/image/convert',
      description: 'Convert images between different formats (PNG, JPG, WebP)',
      keywords: 'image converter, png to jpg, format converter, image format',
      icon: 'fas fa-exchange-alt',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Image Cropper',
      slug: 'crop',
      path: '/image/crop',
      description: 'Crop images to specific dimensions or aspect ratios',
      keywords: 'image crop, crop photo, image cutter, trim image',
      icon: 'fas fa-crop',
      color: 'text-green-400',
      category: 'Image Tools'
    }
  ],
  audio: [
    {
      name: 'Audio Converter',
      slug: 'convert',
      path: '/audio/convert',
      description: 'Convert audio files between different formats',
      keywords: 'audio converter, mp3 converter, audio format, convert audio',
      icon: 'fas fa-exchange-alt',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Cutter',
      slug: 'cut',
      path: '/audio/cut',
      description: 'Cut and trim audio files to specific durations',
      keywords: 'audio cutter, trim audio, cut audio, audio trimmer',
      icon: 'fas fa-cut',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Voice Recorder',
      slug: 'record',
      path: '/audio/record',
      description: 'Record audio directly from your microphone',
      keywords: 'voice recorder, audio recorder, record voice, microphone recorder',
      icon: 'fas fa-microphone',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Text to Speech',
      slug: 'text-to-speech',
      path: '/audio/text-to-speech',
      description: 'Convert text to natural-sounding speech',
      keywords: 'text to speech, tts, voice synthesis, speech generator',
      icon: 'fas fa-volume-up',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Joiner',
      slug: 'join',
      path: '/audio/join',
      description: 'Combine multiple audio files into one',
      keywords: 'audio joiner, merge audio, combine audio, audio merger',
      icon: 'fas fa-link',
      color: 'text-purple-400',
      category: 'Audio Tools'
    }
  ],
  text: [
    {
      name: 'Word Counter',
      slug: 'word-counter',
      path: '/text/word-counter',
      description: 'Count words, characters, paragraphs, and analyze text',
      keywords: 'word counter, character counter, text analysis, word count',
      icon: 'fas fa-font',
      color: 'text-blue-400',
      category: 'Text Tools',
      featured: true
    },
    {
      name: 'Case Converter',
      slug: 'case-converter',
      path: '/text/case-converter',
      description: 'Convert text between different cases (upper, lower, title)',
      keywords: 'case converter, text case, uppercase, lowercase, title case',
      icon: 'fas fa-text-height',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Text Formatter',
      slug: 'formatter',
      path: '/text/formatter',
      description: 'Format and clean up text with various options',
      keywords: 'text formatter, format text, clean text, text cleaner',
      icon: 'fas fa-align-left',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Find and Replace',
      slug: 'find-replace',
      path: '/text/find-replace',
      description: 'Find and replace text with regex support',
      keywords: 'find replace, text replace, regex replace, search replace',
      icon: 'fas fa-search',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Base64 Encoder',
      slug: 'base64',
      path: '/text/base64',
      description: 'Encode and decode text using Base64',
      keywords: 'base64 encoder, base64 decoder, encode text, decode text',
      icon: 'fas fa-code',
      color: 'text-blue-400',
      category: 'Text Tools'
    }
  ],
  productivity: [
    {
      name: 'Unit Converter',
      slug: 'unit-converter',
      path: '/productivity/unit-converter',
      description: 'Convert between different units of measurement',
      keywords: 'unit converter, measurement converter, length converter, weight converter',
      icon: 'fas fa-balance-scale',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Age Calculator',
      slug: 'age-calculator',
      path: '/productivity/age-calculator',
      description: 'Calculate age in years, months, days, and more',
      keywords: 'age calculator, calculate age, age counter, birthday calculator',
      icon: 'fas fa-birthday-cake',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'BMI Calculator',
      slug: 'bmi-calculator',
      path: '/productivity/bmi-calculator',
      description: 'Calculate Body Mass Index and health metrics',
      keywords: 'bmi calculator, body mass index, health calculator, weight calculator',
      icon: 'fas fa-weight',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Percentage Calculator',
      slug: 'percentage',
      path: '/productivity/percentage',
      description: 'Calculate percentages, percentage change, and more',
      keywords: 'percentage calculator, percent calculator, percentage change',
      icon: 'fas fa-percent',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Date Calculator',
      slug: 'date-calculator',
      path: '/productivity/date-calculator',
      description: 'Calculate date differences and add/subtract dates',
      keywords: 'date calculator, date difference, date math, calendar calculator',
      icon: 'fas fa-calendar',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    }
  ],
  finance: [
    {
      name: 'EMI Calculator',
      slug: 'emi-calculator',
      path: '/finance/emi-calculator',
      description: 'Calculate loan EMI, interest, and repayment schedule',
      keywords: 'emi calculator, loan calculator, monthly payment, loan emi',
      icon: 'fas fa-calculator',
      color: 'text-emerald-400',
      category: 'Finance Tools',
      featured: true
    },
    {
      name: 'SIP Calculator',
      slug: 'sip-calculator',
      path: '/finance/sip-calculator',
      description: 'Calculate SIP returns and investment growth',
      keywords: 'sip calculator, investment calculator, mutual fund calculator, sip returns',
      icon: 'fas fa-chart-line',
      color: 'text-emerald-400',
      category: 'Finance Tools'
    },
    {
      name: 'Compound Interest',
      slug: 'compound-interest',
      path: '/finance/compound-interest',
      description: 'Calculate compound interest and investment growth',
      keywords: 'compound interest, interest calculator, investment growth, compound calculator',
      icon: 'fas fa-coins',
      color: 'text-emerald-400',
      category: 'Finance Tools'
    },
    {
      name: 'Currency Converter',
      slug: 'currency-converter',
      path: '/finance/currency-converter',
      description: 'Convert between different currencies with live rates',
      keywords: 'currency converter, exchange rate, currency exchange, money converter',
      icon: 'fas fa-exchange-alt',
      color: 'text-emerald-400',
      category: 'Finance Tools'
    },
    {
      name: 'Tip Calculator',
      slug: 'tip-calculator',
      path: '/finance/tip-calculator',
      description: 'Calculate tips and split bills among multiple people',
      keywords: 'tip calculator, bill calculator, tip splitter, restaurant calculator',
      icon: 'fas fa-hand-holding-usd',
      color: 'text-emerald-400',
      category: 'Finance Tools'
    }
  ]
};

// Get all tools as flat array
export function getAllTools() {
  return Object.values(TOOLS_REGISTRY).flat();
}

// Get tools by category
export function getToolsByCategory(category) {
  return TOOLS_REGISTRY[category] || [];
}

// Get featured tools
export function getFeaturedTools() {
  return getAllTools().filter(tool => tool.featured);
}

// Search tools by query
export function searchTools(query) {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return getAllTools().filter(tool => 
    tool.name.toLowerCase().includes(searchTerm) ||
    tool.description.toLowerCase().includes(searchTerm) ||
    tool.keywords.toLowerCase().includes(searchTerm) ||
    tool.category.toLowerCase().includes(searchTerm)
  );
}

// Get tool by category and slug
export function getToolBySlug(category, slug) {
  const tools = getToolsByCategory(category);
  return tools.find(tool => tool.slug === slug);
}

// Category metadata
export const CATEGORIES = {
  pdf: {
    name: 'PDF Tools',
    description: 'Professional PDF editing and conversion tools',
    icon: 'fas fa-file-pdf',
    color: 'text-red-400',
    gradient: 'from-red-500 to-red-600'
  },
  image: {
    name: 'Image Tools',
    description: 'Advanced image processing and editing tools',
    icon: 'fas fa-image',
    color: 'text-green-400',
    gradient: 'from-green-500 to-green-600'
  },
  audio: {
    name: 'Audio Tools',
    description: 'Professional audio editing and conversion tools',
    icon: 'fas fa-music',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-purple-600'
  },
  text: {
    name: 'Text Tools',
    description: 'Powerful text processing and analysis tools',
    icon: 'fas fa-font',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-blue-600'
  },
  productivity: {
    name: 'Productivity Tools',
    description: 'Essential calculators and utility tools',
    icon: 'fas fa-calculator',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-500'
  },
  finance: {
    name: 'Finance Tools',
    description: 'Financial calculators and planning tools',
    icon: 'fas fa-chart-line',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-600'
  }
};
