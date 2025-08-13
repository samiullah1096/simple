import { SEO_DEFAULTS } from '../lib/constants';

/**
 * Generate SEO-optimized title
 * @param {string} title - Page title
 * @param {boolean} useTemplate - Whether to use title template
 * @returns {string} - Formatted title
 */
export function generateTitle(title, useTemplate = true) {
  if (!title) return SEO_DEFAULTS.defaultTitle;
  
  if (useTemplate && !title.includes('ToolsUniverse')) {
    return SEO_DEFAULTS.titleTemplate.replace('%s', title);
  }
  
  return title;
}

/**
 * Generate meta description
 * @param {string} description - Custom description
 * @param {string} fallback - Fallback description
 * @returns {string} - Optimized description
 */
export function generateDescription(description, fallback = SEO_DEFAULTS.description) {
  if (!description) return fallback;
  
  // Ensure description is within optimal length (150-160 characters)
  if (description.length > 160) {
    return description.substring(0, 157) + '...';
  }
  
  return description;
}

/**
 * Generate keywords string
 * @param {string|Array} keywords - Keywords array or string
 * @param {Array} additionalKeywords - Additional keywords to append
 * @returns {string} - Comma-separated keywords
 */
export function generateKeywords(keywords, additionalKeywords = []) {
  let keywordArray = [];
  
  if (Array.isArray(keywords)) {
    keywordArray = keywords;
  } else if (typeof keywords === 'string') {
    keywordArray = keywords.split(',').map(k => k.trim());
  }
  
  // Add additional keywords
  keywordArray = [...keywordArray, ...additionalKeywords];
  
  // Remove duplicates and filter empty strings
  keywordArray = [...new Set(keywordArray)].filter(k => k.length > 0);
  
  // Limit to 10-15 keywords for optimal SEO
  return keywordArray.slice(0, 15).join(', ');
}

/**
 * Generate canonical URL
 * @param {string} path - Page path
 * @param {string} baseUrl - Base URL
 * @returns {string} - Canonical URL
 */
export function generateCanonicalUrl(path, baseUrl = window.location.origin) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure base URL doesn't end with slash
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return cleanPath ? `${cleanBaseUrl}/${cleanPath}` : cleanBaseUrl;
}

/**
 * Generate Open Graph image URL
 * @param {string} imagePath - Custom image path
 * @param {string} fallback - Fallback image
 * @returns {string} - Complete image URL
 */
export function generateOgImage(imagePath, fallback = SEO_DEFAULTS.ogImage) {
  if (!imagePath) return fallback;
  
  // If it's already a complete URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Generate complete URL
  return `${window.location.origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

/**
 * Generate structured data for tools
 * @param {Object} tool - Tool information
 * @param {string} category - Tool category
 * @returns {Object} - Structured data object
 */
export function generateToolStructuredData(tool, category) {
  const baseUrl = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'description': tool.description,
    'url': `${baseUrl}${tool.path}`,
    'applicationCategory': 'ProductivityApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'featureList': tool.keywords ? tool.keywords.split(', ') : [],
    'provider': {
      '@type': 'Organization',
      'name': 'ToolsUniverse',
      'url': baseUrl
    },
    'softwareVersion': '1.0.0',
    'datePublished': '2024-01-01',
    'dateModified': new Date().toISOString().split('T')[0],
    'inLanguage': 'en',
    'isAccessibleForFree': true
  };
}

/**
 * Generate structured data for categories
 * @param {string} categoryName - Category name
 * @param {Array} tools - Array of tools in category
 * @returns {Object} - Structured data object
 */
export function generateCategoryStructuredData(categoryName, tools) {
  const baseUrl = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': categoryName,
    'url': `${baseUrl}/${categoryName.toLowerCase()}`,
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': tools.length,
      'itemListElement': tools.map((tool, index) => ({
        '@type': 'SoftwareApplication',
        'position': index + 1,
        'name': tool.name,
        'description': tool.description,
        'url': `${baseUrl}${tool.path}`
      }))
    }
  };
}

/**
 * Generate FAQ structured data
 * @param {Array} faqs - Array of FAQ objects with question and answer
 * @returns {Object} - FAQ structured data
 */
export function generateFAQStructuredData(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Array of breadcrumb objects
 * @returns {Object} - Breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs) {
  const baseUrl = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': `${baseUrl}${crumb.href}`
    }))
  };
}

/**
 * Extract and optimize meta tags from content
 * @param {string} content - HTML content or text
 * @returns {Object} - Extracted meta information
 */
export function extractMetaFromContent(content) {
  // Extract first sentence or paragraph for description
  const sentences = content.split(/[.!?]+/);
  const firstSentence = sentences[0]?.trim();
  
  // Extract keywords from content (basic implementation)
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 10);
  
  const uniqueWords = [...new Set(words)];
  
  return {
    description: generateDescription(firstSentence),
    keywords: uniqueWords.join(', '),
    wordCount: content.split(/\s+/).length
  };
}

/**
 * Validate and optimize URL for SEO
 * @param {string} url - URL to validate
 * @returns {Object} - Validation result and optimized URL
 */
export function validateAndOptimizeUrl(url) {
  const errors = [];
  let optimizedUrl = url;
  
  // Check URL length (should be under 255 characters)
  if (url.length > 255) {
    errors.push('URL too long (>255 characters)');
  }
  
  // Check for special characters that should be encoded
  const specialChars = /[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/g;
  if (specialChars.test(url)) {
    optimizedUrl = encodeURI(url);
  }
  
  // Check for consecutive slashes
  optimizedUrl = optimizedUrl.replace(/\/+/g, '/');
  
  // Ensure lowercase (except for query parameters)
  const [path, query] = optimizedUrl.split('?');
  optimizedUrl = path.toLowerCase() + (query ? `?${query}` : '');
  
  return {
    isValid: errors.length === 0,
    errors,
    optimized: optimizedUrl,
    improvements: optimizedUrl !== url ? ['URL optimized for SEO'] : []
  };
}

/**
 * Generate social media sharing URLs
 * @param {Object} pageData - Page data including title, description, and URL
 * @returns {Object} - Social media sharing URLs
 */
export function generateSocialSharingUrls(pageData) {
  const { title, description, url, hashtags = [] } = pageData;
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(url);
  const encodedHashtags = hashtags.map(tag => encodeURIComponent(tag)).join(',');
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${encodedHashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
  };
}
