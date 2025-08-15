import { useEffect } from 'react';
import { SEO_DEFAULTS } from '../../lib/constants';

/**
 * Enhanced Meta component for comprehensive SEO optimization
 * Supports all modern SEO best practices for Google Page 1 ranking
 */
export default function Meta({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage,
  ogType = 'website',
  author,
  publishDate,
  modifiedDate,
  category,
  tags = [],
  lang = 'en',
  robots,
  schema,
  alternateLanguages = {},
  breadcrumbs = [],
  priority = '0.8',
  changeFreq = 'weekly'
}) {
  useEffect(() => {
    // Enhanced meta tag updater with validation
    const updateMeta = (name, content, isRequired = false) => {
      if (!content && !isRequired) return;
      
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content || '';
    };

    // Enhanced property updater
    const updateProperty = (property, content, isRequired = false) => {
      if (!content && !isRequired) return;
      
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content || '';
    };
    
    // Enhanced link updater
    const updateLink = (rel, href, attributes = {}) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      
      // Add additional attributes
      Object.entries(attributes).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
    };

    // Update document title with enhanced formatting
    if (title) {
      document.title = title;
      // Update title meta tag for consistency
      updateMeta('title', title);
    }

    // Essential meta tags for SEO
    updateMeta('description', description, true);
    updateMeta('keywords', keywords);
    updateMeta('author', author || SEO_DEFAULTS.author);
    updateMeta('publisher', SEO_DEFAULTS.publisher);
    updateMeta('robots', robots || SEO_DEFAULTS.robots);
    updateMeta('viewport', SEO_DEFAULTS.viewport);
    updateMeta('theme-color', SEO_DEFAULTS.themeColor);
    updateMeta('color-scheme', SEO_DEFAULTS.colorScheme);
    
    // Content categorization
    if (category) updateMeta('article:section', category);
    if (publishDate) updateMeta('article:published_time', publishDate);
    if (modifiedDate) updateMeta('article:modified_time', modifiedDate);
    
    // Tags for topic clustering
    if (tags.length > 0) {
      updateMeta('article:tag', tags.join(', '));
      tags.forEach((tag, index) => {
        updateMeta(`article:tag:${index}`, tag);
      });
    }
    
    // Language specification
    document.documentElement.lang = lang;
    updateMeta('language', lang);
    
    // Open Graph enhanced tags
    updateProperty('og:title', title, true);
    updateProperty('og:description', description, true);
    updateProperty('og:type', ogType);
    updateProperty('og:url', canonical ? `${window.location.origin}${canonical}` : window.location.href, true);
    updateProperty('og:site_name', 'ToolsUniverse');
    updateProperty('og:locale', 'en_US');
    
    if (ogImage) {
      updateProperty('og:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);
      updateProperty('og:image:alt', `${title} - ToolsUniverse`);
      updateProperty('og:image:width', '1200');
      updateProperty('og:image:height', '630');
      updateProperty('og:image:type', 'image/png');
    }

    // Enhanced Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:site', SEO_DEFAULTS.twitterHandle);
    updateMeta('twitter:creator', SEO_DEFAULTS.twitterHandle);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    
    if (ogImage) {
      updateMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);
      updateMeta('twitter:image:alt', `${title} - ToolsUniverse`);
    }
    
    // Additional social meta tags
    updateProperty('fb:app_id', ''); // Add if you have Facebook app
    updateMeta('pinterest:description', description);
    if (ogImage) updateMeta('pinterest:media', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

    // Canonical and alternate URLs
    const canonicalUrl = canonical ? `${window.location.origin}${canonical}` : window.location.href;
    updateLink('canonical', canonicalUrl);
    
    // Alternate language versions
    Object.entries(alternateLanguages).forEach(([lang, url]) => {
      updateLink('alternate', url, { hreflang: lang });
    });
    
    // Prefetch and preconnect for performance
    updateLink('preconnect', 'https://fonts.googleapis.com');
    updateLink('preconnect', 'https://fonts.gstatic.com', { crossorigin: 'anonymous' });
    updateLink('preconnect', 'https://cdn.jsdelivr.net');
    
    // Sitemap reference
    updateLink('sitemap', `${window.location.origin}/sitemap.xml`);
    
    // RSS feed (if applicable)
    updateLink('alternate', `${window.location.origin}/feed.xml`, { type: 'application/rss+xml', title: 'ToolsUniverse RSS Feed' });
    
    // Manifest for PWA
    updateLink('manifest', '/manifest.json');
    
    // Favicon variations
    updateLink('icon', '/favicon.ico', { sizes: 'any' });
    updateLink('icon', '/favicon.svg', { type: 'image/svg+xml' });
    updateLink('apple-touch-icon', '/apple-touch-icon.png');

    // Remove old/outdated meta tags that might hurt SEO
    const removeOutdatedMeta = () => {
      const outdatedSelectors = [
        'meta[name="generator"]',
        'meta[name="rating"]',
        'meta[http-equiv="imagetoolbar"]',
        'meta[name="MSSmartTagsPreventParsing"]'
      ];
      
      outdatedSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.remove();
      });
    };
    
    removeOutdatedMeta();
    
  }, [title, description, keywords, canonical, ogImage, ogType, author, publishDate, modifiedDate, category, tags, lang, robots, alternateLanguages]);

  return null;
}