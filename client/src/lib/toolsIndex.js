// Comprehensive tools registry for SEO and search functionality
export const TOOLS_REGISTRY = {
  pdf: [
    {
      name: 'PDF Merger',
      slug: 'merge',
      path: '/pdf/merge',
      description: 'Combine multiple PDF files into one document with custom ordering and advanced merge options',
      keywords: 'pdf merge, combine pdf, join pdf files, pdf joiner, merge documents',
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
      description: 'Split PDF files into individual pages or custom ranges with precise page extraction',
      keywords: 'pdf split, separate pdf, extract pdf pages, pdf divider, page extractor',
      icon: 'fas fa-cut',
      color: 'text-red-400',
      category: 'PDF Tools',
      featured: true
    },
    {
      name: 'PDF Compressor',
      slug: 'compress',
      path: '/pdf/compress',
      description: 'Reduce PDF file size while maintaining quality with advanced compression algorithms',
      keywords: 'pdf compress, reduce pdf size, optimize pdf, pdf optimizer, file size reducer',
      icon: 'fas fa-compress-arrows-alt',
      color: 'text-red-400',
      category: 'PDF Tools',
      featured: true
    },
    {
      name: 'PDF to Word',
      slug: 'to-word',
      path: '/pdf/to-word',
      description: 'Convert PDF documents to editable Word files with preserved formatting',
      keywords: 'pdf to word, pdf to docx, convert pdf, pdf converter, document conversion',
      icon: 'fas fa-file-word',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'Word to PDF',
      slug: 'word-to-pdf',
      path: '/pdf/word-to-pdf',
      description: 'Convert Word documents to PDF format with professional quality output',
      keywords: 'word to pdf, docx to pdf, document converter, office to pdf',
      icon: 'fas fa-file-pdf',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF to JPG',
      slug: 'to-jpg',
      path: '/pdf/to-jpg',
      description: 'Convert PDF pages to high-quality JPG images with custom resolution',
      keywords: 'pdf to jpg, pdf to image, convert pdf pages, pdf image converter',
      icon: 'fas fa-file-image',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'JPG to PDF',
      slug: 'jpg-to-pdf',
      path: '/pdf/jpg-to-pdf',
      description: 'Convert JPG images to PDF documents with multiple layout options',
      keywords: 'jpg to pdf, image to pdf, photo to pdf, picture converter',
      icon: 'fas fa-images',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Password Remover',
      slug: 'remove-password',
      path: '/pdf/remove-password',
      description: 'Remove password protection from PDF files securely',
      keywords: 'remove pdf password, unlock pdf, pdf password remover, decrypt pdf',
      icon: 'fas fa-unlock',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Password Protector',
      slug: 'add-password',
      path: '/pdf/add-password',
      description: 'Add password protection to PDF files with encryption',
      keywords: 'pdf password, protect pdf, encrypt pdf, secure pdf, pdf security',
      icon: 'fas fa-lock',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Watermark',
      slug: 'watermark',
      path: '/pdf/watermark',
      description: 'Add text or image watermarks to PDF documents',
      keywords: 'pdf watermark, add watermark, pdf branding, document watermark',
      icon: 'fas fa-stamp',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Page Organizer',
      slug: 'organize',
      path: '/pdf/organize',
      description: 'Reorder, rotate, and organize PDF pages with drag-and-drop interface',
      keywords: 'pdf organize, reorder pages, rotate pdf, pdf page manager',
      icon: 'fas fa-sort',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Text Extractor',
      slug: 'extract-text',
      path: '/pdf/extract-text',
      description: 'Extract text content from PDF documents with OCR support',
      keywords: 'extract pdf text, pdf text extractor, pdf ocr, read pdf text',
      icon: 'fas fa-file-alt',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Form Filler',
      slug: 'form-filler',
      path: '/pdf/form-filler',
      description: 'Fill PDF forms digitally with text, checkboxes, and signatures',
      keywords: 'pdf form filler, fill pdf, pdf forms, digital forms',
      icon: 'fas fa-edit',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Signature',
      slug: 'signature',
      path: '/pdf/signature',
      description: 'Add digital signatures to PDF documents securely',
      keywords: 'pdf signature, digital signature, sign pdf, e-signature',
      icon: 'fas fa-signature',
      color: 'text-red-400',
      category: 'PDF Tools'
    },
    {
      name: 'PDF Metadata Editor',
      slug: 'metadata',
      path: '/pdf/metadata',
      description: 'Edit PDF metadata including title, author, and properties',
      keywords: 'pdf metadata, edit pdf properties, pdf information, document properties',
      icon: 'fas fa-info-circle',
      color: 'text-red-400',
      category: 'PDF Tools'
    }
  ],
  image: [
    {
      name: 'AI Background Remover',
      slug: 'remove-background',
      path: '/image/remove-background',
      description: 'Remove image backgrounds automatically using advanced AI with perfect edge detection',
      keywords: 'remove background, background remover, transparent background, ai background removal, cutout tool',
      icon: 'fas fa-magic',
      color: 'text-green-400',
      category: 'Image Tools',
      featured: true
    },
    {
      name: 'Smart Image Resizer',
      slug: 'resize',
      path: '/image/resize',
      description: 'Resize images to specific dimensions or percentages with quality preservation',
      keywords: 'image resize, resize photo, image dimensions, scale image, photo resizer',
      icon: 'fas fa-expand-arrows-alt',
      color: 'text-green-400',
      category: 'Image Tools',
      featured: true
    },
    {
      name: 'Image Compressor Pro',
      slug: 'compress',
      path: '/image/compress',
      description: 'Reduce image file size up to 90% while maintaining visual quality',
      keywords: 'image compress, optimize image, reduce image size, image optimizer, photo compressor',
      icon: 'fas fa-compress',
      color: 'text-green-400',
      category: 'Image Tools',
      featured: true
    },
    {
      name: 'Universal Image Converter',
      slug: 'convert',
      path: '/image/convert',
      description: 'Convert images between 20+ formats including PNG, JPG, WebP, HEIC, and more',
      keywords: 'image converter, png to jpg, webp converter, format converter, image format, heic converter',
      icon: 'fas fa-exchange-alt',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Precision Image Cropper',
      slug: 'crop',
      path: '/image/crop',
      description: 'Crop images with pixel-perfect precision and popular aspect ratios',
      keywords: 'image crop, crop photo, image cutter, trim image, aspect ratio cropper',
      icon: 'fas fa-crop',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Image Filter Studio',
      slug: 'filters',
      path: '/image/filters',
      description: 'Apply professional filters and effects to enhance your images',
      keywords: 'image filters, photo effects, image enhancement, vintage filters, photo studio',
      icon: 'fas fa-adjust',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Watermark Maker',
      slug: 'watermark',
      path: '/image/watermark',
      description: 'Add text or logo watermarks to protect your images and photos',
      keywords: 'image watermark, photo watermark, logo watermark, copyright protection',
      icon: 'fas fa-stamp',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Photo Upscaler AI',
      slug: 'upscale',
      path: '/image/upscale',
      description: 'Upscale images up to 4x resolution using artificial intelligence',
      keywords: 'image upscaler, photo enlarger, ai upscale, enhance resolution, image enhancer',
      icon: 'fas fa-search-plus',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'EXIF Data Remover',
      slug: 'remove-exif',
      path: '/image/remove-exif',
      description: 'Remove EXIF metadata from images to protect your privacy',
      keywords: 'remove exif, exif remover, image metadata, privacy protection, clean exif',
      icon: 'fas fa-user-secret',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Color Palette Generator',
      slug: 'color-palette',
      path: '/image/color-palette',
      description: 'Extract beautiful color palettes from any image for design projects',
      keywords: 'color palette, extract colors, image colors, color picker, design colors',
      icon: 'fas fa-palette',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Image Rotator',
      slug: 'rotate',
      path: '/image/rotate',
      description: 'Rotate and flip images with precise angle control and auto-straightening',
      keywords: 'image rotate, rotate photo, flip image, straighten image, image orientation',
      icon: 'fas fa-undo',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Batch Image Processor',
      slug: 'batch-process',
      path: '/image/batch-process',
      description: 'Process multiple images at once with resize, convert, and compress options',
      keywords: 'batch image processing, bulk image converter, mass image resize, batch photo editor',
      icon: 'fas fa-layer-group',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Meme Generator',
      slug: 'meme-generator',
      path: '/image/meme-generator',
      description: 'Create viral memes with customizable text, fonts, and layouts',
      keywords: 'meme generator, create memes, meme maker, funny images, viral content',
      icon: 'fas fa-laugh',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Image Blur Tool',
      slug: 'blur',
      path: '/image/blur',
      description: 'Apply blur effects with gaussian, motion, and selective blur options',
      keywords: 'image blur, blur photo, gaussian blur, motion blur, selective blur',
      icon: 'fas fa-eye-slash',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Image Collage Maker',
      slug: 'collage',
      path: '/image/collage',
      description: 'Create stunning photo collages with multiple layout templates',
      keywords: 'photo collage, collage maker, image mosaic, photo grid, picture collage',
      icon: 'fas fa-th',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'QR Code Generator',
      slug: 'qr-generator',
      path: '/image/qr-generator',
      description: 'Generate custom QR codes with logos, colors, and various formats',
      keywords: 'qr code generator, create qr code, custom qr code, qr maker, barcode generator',
      icon: 'fas fa-qrcode',
      color: 'text-green-400',
      category: 'Image Tools'
    },
    {
      name: 'Photo Frame Studio',
      slug: 'frames',
      path: '/image/frames',
      description: 'Add beautiful frames and borders to your photos with various styles',
      keywords: 'photo frames, image borders, picture frames, photo editor, decorative frames',
      icon: 'fas fa-border-style',
      color: 'text-green-400',
      category: 'Image Tools'
    }
  ],
  audio: [
    {
      name: 'Universal Audio Converter',
      slug: 'convert',
      path: '/audio/convert',
      description: 'Convert audio files between 20+ formats including MP3, WAV, FLAC, OGG, and more',
      keywords: 'audio converter, mp3 converter, wav converter, flac converter, audio format, convert audio',
      icon: 'fas fa-exchange-alt',
      color: 'text-purple-400',
      category: 'Audio Tools',
      featured: true
    },
    {
      name: 'Audio Cutter & Trimmer',
      slug: 'cut',
      path: '/audio/cut',
      description: 'Cut and trim audio files with precision timing and fade effects',
      keywords: 'audio cutter, trim audio, cut audio, audio trimmer, audio splitter',
      icon: 'fas fa-cut',
      color: 'text-purple-400',
      category: 'Audio Tools',
      featured: true
    },
    {
      name: 'Professional Voice Recorder',
      slug: 'record',
      path: '/audio/record',
      description: 'Record high-quality audio directly from your microphone with real-time visualization',
      keywords: 'voice recorder, audio recorder, record voice, microphone recorder, recording studio',
      icon: 'fas fa-microphone',
      color: 'text-purple-400',
      category: 'Audio Tools',
      featured: true
    },
    {
      name: 'Text to Speech Pro',
      slug: 'text-to-speech',
      path: '/audio/text-to-speech',
      description: 'Convert text to natural-sounding speech with multiple voices and languages',
      keywords: 'text to speech, tts, voice synthesis, speech generator, ai voice',
      icon: 'fas fa-volume-up',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Joiner & Merger',
      slug: 'join',
      path: '/audio/join',
      description: 'Combine multiple audio files into one with crossfade and gap control',
      keywords: 'audio joiner, merge audio, combine audio, audio merger, audio concatenation',
      icon: 'fas fa-link',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Compressor',
      slug: 'compress',
      path: '/audio/compress',
      description: 'Reduce audio file size while maintaining quality with advanced compression',
      keywords: 'audio compressor, compress audio, reduce audio size, audio optimization',
      icon: 'fas fa-compress-arrows-alt',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Volume Booster & Normalizer',
      slug: 'volume-booster',
      path: '/audio/volume-booster',
      description: 'Boost audio volume safely and normalize audio levels across tracks',
      keywords: 'volume booster, audio amplifier, normalize audio, increase volume, audio enhancer',
      icon: 'fas fa-volume-up',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Speed Changer',
      slug: 'speed-changer',
      path: '/audio/speed-changer',
      description: 'Change audio playback speed without affecting pitch quality',
      keywords: 'audio speed, change speed, slow audio, fast audio, tempo changer',
      icon: 'fas fa-tachometer-alt',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Pitch Shifter',
      slug: 'pitch-shifter',
      path: '/audio/pitch-shifter',
      description: 'Shift audio pitch up or down while preserving timing and quality',
      keywords: 'pitch shifter, change pitch, audio pitch, tone shifter, pitch changer',
      icon: 'fas fa-music',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Equalizer',
      slug: 'equalizer',
      path: '/audio/equalizer',
      description: 'Apply professional EQ filters to enhance your audio with preset and custom curves',
      keywords: 'audio equalizer, eq, audio filter, frequency response, audio enhancement',
      icon: 'fas fa-sliders-h',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Noise Reducer',
      slug: 'noise-reducer',
      path: '/audio/noise-reducer',
      description: 'Remove background noise and unwanted sounds from audio recordings',
      keywords: 'noise reduction, denoise audio, clean audio, remove noise, audio cleaner',
      icon: 'fas fa-filter',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Reverb & Echo',
      slug: 'reverb',
      path: '/audio/reverb',
      description: 'Add reverb, echo, and spatial effects to your audio recordings',
      keywords: 'audio reverb, echo effect, spatial audio, audio effects, sound effects',
      icon: 'fas fa-broadcast-tower',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Spectrum Analyzer',
      slug: 'spectrum-analyzer',
      path: '/audio/spectrum-analyzer',
      description: 'Visualize audio frequency spectrum and analyze audio characteristics',
      keywords: 'spectrum analyzer, audio analysis, frequency analysis, audio visualizer, waveform',
      icon: 'fas fa-chart-line',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Speech to Text',
      slug: 'speech-to-text',
      path: '/audio/speech-to-text',
      description: 'Convert speech from audio files to accurate text transcriptions',
      keywords: 'speech to text, audio transcription, voice to text, speech recognition, transcribe audio',
      icon: 'fas fa-file-alt',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Loop Creator',
      slug: 'loop-creator',
      path: '/audio/loop-creator',
      description: 'Create seamless audio loops for music production and sound design',
      keywords: 'audio loop, loop creator, seamless loop, music loop, audio repeat',
      icon: 'fas fa-redo',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Fade Editor',
      slug: 'fade-editor',
      path: '/audio/fade-editor',
      description: 'Add fade in/out effects and crossfades to your audio files',
      keywords: 'audio fade, fade in out, crossfade, audio transition, fade effect',
      icon: 'fas fa-adjust',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Channel Mixer',
      slug: 'channel-mixer',
      path: '/audio/channel-mixer',
      description: 'Mix stereo channels, convert mono to stereo, and adjust audio channels',
      keywords: 'audio mixer, stereo mixer, mono to stereo, channel mixer, audio channels',
      icon: 'fas fa-random',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Beat Detection',
      slug: 'beat-detector',
      path: '/audio/beat-detector',
      description: 'Detect BPM and beats in audio files for DJ and music production',
      keywords: 'beat detection, bpm detector, tempo detector, music analysis, rhythm analysis',
      icon: 'fas fa-heartbeat',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Silence Remover',
      slug: 'silence-remover',
      path: '/audio/silence-remover',
      description: 'Automatically detect and remove silence from audio recordings',
      keywords: 'silence remover, remove silence, audio trimmer, voice activation, audio cleanup',
      icon: 'fas fa-volume-mute',
      color: 'text-purple-400',
      category: 'Audio Tools'
    },
    {
      name: 'Audio Metadata Editor',
      slug: 'metadata-editor',
      path: '/audio/metadata-editor',
      description: 'Edit audio file metadata including artist, title, album, and cover art',
      keywords: 'audio metadata, mp3 tags, id3 editor, audio tags, music metadata',
      icon: 'fas fa-tags',
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
    },
    {
      name: 'URL Encoder/Decoder',
      slug: 'url-encoder',
      path: '/text/url-encoder',
      description: 'Encode and decode URLs for web usage',
      keywords: 'url encoder, url decoder, percent encoding, uri encoding',
      icon: 'fas fa-link',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'HTML Encoder',
      slug: 'html-encoder',
      path: '/text/html-encoder',
      description: 'Encode and decode HTML entities',
      keywords: 'html encoder, html entities, html escape, html decode',
      icon: 'fab fa-html5',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'JSON Formatter',
      slug: 'json-formatter',
      path: '/text/json-formatter',
      description: 'Format, validate, and minify JSON data',
      keywords: 'json formatter, json validator, json minify, json pretty print',
      icon: 'fas fa-brackets-curly',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Lorem Ipsum Generator',
      slug: 'lorem-ipsum',
      path: '/text/lorem-ipsum',
      description: 'Generate placeholder text for design and development',
      keywords: 'lorem ipsum, placeholder text, dummy text, filler text',
      icon: 'fas fa-paragraph',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Text Difference Checker',
      slug: 'text-diff',
      path: '/text/text-diff',
      description: 'Compare two texts and highlight differences',
      keywords: 'text diff, text compare, compare text, text difference',
      icon: 'fas fa-not-equal',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Duplicate Line Remover',
      slug: 'remove-duplicates',
      path: '/text/remove-duplicates',
      description: 'Remove duplicate lines from text',
      keywords: 'remove duplicates, duplicate lines, unique lines, text cleaner',
      icon: 'fas fa-copy',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Text Reverser',
      slug: 'text-reverser',
      path: '/text/text-reverser',
      description: 'Reverse text, words, or lines',
      keywords: 'reverse text, text reverser, backwards text, flip text',
      icon: 'fas fa-undo',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Hash Generator',
      slug: 'hash-generator',
      path: '/text/hash-generator',
      description: 'Generate MD5, SHA-1, SHA-256 hashes of text',
      keywords: 'hash generator, md5, sha1, sha256, text hash',
      icon: 'fas fa-hashtag',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Password Generator',
      slug: 'password-generator',
      path: '/text/password-generator',
      description: 'Generate secure passwords with custom options',
      keywords: 'password generator, secure password, random password, strong password',
      icon: 'fas fa-key',
      color: 'text-blue-400',
      category: 'Text Tools'
    },
    {
      name: 'Text Statistics',
      slug: 'text-statistics',
      path: '/text/text-statistics',
      description: 'Advanced text analysis with readability scores',
      keywords: 'text statistics, readability, text analysis, writing stats',
      icon: 'fas fa-chart-bar',
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
      category: 'Productivity Tools',
      featured: true
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
    },
    {
      name: 'QR Code Generator',
      slug: 'qr-generator',
      path: '/productivity/qr-generator',
      description: 'Generate QR codes for text, URLs, and more',
      keywords: 'qr code generator, qr code, barcode, qr creator',
      icon: 'fas fa-qrcode',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Color Picker',
      slug: 'color-picker',
      path: '/productivity/color-picker',
      description: 'Pick colors and get hex, RGB, HSL values',
      keywords: 'color picker, color palette, hex color, rgb color',
      icon: 'fas fa-palette',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Random Number Generator',
      slug: 'random-number',
      path: '/productivity/random-number',
      description: 'Generate random numbers with custom ranges',
      keywords: 'random number generator, random numbers, number generator, lottery numbers',
      icon: 'fas fa-dice',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Stopwatch & Timer',
      slug: 'stopwatch-timer',
      path: '/productivity/stopwatch-timer',
      description: 'Precision stopwatch and countdown timer',
      keywords: 'stopwatch, timer, countdown, time tracker, chronometer',
      icon: 'fas fa-stopwatch',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'World Clock',
      slug: 'world-clock',
      path: '/productivity/world-clock',
      description: 'View time in different time zones worldwide',
      keywords: 'world clock, time zones, global time, international time',
      icon: 'fas fa-globe',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Text to QR Code',
      slug: 'text-to-qr',
      path: '/productivity/text-to-qr',
      description: 'Convert any text into a QR code instantly',
      keywords: 'text to qr, qr code generator, text qr, message qr',
      icon: 'fas fa-qrcode',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Markdown Preview',
      slug: 'markdown-preview',
      path: '/productivity/markdown-preview',
      description: 'Preview markdown text with live rendering',
      keywords: 'markdown preview, markdown editor, md preview, markdown to html',
      icon: 'fab fa-markdown',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'CSS Minifier',
      slug: 'css-minifier',
      path: '/productivity/css-minifier',
      description: 'Minify and compress CSS code',
      keywords: 'css minifier, css compressor, minify css, compress css',
      icon: 'fab fa-css3-alt',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'JavaScript Minifier',
      slug: 'js-minifier',
      path: '/productivity/js-minifier',
      description: 'Minify and compress JavaScript code',
      keywords: 'javascript minifier, js minifier, minify javascript, compress js',
      icon: 'fab fa-js-square',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'URL Shortener',
      slug: 'url-shortener',
      path: '/productivity/url-shortener',
      description: 'Create short URLs and track clicks',
      keywords: 'url shortener, short url, link shortener, tiny url',
      icon: 'fas fa-link',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Screen Capture Tool',
      slug: 'screen-capture',
      path: '/productivity/screen-capture',
      description: 'Capture screenshots directly from browser',
      keywords: 'screen capture, screenshot, screen recorder, capture tool',
      icon: 'fas fa-camera',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Regular Expression Tester',
      slug: 'regex-tester',
      path: '/productivity/regex-tester',
      description: 'Test and validate regular expressions',
      keywords: 'regex tester, regular expression, regex validator, pattern matching',
      icon: 'fas fa-code',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Tab Manager',
      slug: 'tab-manager',
      path: '/productivity/tab-manager',
      description: 'Organize and manage browser tabs efficiently',
      keywords: 'tab manager, browser tabs, tab organizer, productivity tool',
      icon: 'fas fa-window-restore',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Pomodoro Timer',
      slug: 'pomodoro-timer',
      path: '/productivity/pomodoro-timer',
      description: 'Focus timer using the Pomodoro Technique',
      keywords: 'pomodoro timer, focus timer, productivity timer, work timer',
      icon: 'fas fa-clock',
      color: 'text-yellow-400',
      category: 'Productivity Tools'
    },
    {
      name: 'Note Taking App',
      slug: 'note-taking',
      path: '/productivity/note-taking',
      description: 'Quick note taking with local storage',
      keywords: 'note taking, notes app, quick notes, note pad',
      icon: 'fas fa-sticky-note',
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

// Get related tools for a specific tool
export function getRelatedTools(category, currentSlug) {
  const categoryTools = TOOLS_REGISTRY[category.toLowerCase().replace(' tools', '')] || [];
  return categoryTools.filter(tool => tool.slug !== currentSlug);
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
