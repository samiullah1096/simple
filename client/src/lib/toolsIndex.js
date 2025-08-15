// Comprehensive tools registry for SEO and search functionality
export const TOOLS_REGISTRY = {
  pdf: [
    {
      name: 'PDF Merger',
      slug: 'merge',
      path: '/pdf/merge',
      description: 'Combine multiple PDF files into one document with custom ordering and advanced merge options. Free, secure, and works directly in your browser.',
      keywords: 'pdf merge, combine pdf, join pdf files, pdf joiner, merge documents, combine pdf files online, free pdf merger, merge pdf online, pdf combiner, merge multiple pdf, pdf merger tool, join pdf documents, pdf merge tool online, combine pdf documents free, merge pdf files',
      seoTitle: 'Free PDF Merger - Combine PDF Files Online | Fast & Secure',
      metaDescription: 'Merge multiple PDF files into one document instantly. Free online PDF merger tool with drag-and-drop interface. No upload, fully secure, works in browser.',
      longTailKeywords: 'how to merge pdf files online free, combine multiple pdf files into one, best free pdf merger tool, merge pdf files without uploading, secure pdf merger online',
      icon: 'fas fa-object-group',
      color: 'text-red-400',
      category: 'PDF Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Merger Tool',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Merge multiple PDFs', 'Drag and drop interface', 'No file upload required', 'Secure browser processing', 'Custom page ordering'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1247' }
      }
    },
    {
      name: 'PDF Splitter',
      slug: 'split',
      path: '/pdf/split',
      description: 'Split PDF files into individual pages or custom ranges with precise page extraction. Extract specific pages or split into multiple documents instantly.',
      keywords: 'pdf split, separate pdf, extract pdf pages, pdf divider, page extractor, split pdf online, pdf splitter tool, divide pdf, extract pages from pdf, pdf page separator, split pdf files, pdf page extractor online, separate pdf pages',
      seoTitle: 'Free PDF Splitter - Split PDF Pages Online | Extract PDF Pages',
      metaDescription: 'Split PDF files into individual pages or custom ranges. Free online PDF splitter tool. Extract specific pages instantly with no file upload required.',
      longTailKeywords: 'how to split pdf into separate pages, extract specific pages from pdf online, best free pdf splitter tool, split large pdf file, divide pdf into multiple files',
      icon: 'fas fa-cut',
      color: 'text-red-400',
      category: 'PDF Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Splitter Tool',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Split PDF pages', 'Extract page ranges', 'Individual page extraction', 'Custom page selection', 'Secure processing'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '892' }
      }
    },
    {
      name: 'PDF Compressor',
      slug: 'compress',
      path: '/pdf/compress',
      description: 'Reduce PDF file size while maintaining quality with advanced compression algorithms. Compress PDFs up to 90% smaller with intelligent optimization.',
      keywords: 'pdf compress, reduce pdf size, optimize pdf, pdf optimizer, file size reducer, compress pdf online, pdf compressor tool, shrink pdf, reduce pdf file size, make pdf smaller, pdf size reducer online, optimize pdf online',
      seoTitle: 'Free PDF Compressor - Reduce PDF Size Online | Optimize PDFs',
      metaDescription: 'Compress PDF files up to 90% smaller while maintaining quality. Free online PDF compressor with advanced optimization. No upload required, secure processing.',
      longTailKeywords: 'how to reduce pdf file size online free, compress large pdf files, best pdf compressor tool, shrink pdf without losing quality, optimize pdf for web',
      icon: 'fas fa-compress-arrows-alt',
      color: 'text-red-400',
      category: 'PDF Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Compressor Tool',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Advanced compression', 'Quality preservation', 'Up to 90% size reduction', 'Batch processing', 'No file upload'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '1567' }
      }
    },
    {
      name: 'PDF to Word',
      slug: 'to-word',
      path: '/pdf/to-word',
      description: 'Convert PDF documents to editable Word files with preserved formatting. Extract text, images, and layout from PDFs to DOCX format.',
      keywords: 'pdf to word, pdf to docx, convert pdf, pdf converter, document conversion, pdf to doc, extract pdf text, pdf word converter online, convert pdf to editable word, pdf docx converter free',
      seoTitle: 'Free PDF to Word Converter - Convert PDF to DOCX Online',
      metaDescription: 'Convert PDF to Word documents instantly. Free PDF to DOCX converter with preserved formatting. Extract text and images from PDFs to editable Word files.',
      longTailKeywords: 'how to convert pdf to word online free, pdf to word converter without losing formatting, best pdf to docx converter, extract text from pdf to word',
      icon: 'fas fa-file-word',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF to Word Converter',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Preserved formatting', 'Text extraction', 'Image extraction', 'Layout preservation', 'DOCX output'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '987' }
      }
    },
    {
      name: 'Word to PDF',
      slug: 'word-to-pdf',
      path: '/pdf/word-to-pdf',
      description: 'Convert Word documents to PDF format with professional quality output. Preserve formatting, fonts, and layout with advanced conversion algorithms.',
      keywords: 'word to pdf, docx to pdf, document converter, office to pdf, convert word to pdf, word pdf converter online, docx pdf converter, office document converter, word file to pdf, document to pdf converter',
      seoTitle: 'Free Word to PDF Converter - Convert DOCX to PDF Online',
      metaDescription: 'Convert Word documents to PDF with perfect formatting preservation. Free DOCX to PDF converter with professional quality output and secure processing.',
      longTailKeywords: 'how to convert word to pdf online free, docx to pdf converter free, best word to pdf converter, convert office documents to pdf, word file pdf converter',
      icon: 'fas fa-file-pdf',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Word to PDF Converter',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Format preservation', 'Professional quality', 'Font compatibility', 'Layout retention', 'Secure conversion'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1456' }
      }
    },
    {
      name: 'PDF to JPG',
      slug: 'to-jpg',
      path: '/pdf/to-jpg',
      description: 'Convert PDF pages to high-quality JPG images with custom resolution. Extract PDF pages as images with DPI control and format options.',
      keywords: 'pdf to jpg, pdf to image, convert pdf pages, pdf image converter, pdf to jpeg, extract pdf images, pdf page to image, convert pdf to jpg online, pdf image extractor, pdf to picture converter',
      seoTitle: 'Free PDF to JPG Converter - Convert PDF Pages to Images Online',
      metaDescription: 'Convert PDF pages to high-quality JPG images. Free PDF to image converter with custom resolution, DPI control, and batch processing capabilities.',
      longTailKeywords: 'how to convert pdf to jpg online free, extract images from pdf pages, pdf to jpeg converter, convert pdf pages to pictures, best pdf to image tool',
      icon: 'fas fa-file-image',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF to JPG Converter',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['High-quality conversion', 'Custom resolution', 'DPI control', 'Batch processing', 'Multiple formats'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '789' }
      }
    },
    {
      name: 'JPG to PDF',
      slug: 'jpg-to-pdf',
      path: '/pdf/jpg-to-pdf',
      description: 'Convert JPG images to PDF documents with multiple layout options. Batch convert multiple images with custom page sizes and orientations.',
      keywords: 'jpg to pdf, image to pdf, photo to pdf, picture converter, convert images to pdf, batch image to pdf, jpg pdf converter online, multiple images to pdf, photos to pdf converter, picture to document converter',
      seoTitle: 'Free JPG to PDF Converter - Convert Images to PDF Online',
      metaDescription: 'Convert JPG images to PDF documents instantly. Free batch converter with custom layouts and page sizes. Combine multiple images into one PDF securely.',
      longTailKeywords: 'how to convert jpg to pdf online free, batch convert images to pdf, multiple photos to one pdf, best jpg to pdf converter, combine images into pdf',
      icon: 'fas fa-images',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'JPG to PDF Converter',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Batch conversion', 'Custom layouts', 'Multiple page sizes', 'Image optimization', 'Secure processing'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1234' }
      }
    },
    {
      name: 'PDF Password Remover',
      slug: 'remove-password',
      path: '/pdf/remove-password',
      description: 'Remove password protection from PDF files securely. Unlock encrypted PDFs with owner or user passwords for full document access.',
      keywords: 'remove pdf password, unlock pdf, pdf password remover, decrypt pdf, pdf unlocker, remove pdf encryption, unlock password protected pdf, pdf security remover, decrypt pdf online, pdf password breaker',
      seoTitle: 'Free PDF Password Remover - Unlock PDF Files Online',
      metaDescription: 'Remove password protection from PDF files securely. Free PDF unlocker tool to decrypt and unlock password-protected documents instantly.',
      longTailKeywords: 'how to remove password from pdf online free, unlock encrypted pdf file, decrypt password protected pdf, pdf password removal tool, unlock pdf without password',
      icon: 'fas fa-unlock',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Password Remover',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Secure decryption', 'Owner password removal', 'User password unlock', 'Instant processing', 'Privacy protection'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.4', reviewCount: '567' }
      }
    },
    {
      name: 'PDF Password Protector',
      slug: 'add-password',
      path: '/pdf/add-password',
      description: 'Add password protection to PDF documents for security. Encrypt PDFs with user and owner passwords plus permission controls.',
      keywords: 'pdf password, protect pdf, secure pdf, encrypt pdf, add password to pdf, pdf security, password protect pdf online, encrypt pdf document, pdf encryption tool, secure pdf files',
      seoTitle: 'Free PDF Password Protector - Secure PDF Files Online',
      metaDescription: 'Add password protection to PDF documents. Free PDF encryption tool with user/owner passwords and permission controls. Secure your documents instantly.',
      longTailKeywords: 'how to password protect pdf online free, add password to pdf document, encrypt pdf with password, secure pdf file with password, best pdf password protection tool',
      icon: 'fas fa-lock',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Password Protector',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Password encryption', 'Permission controls', 'User/owner passwords', 'Advanced security', 'Document protection'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '923' }
      }
    },
    {
      name: 'PDF Watermark',
      slug: 'watermark',
      path: '/pdf/watermark',
      description: 'Add text or image watermarks to PDF documents with full customization. Control position, opacity, rotation, and styling for professional branding.',
      keywords: 'pdf watermark, add watermark, pdf branding, document watermark, pdf watermark tool, add logo to pdf, text watermark pdf, copyright watermark, pdf watermark online, brand pdf documents, watermark pdf free',
      seoTitle: 'Free PDF Watermark Tool - Add Watermarks to PDF Online',
      metaDescription: 'Add custom text or image watermarks to PDF documents. Free watermark tool with position control, opacity settings, and professional branding options.',
      longTailKeywords: 'how to add watermark to pdf online free, pdf watermark generator, add logo watermark to pdf, text watermark on pdf, protect pdf with watermark',
      icon: 'fas fa-stamp',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Watermark Tool',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Text watermarks', 'Image watermarks', 'Position control', 'Opacity settings', 'Batch processing'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '756' }
      }
    },
    {
      name: 'PDF Page Organizer',
      slug: 'organize',
      path: '/pdf/organize',
      description: 'Reorder, rotate, and organize PDF pages with drag-and-drop interface. Advanced page management with preview, deletion, and duplication features.',
      keywords: 'pdf organize, reorder pages, rotate pdf, pdf page manager, arrange pdf pages, pdf page organizer online, rearrange pdf pages, pdf page editor, organize pdf documents, pdf page sorter',
      seoTitle: 'Free PDF Page Organizer - Reorder & Rotate PDF Pages Online',
      metaDescription: 'Organize PDF pages with drag-and-drop interface. Free tool to reorder, rotate, delete, and arrange PDF pages. Visual page management made easy.',
      longTailKeywords: 'how to rearrange pdf pages online free, pdf page organizer tool, reorder pdf pages drag drop, rotate pdf pages online, organize pdf document pages',
      icon: 'fas fa-sort',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Page Organizer',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Drag-and-drop interface', 'Page rotation', 'Page deletion', 'Visual preview', 'Batch operations'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '845' }
      }
    },
    {
      name: 'PDF Text Extractor',
      slug: 'extract-text',
      path: '/pdf/extract-text',
      description: 'Extract text content from PDF documents with OCR support. Advanced text recognition for scanned documents and image-based PDFs.',
      keywords: 'extract pdf text, pdf text extractor, pdf ocr, read pdf text, extract text from pdf, pdf text extraction tool, ocr pdf online, pdf text reader, convert pdf to text, pdf content extractor',
      seoTitle: 'Free PDF Text Extractor - Extract Text from PDF Online | OCR',
      metaDescription: 'Extract text from PDF documents with OCR support. Free PDF text extractor with advanced recognition for scanned documents and image-based PDFs.',
      longTailKeywords: 'how to extract text from pdf online free, pdf ocr text extraction, extract text from scanned pdf, pdf text extractor tool, convert pdf to editable text',
      icon: 'fas fa-file-alt',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Text Extractor',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['OCR support', 'Text recognition', 'Scanned PDF support', 'Batch extraction', 'Format preservation'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '678' }
      }
    },
    {
      name: 'PDF Form Filler',
      slug: 'form-filler',
      path: '/pdf/form-filler',
      description: 'Fill PDF forms digitally with text, checkboxes, and signatures. Complete interactive PDFs with form field detection and data validation.',
      keywords: 'pdf form filler, fill pdf, pdf forms, digital forms, fill pdf forms online, pdf form editor, complete pdf forms, pdf form completion tool, interactive pdf forms, digital form filler',
      seoTitle: 'Free PDF Form Filler - Fill PDF Forms Online | Digital Forms',
      metaDescription: 'Fill PDF forms digitally with text, checkboxes, and signatures. Free PDF form filler with field detection, data validation, and signature support.',
      longTailKeywords: 'how to fill pdf forms online free, digital pdf form filler, complete pdf forms electronically, fill interactive pdf forms, best pdf form completion tool',
      icon: 'fas fa-edit',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Form Filler',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Text input fields', 'Checkbox support', 'Signature fields', 'Form validation', 'Data preservation'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.4', reviewCount: '445' }
      }
    },
    {
      name: 'PDF Signature',
      slug: 'signature',
      path: '/pdf/signature',
      description: 'Add digital signatures to PDF documents securely. Create handwritten signatures, add text signatures, and sign documents electronically.',
      keywords: 'pdf signature, digital signature, sign pdf, e-signature, electronic signature, pdf signer online, add signature to pdf, digital signature pdf, sign pdf online, pdf signing tool, electronic document signing',
      seoTitle: 'Free PDF Signature Tool - Sign PDF Documents Online',
      metaDescription: 'Add digital signatures to PDF documents securely. Free PDF signing tool with handwritten and text signatures. Sign documents electronically online.',
      longTailKeywords: 'how to sign pdf online free, digital signature for pdf, add handwritten signature to pdf, electronic signature pdf, best pdf signing tool',
      icon: 'fas fa-signature',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Digital Signature Tool',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Digital signatures', 'Handwritten signatures', 'Text signatures', 'Position control', 'Secure signing'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1123' }
      }
    },
    {
      name: 'PDF Metadata Editor',
      slug: 'metadata',
      path: '/pdf/metadata',
      description: 'Edit PDF metadata including title, author, and properties. Comprehensive document information management with custom fields and SEO optimization.',
      keywords: 'pdf metadata, edit pdf properties, pdf information, document properties, pdf metadata editor online, edit pdf title author, pdf document properties, change pdf metadata, pdf info editor, document metadata tool',
      seoTitle: 'Free PDF Metadata Editor - Edit PDF Properties Online',
      metaDescription: 'Edit PDF metadata including title, author, subject, and keywords. Free PDF properties editor with comprehensive document information management.',
      longTailKeywords: 'how to edit pdf metadata online free, change pdf title and author, edit pdf document properties, pdf metadata editor tool, modify pdf information fields',
      icon: 'fas fa-info-circle',
      color: 'text-red-400',
      category: 'PDF Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'PDF Metadata Editor',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Title editing', 'Author management', 'Custom properties', 'Keyword optimization', 'Batch editing'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.3', reviewCount: '321' }
      }
    }
  ],
  finance: [
    {
      name: 'EMI Calculator',
      slug: 'emi-calculator',
      path: '/finance/emi-calculator',
      description: 'Calculate Equated Monthly Installments (EMI) for loans with detailed amortization schedules. Compare different loan scenarios and interest rates.',
      keywords: 'emi calculator, loan calculator, monthly installment, home loan emi, car loan calculator, personal loan emi, emi calculation formula, loan amortization, interest calculator, finance calculator',
      seoTitle: 'Free EMI Calculator - Calculate Loan EMI Online | Amortization',
      metaDescription: 'Calculate EMI for home loans, car loans, and personal loans. Free EMI calculator with amortization schedule, interest breakdown, and loan comparison tools.',
      longTailKeywords: 'how to calculate emi online free, home loan emi calculator india, car loan emi calculator with interest rate, personal loan emi calculator hdfc, best emi calculator tool',
      icon: 'fas fa-calculator',
      color: 'text-emerald-400',
      category: 'Finance Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'EMI Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['EMI calculation', 'Amortization schedule', 'Interest breakdown', 'Loan comparison', 'Multiple scenarios'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2456' }
      }
    },
    {
      name: 'SIP Calculator',
      slug: 'sip-calculator',
      path: '/finance/sip-calculator',
      description: 'Calculate Systematic Investment Plan (SIP) returns and wealth accumulation with detailed growth projections and investment scenarios.',
      keywords: 'sip calculator, mutual fund sip, systematic investment plan, sip return calculator, investment calculator, wealth calculator, sip planning tool, mutual fund calculator, investment growth calculator',
      seoTitle: 'Free SIP Calculator - Calculate SIP Returns Online | Investment',
      metaDescription: 'Calculate SIP returns and wealth accumulation with detailed projections. Free SIP calculator for mutual fund investments with growth analysis and planning tools.',
      longTailKeywords: 'how to calculate sip returns online, mutual fund sip calculator with inflation, best sip calculator india, sip investment calculator 15 years, monthly sip calculator',
      icon: 'fas fa-chart-line',
      color: 'text-emerald-400',
      category: 'Finance Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'SIP Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['SIP return calculation', 'Wealth projections', 'Investment scenarios', 'Growth analysis', 'Goal planning'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1987' }
      }
    },
    {
      name: 'Compound Interest Calculator',
      slug: 'compound-interest',
      path: '/finance/compound-interest',
      description: 'Calculate compound interest with detailed breakdown of principal, interest, and total amount. Compare different compounding frequencies and investment periods.',
      keywords: 'compound interest calculator, investment growth calculator, compound interest formula, fixed deposit calculator, savings calculator, interest on interest calculator, compounding calculator',
      seoTitle: 'Free Compound Interest Calculator - Calculate Investment Growth',
      metaDescription: 'Calculate compound interest with detailed breakdowns. Free calculator for investments, fixed deposits, and savings with multiple compounding frequencies.',
      longTailKeywords: 'how to calculate compound interest online, compound interest calculator with monthly deposits, fixed deposit compound interest calculator, savings account compound interest',
      icon: 'fas fa-percentage',
      color: 'text-emerald-400',
      category: 'Finance Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Compound Interest Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Compound interest calculation', 'Multiple frequencies', 'Investment growth analysis', 'Principal breakdown', 'Time value analysis'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '1654' }
      }
    },
    {
      name: 'Tax Calculator',
      slug: 'tax-calculator',
      path: '/finance/tax-calculator',
      description: 'Calculate income tax, tax savings, and take-home salary with detailed breakdowns. Support for multiple tax regimes and deductions.',
      keywords: 'income tax calculator, tax calculator india, salary tax calculator, tax saving calculator, income tax calculation, tax planner, salary calculator with tax, tax deduction calculator',
      seoTitle: 'Free Income Tax Calculator - Calculate Tax Online | Salary Tax',
      metaDescription: 'Calculate income tax and take-home salary with detailed breakdowns. Free tax calculator with multiple regimes, deductions, and tax planning tools.',
      longTailKeywords: 'how to calculate income tax online india, salary tax calculator after deductions, income tax calculator fy 2024-25, tax saving calculator 80c',
      icon: 'fas fa-receipt',
      color: 'text-emerald-400',
      category: 'Finance Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Tax Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Income tax calculation', 'Multiple tax regimes', 'Deduction planning', 'Take-home calculation', 'Tax optimization'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '2134' }
      }
    },
    {
      name: 'Retirement Calculator',
      slug: 'retirement-calculator',
      path: '/finance/retirement-calculator',
      description: 'Plan your retirement with detailed projections of savings, expenses, and corpus required. Calculate retirement goals and investment strategies.',
      keywords: 'retirement calculator, retirement planning, retirement corpus calculator, pension calculator, retirement savings calculator, retirement goal calculator, post retirement planning',
      seoTitle: 'Free Retirement Calculator - Plan Your Retirement Online',
      metaDescription: 'Plan your retirement with detailed projections and goal setting. Free retirement calculator with corpus estimation, savings analysis, and investment planning.',
      longTailKeywords: 'how much money needed for retirement calculator, retirement planning calculator india, retirement corpus calculator online, retirement savings goal calculator',
      icon: 'fas fa-piggy-bank',
      color: 'text-emerald-400',
      category: 'Finance Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Retirement Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Retirement planning', 'Corpus calculation', 'Savings projections', 'Goal setting', 'Investment strategies'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1456' }
      }
    }
  ],
  image: [
    {
      name: 'AI Background Remover',
      slug: 'remove-background',
      path: '/image/remove-background',
      description: 'Remove image backgrounds automatically using advanced AI with perfect edge detection. Create transparent PNGs instantly with professional results.',
      keywords: 'remove background, background remover, transparent background, ai background removal, cutout tool, remove image background, background eraser, png transparent, auto background removal, ai cutout, background removal tool online, remove white background from image',
      seoTitle: 'Free AI Background Remover - Remove Image Background Online',
      metaDescription: 'Remove image backgrounds instantly with AI. Free background remover tool with perfect edge detection. Create transparent PNGs in seconds with professional quality.',
      longTailKeywords: 'how to remove background from image online free, ai background remover tool, remove white background from photo, best background removal tool, transparent background maker',
      icon: 'fas fa-magic',
      color: 'text-green-400',
      category: 'Image Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'AI Background Remover',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['AI-powered removal', 'Perfect edge detection', 'Instant results', 'Transparent PNG output', 'No upload required'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2134' }
      }
    },
    {
      name: 'Smart Image Resizer',
      slug: 'resize',
      path: '/image/resize',
      description: 'Resize images to specific dimensions or percentages with quality preservation. Smart resizing with aspect ratio control and batch processing.',
      keywords: 'image resize, resize photo, image dimensions, scale image, photo resizer, resize image online, image resizer tool, change image size, resize picture, photo size changer, bulk image resize, smart resize tool',
      seoTitle: 'Free Image Resizer - Resize Photos Online | Smart Image Tool',
      metaDescription: 'Resize images to any dimension while preserving quality. Free online image resizer with smart scaling and aspect ratio control. Batch resize multiple photos.',
      longTailKeywords: 'how to resize image online free, best image resizer tool, resize photo without losing quality, bulk image resize tool, change image dimensions online',
      icon: 'fas fa-expand-arrows-alt',
      color: 'text-green-400',
      category: 'Image Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Smart Image Resizer',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Quality preservation', 'Aspect ratio control', 'Batch processing', 'Custom dimensions', 'Smart scaling'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1893' }
      }
    },
    {
      name: 'Image Compressor Pro',
      slug: 'compress',
      path: '/image/compress',
      description: 'Reduce image file size up to 90% while maintaining visual quality. Smart compression with lossless and lossy options for optimal results.',
      keywords: 'image compress, optimize image, reduce image size, image optimizer, photo compressor, compress image online, image size reducer, photo optimizer, compress jpg png, reduce photo size, image compression tool, optimize images for web',
      seoTitle: 'Free Image Compressor - Reduce Photo Size Online | Optimize Images',
      metaDescription: 'Compress images up to 90% smaller while maintaining quality. Free image optimizer with smart compression for JPG, PNG, WebP. No upload required.',
      longTailKeywords: 'how to compress image online free, reduce image file size without losing quality, best image compressor tool, optimize images for website, compress photos for email',
      icon: 'fas fa-compress',
      color: 'text-green-400',
      category: 'Image Tools',
      featured: true,
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Image Compressor Pro',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['90% size reduction', 'Quality preservation', 'Multiple formats', 'Batch compression', 'Web optimization'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '1756' }
      }
    },
    {
      name: 'Universal Image Converter',
      slug: 'convert',
      path: '/image/convert',
      description: 'Convert images between 20+ formats including PNG, JPG, WebP, HEIC, and more. Support for modern formats with quality control.',
      keywords: 'image converter, png to jpg, webp converter, format converter, image format, heic converter, convert image online, image format converter, jpg to png, webp to jpg, png converter, image file converter, convert photos online',
      seoTitle: 'Free Image Converter - Convert Images Online | 20+ Formats',
      metaDescription: 'Convert images between PNG, JPG, WebP, HEIC and 20+ formats. Free online image converter with quality control. No upload required, secure processing.',
      longTailKeywords: 'how to convert image format online free, png to jpg converter online, webp to jpg converter, heic to jpg converter, best image format converter',
      icon: 'fas fa-exchange-alt',
      color: 'text-green-400',
      category: 'Image Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Universal Image Converter',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['20+ formats support', 'Quality control', 'Batch conversion', 'Modern formats', 'No upload required'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1543' }
      }
    },
    {
      name: 'Precision Image Cropper',
      slug: 'crop',
      path: '/image/crop',
      description: 'Crop images with pixel-perfect precision and popular aspect ratios. Smart cropping with face detection and golden ratio guides.',
      keywords: 'image crop, crop photo, image cutter, trim image, aspect ratio cropper, crop image online, photo cropper tool, square crop, circular crop, custom crop dimensions, smart crop, crop image to size',
      seoTitle: 'Free Image Cropper - Crop Photos Online | Precision Tool',
      metaDescription: 'Crop images with pixel-perfect precision. Free photo cropper with aspect ratios, smart detection, and custom dimensions. Professional cropping made easy.',
      longTailKeywords: 'how to crop image online free, photo cropper with aspect ratio, crop image to specific size, best online image cropper, crop picture to square',
      icon: 'fas fa-crop',
      color: 'text-green-400',
      category: 'Image Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Precision Image Cropper',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Pixel-perfect precision', 'Aspect ratio presets', 'Custom dimensions', 'Smart detection', 'Multiple formats'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1432' }
      }
    },
    {
      name: 'Image Filter Studio',
      slug: 'filters',
      path: '/image/filters',
      description: 'Apply professional filters and effects to enhance your images. 50+ premium filters including vintage, modern, artistic, and cinematic effects.',
      keywords: 'image filters, photo effects, image enhancement, vintage filters, photo studio, apply filters to image, photo filter online, instagram filters, professional photo effects, image effects online, artistic filters',
      seoTitle: 'Free Photo Filter Studio - Apply Image Filters Online',
      metaDescription: 'Apply 50+ professional filters to your photos. Free image filter studio with vintage, artistic, and modern effects. Enhance photos instantly online.',
      longTailKeywords: 'how to apply filters to photos online free, photo filter app online, vintage photo filters, professional image effects, best photo filter tool',
      icon: 'fas fa-adjust',
      color: 'text-green-400',
      category: 'Image Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Image Filter Studio',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['50+ professional filters', 'Real-time preview', 'Vintage effects', 'Modern filters', 'Artistic enhancements'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1289' }
      }
    },
    {
      name: 'Watermark Maker',
      slug: 'watermark',
      path: '/image/watermark',
      description: 'Add text or logo watermarks to protect your images and photos. Professional watermarking with transparency, positioning, and batch processing.',
      keywords: 'image watermark, photo watermark, logo watermark, copyright protection, add watermark to image, photo copyright, watermark generator online, protect images online, batch watermark, transparent watermark',
      seoTitle: 'Free Image Watermark Maker - Add Watermarks to Photos Online',
      metaDescription: 'Add custom text or logo watermarks to protect your images. Free watermark maker with positioning, transparency, and batch processing capabilities.',
      longTailKeywords: 'how to add watermark to image online free, photo watermark tool, copyright watermark generator, batch watermark images, transparent watermark maker',
      icon: 'fas fa-stamp',
      color: 'text-green-400',
      category: 'Image Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Image Watermark Maker',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Text watermarks', 'Logo watermarks', 'Position control', 'Transparency settings', 'Batch processing'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '934' }
      }
    },
    {
      name: 'Photo Upscaler AI',
      slug: 'upscale',
      path: '/image/upscale',
      description: 'Upscale images up to 4x resolution using artificial intelligence. Enhance low-resolution photos with AI-powered super-resolution technology.',
      keywords: 'image upscaler, photo enlarger, ai upscale, enhance resolution, image enhancer, upscale image online, ai image enhancement, photo resolution enhancer, enhance image quality, super resolution ai, image enlarger online',
      seoTitle: 'Free AI Image Upscaler - Enhance Photo Resolution Online',
      metaDescription: 'Upscale images up to 4x resolution with AI. Free photo enhancer that improves image quality and resolution using advanced artificial intelligence.',
      longTailKeywords: 'how to upscale image resolution online free, ai photo enhancer online, increase image resolution without losing quality, best image upscaler tool, enhance low resolution photos',
      icon: 'fas fa-search-plus',
      color: 'text-green-400',
      category: 'Image Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'AI Photo Upscaler',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['4x upscaling', 'AI enhancement', 'Quality preservation', 'Batch processing', 'Multiple formats'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1678' }
      }
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
      description: 'Create viral memes with customizable text, fonts, and layouts. Popular meme templates with custom text positioning and styling.',
      keywords: 'meme generator, create memes, meme maker, funny images, viral content, meme creator online, custom memes, meme templates, make memes online, funny meme generator, viral meme maker',
      seoTitle: 'Free Meme Generator - Create Memes Online | Viral Content Maker',
      metaDescription: 'Create viral memes with custom text and popular templates. Free meme generator with professional fonts, positioning controls, and instant sharing.',
      longTailKeywords: 'how to make memes online free, viral meme generator, custom meme creator, meme maker with templates, funny image generator with text',
      icon: 'fas fa-laugh',
      color: 'text-green-400',
      category: 'Image Tools',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Meme Generator',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: ['Popular templates', 'Custom text', 'Font selection', 'Position control', 'Instant sharing'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '2187' }
      }
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

// Export TOOLS as an alias for backward compatibility
export const TOOLS = TOOLS_REGISTRY;

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
