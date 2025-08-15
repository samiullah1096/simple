import { useEffect } from 'react';

/**
 * Voice Search Optimization component for AEO
 * Optimizes content for voice queries and conversational AI
 */
export default function VoiceSearchOptimizer({ 
  questions = [], 
  entity = '', 
  location = '',
  localBusiness = false 
}) {
  useEffect(() => {
    // Enhanced structured data for voice search
    const voiceSearchSchema = {
      '@context': 'https://schema.org',
      '@type': localBusiness ? 'LocalBusiness' : 'WebPage',
      name: `${entity} - Voice Search Optimized`,
      description: `Get instant voice answers about ${entity.toLowerCase()}`,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.voice-answer', '.direct-answer', '.answer-snippet', 'h1', 'h2'],
        xpath: [
          '/html/head/title',
          '/html/body//h1',
          '/html/body//*[@class=\"voice-answer\"]',
          '/html/body//*[@class=\"direct-answer\"]'
        ]
      },
      mainEntity: questions.map((q, index) => ({
        '@type': 'Question',
        name: q.question,
        text: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.voice-answer', '.direct-answer'],
            xpath: `/html/body//*[@id=\"voice-answer-${index}\"]`
          }
        },
        // Voice search specific properties
        inLanguage: 'en-US',
        audience: {
          '@type': 'Audience',
          audienceType: 'general public'
        },
        about: {
          '@type': 'Thing',
          name: entity,
          description: `Information about ${entity.toLowerCase()}`
        }
      })),
      // Voice search enhancements
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${window.location.origin}/search?q={search_term_string}`,
            actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform', 'http://schema.org/IOSPlatform', 'http://schema.org/AndroidPlatform']
          },
          'query-input': 'required name=search_term_string'
        }
      ]
    };

    // Add location data for local voice searches
    if (localBusiness && location) {
      voiceSearchSchema.address = {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressCountry: 'US'
      };
      voiceSearchSchema.geo = {
        '@type': 'GeoCoordinates',
        latitude: '40.7128',  // Default to NYC, update as needed
        longitude: '-74.0060'
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(voiceSearchSchema);
    script.id = 'voice-search-schema';
    
    // Remove existing script
    const existing = document.getElementById(script.id);
    if (existing) existing.remove();
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [questions, entity, location, localBusiness]);

  return (
    <div className="voice-search-optimization hidden">
      {/* Voice-optimized content (hidden but crawlable) */}
      {questions.map((q, index) => (
        <div key={index} className="voice-answer" id={`voice-answer-${index}`}>
          <div className="voice-question" itemProp="name">{q.question}</div>
          <div className="voice-answer-text" itemProp="text">{q.answer}</div>
        </div>
      ))}
      
      {/* Structured data hints for voice assistants */}
      <div itemScope itemType="https://schema.org/FAQPage" className="sr-only">
        <meta itemProp="name" content={`${entity} FAQ - Voice Search Optimized`} />
        <meta itemProp="description" content={`Voice-optimized answers about ${entity.toLowerCase()}`} />
        {questions.map((q, index) => (
          <div key={index} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <meta itemProp="name" content={q.question} />
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <meta itemProp="text" content={q.answer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}