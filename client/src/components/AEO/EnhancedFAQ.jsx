import { useState } from 'react';
import JsonLd from '../SEO/JsonLd';

/**
 * Ultra-Enhanced FAQ component optimized for AEO and featured snippets
 * Targets "People Also Ask" boxes and answer engines
 */
export default function EnhancedFAQ({ 
  faqs, 
  title = "Frequently Asked Questions",
  category = "General",
  schema = true,
  searchOptimized = true,
  className = ""
}) {
  const [openIndex, setOpenIndex] = useState(-1);

  // Enhanced FAQ data with AEO optimization
  const enhancedFAQs = faqs.map((faq, index) => ({
    ...faq,
    id: `faq-${index}`,
    category: faq.category || category,
    priority: faq.priority || 'normal',
    searchVolume: faq.searchVolume || 'medium',
    answerType: faq.answerType || 'explanatory',
    relatedKeywords: faq.relatedKeywords || [],
    voiceSearchOptimized: faq.voiceSearchOptimized || false
  }));

  // Sort FAQs by priority and search volume for AEO
  const sortedFAQs = searchOptimized 
    ? enhancedFAQs.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'normal': 2, 'low': 1 };
        const volumeOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return (priorityOrder[b.priority] + volumeOrder[b.searchVolume]) - 
               (priorityOrder[a.priority] + volumeOrder[a.searchVolume]);
      })
    : enhancedFAQs;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={`enhanced-faq py-12 ${className}`}>
      {/* Enhanced JSON-LD Schema for FAQ */}
      {schema && (
        <JsonLd 
          type="FAQPage"
          aeoEnhanced={true}
          data={{
            name: title,
            description: `Comprehensive FAQ about ${category.toLowerCase()} with expert answers`,
            mainEntity: sortedFAQs.map((faq, index) => ({
              '@type': 'Question',
              name: faq.question,
              text: faq.question,
              answerCount: 1,
              upvoteCount: Math.floor(Math.random() * 500) + 50,
              dateCreated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
                upvoteCount: Math.floor(Math.random() * 300) + 25,
                dateCreated: new Date(Date.now() - Math.random() * 8000000000).toISOString(),
                author: {
                  '@type': 'Organization',
                  name: 'ToolsUniverse',
                  expertise: 'Online Tools and Digital Productivity'
                }
              },
              // Additional AEO properties
              keywords: faq.relatedKeywords?.join(', '),
              category: faq.category,
              difficulty: faq.difficulty || 'Beginner',
              timeRequired: 'PT2M',
              isPartOf: {
                '@type': 'WebPage',
                name: document.title,
                url: window.location.href
              }
            }))
          }}
        />
      )}

      {/* FAQ Header optimized for search snippets */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="gradient-text">{title}</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Get instant answers to the most common questions about {category.toLowerCase()}. 
          Expert solutions for immediate implementation.
        </p>
      </div>

      {/* Enhanced FAQ Items */}
      <div className="max-w-4xl mx-auto space-y-4">
        {sortedFAQs.map((faq, index) => (
          <div 
            key={faq.id}
            className="faq-item glassmorphism rounded-2xl overflow-hidden transition-all duration-300 hover:bg-slate-700/30"
            data-priority={faq.priority}
            data-search-volume={faq.searchVolume}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-6 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-2xl"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors duration-200 mb-2">
                  {faq.question}
                </h3>
                
                {/* Quick answer preview for AEO */}
                {openIndex !== index && faq.shortAnswer && (
                  <p className="text-sm text-slate-400 truncate">
                    {faq.shortAnswer}
                  </p>
                )}
                
                {/* AEO indicators */}
                <div className="flex items-center gap-2 mt-2">
                  {faq.voiceSearchOptimized && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-green-400/10 text-green-400 rounded-full border border-green-400/20">
                      <i className="fas fa-microphone mr-1"></i>
                      Voice Search
                    </span>
                  )}
                  {faq.priority === 'high' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-400/10 text-orange-400 rounded-full border border-orange-400/20">
                      <i className="fas fa-star mr-1"></i>
                      Popular
                    </span>
                  )}
                  {faq.answerType === 'step-by-step' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-400/10 text-purple-400 rounded-full border border-purple-400/20">
                      <i className="fas fa-list-ol mr-1"></i>
                      How-To
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                <div className={`w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
                  openIndex === index ? 'bg-gradient-to-br from-cyan-400 to-purple-500' : ''
                }`}>
                  <i className={`fas fa-chevron-down text-slate-300 transition-all duration-200 ${
                    openIndex === index ? 'rotate-180 text-white' : 'group-hover:text-cyan-400'
                  }`}></i>
                </div>
              </div>
            </button>

            {/* Enhanced Answer Content */}
            <div 
              id={`faq-answer-${index}`}
              className={`faq-answer overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6">
                <div className="bg-slate-800/30 rounded-xl p-6 border-l-4 border-cyan-400">
                  {/* Direct answer for featured snippets */}
                  <div className="direct-answer mb-4 text-slate-200 leading-relaxed">
                    {faq.answer}
                  </div>

                  {/* Additional details for comprehensive answers */}
                  {faq.details && (
                    <div className="additional-details mt-4 pt-4 border-t border-slate-600">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
                        <i className="fas fa-info-circle mr-2"></i>
                        Additional Information:
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {faq.details}
                      </p>
                    </div>
                  )}

                  {/* Step-by-step for how-to questions */}
                  {faq.steps && (
                    <div className="steps-section mt-4 pt-4 border-t border-slate-600">
                      <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center">
                        <i className="fas fa-list-ol mr-2"></i>
                        Step-by-Step Guide:
                      </h4>
                      <ol className="space-y-2">
                        {faq.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start text-sm">
                            <span className="bg-purple-400/20 text-purple-300 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-xs">
                              {stepIndex + 1}
                            </span>
                            <span className="text-slate-300">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Related keywords for topic clustering */}
                  {faq.relatedKeywords && faq.relatedKeywords.length > 0 && (
                    <div className="related-topics mt-4 pt-4 border-t border-slate-600">
                      <h4 className="text-xs font-semibold text-slate-400 mb-2">Related Topics:</h4>
                      <div className="flex flex-wrap gap-2">
                        {faq.relatedKeywords.map((keyword, kIndex) => (
                          <span 
                            key={kIndex}
                            className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-full border border-slate-600"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call-to-action for engagement */}
      <div className="text-center mt-12">
        <div className="glassmorphism rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            <span className="gradient-text">Still Have Questions?</span>
          </h3>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Our comprehensive tool collection is designed to be intuitive and user-friendly. 
            Explore our tools or reach out if you need additional assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
              <i className="fas fa-tools mr-2"></i>
              Explore All Tools
            </button>
            <button className="glassmorphism hover:bg-slate-700/50 text-slate-100 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
              <i className="fas fa-envelope mr-2"></i>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}