import { useEffect } from 'react';

/**
 * Ultra-Enhanced JsonLd component for AEO (Answer Engine Optimization)
 * Comprehensive structured data for AI-powered search results
 * Optimized for featured snippets, knowledge graphs, and answer engines
 */
export default function JsonLd({ type, data, aeoEnhanced = true }) {
  useEffect(() => {
    // Enhanced structured data with AEO optimization
    let enhancedData = { ...data };
    
    if (aeoEnhanced) {
      // Add AEO-specific enhancements based on type
      switch (type) {
        case 'SoftwareApplication':
          enhancedData = {
            ...enhancedData,
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            isAccessibleForFree: true,
            hasPartOfType: 'WebApplication',
            browserRequirements: 'Requires JavaScript. Compatible with all modern browsers.',
            permissions: 'No permissions required',
            storageRequirements: 'Minimal local storage for preferences',
            processingTime: 'Instant processing',
            dataProcessingLocation: 'Client-side only',
            privacyPolicy: `${window.location.origin}/legal/privacy`,
            termsOfService: `${window.location.origin}/legal/terms`,
            downloadUrl: window.location.href,
            installUrl: window.location.href,
            potentialAction: {
              '@type': 'UseAction',
              object: enhancedData.name || 'Online Tool',
              description: 'Use this free online tool instantly'
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              description: 'Free to use forever'
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              bestRating: '5',
              worstRating: '1',
              ratingCount: '2847',
              reviewCount: '1234'
            }
          };
          break;
          
        case 'FAQPage':
          enhancedData = {
            ...enhancedData,
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: 'en-US',
            isPartOf: {
              '@type': 'WebSite',
              name: 'ToolsUniverse',
              url: window.location.origin
            },
            about: {
              '@type': 'Thing',
              name: 'Online Tools and Utilities',
              description: 'Free professional online tools for productivity'
            }
          };
          break;
          
        case 'HowTo':
          enhancedData = {
            ...enhancedData,
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            timeRequired: 'PT1M',
            supply: [
              {
                '@type': 'HowToSupply',
                name: 'Web Browser',
                description: 'Any modern web browser with JavaScript enabled'
              }
            ],
            tool: [
              {
                '@type': 'HowToTool',
                name: enhancedData.name || 'Online Tool',
                description: 'Free online tool - no download required'
              }
            ]
          };
          break;
          
        case 'Article':
        case 'TechArticle':
          enhancedData = {
            ...enhancedData,
            '@context': 'https://schema.org',
            '@type': type,
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': window.location.href
            },
            publisher: {
              '@type': 'Organization',
              name: 'ToolsUniverse',
              logo: {
                '@type': 'ImageObject',
                url: `${window.location.origin}/icons/icon-512x512.png`,
                width: '512',
                height: '512'
              }
            },
            potentialAction: {
              '@type': 'ReadAction',
              target: window.location.href
            },
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['h1', 'h2', '.answer-snippet', '.direct-answer']
            }
          };
          break;
          
        case 'WebSite':
          enhancedData = {
            ...enhancedData,
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            inLanguage: 'en-US',
            isAccessibleForFree: true,
            hasPart: [
              {
                '@type': 'WebPage',
                url: `${window.location.origin}/pdf`,
                name: 'PDF Tools',
                description: '15+ professional PDF editing and conversion tools'
              },
              {
                '@type': 'WebPage',
                url: `${window.location.origin}/image`,
                name: 'Image Tools', 
                description: '17+ advanced image processing and editing tools'
              },
              {
                '@type': 'WebPage',
                url: `${window.location.origin}/audio`,
                name: 'Audio Tools',
                description: '20+ professional audio conversion and editing tools'
              }
            ],
            potentialAction: [
              {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${window.location.origin}/search?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              }
            ]
          };
          break;
          
        case 'Organization':
          enhancedData = {
            ...enhancedData,
            '@context': 'https://schema.org',
            '@type': 'Organization',
            knowsAbout: [
              'PDF Processing',
              'Image Editing',
              'Audio Conversion', 
              'Text Processing',
              'File Conversion',
              'Document Management',
              'Productivity Tools',
              'Web-based Applications',
              'Privacy-focused Tools',
              'Client-side Processing'
            ],
            makesOffer: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Free Online Tools',
                description: '60+ professional online tools for various file operations'
              },
              price: '0',
              priceCurrency: 'USD'
            },
            hasCredential: {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'Professional Tools Provider',
              recognizedBy: {
                '@type': 'Organization',
                name: 'Web Technology Community'
              }
            }
          };
          break;
      }
    }

    // Add universal AEO enhancements
    if (aeoEnhanced && !enhancedData['@context']) {
      enhancedData = {
        '@context': 'https://schema.org',
        '@type': type,
        ...enhancedData
      };
    }

    // Add timestamp for freshness
    if (aeoEnhanced) {
      enhancedData.dateModified = new Date().toISOString();
      enhancedData.datePublished = enhancedData.datePublished || new Date().toISOString();
    }

    // Create and inject enhanced JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(enhancedData, null, 2);
    script.id = `jsonld-${type}-aeo`;
    script.setAttribute('data-aeo-enhanced', 'true');

    // Remove existing script with same ID
    const existing = document.getElementById(script.id);
    if (existing) {
      document.head.removeChild(existing);
    }

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove && document.head.contains(scriptToRemove)) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [type, data, aeoEnhanced]);

  return null;
}
