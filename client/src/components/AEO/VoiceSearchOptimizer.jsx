import React from 'react';
import { motion } from 'framer-motion';

const VoiceSearchOptimizer = ({ 
  content, 
  conversationalQueries = [],
  speakableContent = [],
  localContext = false 
}) => {
  const voiceQueries = [
    "What are the best free online tools?",
    "How do I edit PDF without software?",
    "Find free image converter online",
    "What tools work without internet?",
    ...conversationalQueries
  ];

  const speakableElements = [
    "ToolsUniverse offers sixty plus free online tools",
    "All processing happens locally in your browser",
    "No registration or account creation required",
    "Complete privacy protection for your files",
    ...speakableContent
  ];

  return (
    <div className="voice-search-optimization hidden">
      {/* Speakable Content Markup */}
      <div 
        className="speakable-content"
        data-speakable="true"
        itemScope
        itemType="https://schema.org/SpeakableSpecification"
      >
        {speakableElements.map((element, index) => (
          <span 
            key={index}
            itemProp="speakable"
            data-speakable="true"
            className="voice-optimized-content"
          >
            {element}
          </span>
        ))}
      </div>

      {/* Conversational Query Mapping */}
      <div 
        className="conversational-queries"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        {voiceQueries.map((query, index) => (
          <div 
            key={index}
            itemScope
            itemType="https://schema.org/Question"
            className="voice-query-mapping"
          >
            <span itemProp="name">{query}</span>
            <div 
              itemProp="acceptedAnswer"
              itemScope
              itemType="https://schema.org/Answer"
            >
              <span itemProp="text">
                {content || "ToolsUniverse provides comprehensive online tools for all your productivity needs."}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Search Keywords */}
      <div className="voice-keywords">
        <meta name="voice-search-keywords" content="free online tools, PDF editor, image converter, browser tools, privacy tools" />
        <meta name="conversational-intent" content="find tools, how to edit, what is best, where to convert" />
        <meta name="voice-search-context" content="local business, online service, productivity software" />
      </div>

      {/* Local Context for Voice Search */}
      {localContext && (
        <div 
          itemScope
          itemType="https://schema.org/LocalBusiness"
          className="local-voice-context"
        >
          <span itemProp="name">ToolsUniverse</span>
          <span itemProp="description">Online productivity tools platform</span>
          <span itemProp="serviceType">Software as a Service</span>
          <span itemProp="areaServed">Worldwide</span>
        </div>
      )}

      {/* Voice Search Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SpeakableSpecification",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".speakable-content", "[data-speakable='true']"],
            "xpath": [
              "/html/body//div[@data-speakable='true']",
              "/html/body//span[@data-speakable='true']"
            ]
          },
          "inLanguage": "en-US",
          "isAccessibleForFree": true
        })}
      </script>
    </div>
  );
};

// Voice Search SEO Component for Page Integration
export const VoiceSearchSEO = ({ pageTitle, pageDescription, keywords = [] }) => {
  const voiceOptimizedQueries = [
    `What is ${pageTitle}?`,
    `How to use ${pageTitle}?`,
    `Best ${pageTitle} online`,
    `Free ${pageTitle} tool`,
    ...keywords.map(keyword => `${keyword} online tool`)
  ];

  return (
    <>
      {/* Voice Search Meta Tags */}
      <meta name="voice-search-title" content={pageTitle} />
      <meta name="voice-search-description" content={pageDescription} />
      <meta name="conversational-queries" content={voiceOptimizedQueries.join(', ')} />
      
      {/* Speakable Content CSS Selectors */}
      <style>
        {`
          [data-speakable="true"] {
            speak: spell-out;
            voice-family: female;
            voice-rate: medium;
            voice-pitch: medium;
          }
          
          .voice-optimized-content {
            speech-rate: slow;
            speech-volume: loud;
          }
        `}
      </style>
      
      {/* Voice Search Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": pageTitle,
          "description": pageDescription,
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".speakable-content", "[data-speakable='true']"]
          },
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": pageTitle,
            "description": pageDescription,
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        })}
      </script>
    </>
  );
};

export default VoiceSearchOptimizer;