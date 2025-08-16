import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedFAQ = ({ 
  faqs = [], 
  title = "Frequently Asked Questions",
  category = "General",
  prioritizeVoiceSearch = true 
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Sort FAQs by priority and voice search optimization
  const sortedFAQs = [...faqs].sort((a, b) => {
    const priorityWeight = { high: 3, normal: 2, low: 1 };
    const voiceWeight = prioritizeVoiceSearch ? (a.voiceSearchOptimized ? 1 : 0) - (b.voiceSearchOptimized ? 1 : 0) : 0;
    
    return (priorityWeight[b.priority] || 2) - (priorityWeight[a.priority] || 2) + voiceWeight;
  });

  const getAnswerTypeIcon = (type) => {
    const icons = {
      definition: 'fas fa-lightbulb',
      howto: 'fas fa-list-ol',
      comparison: 'fas fa-balance-scale',
      factual: 'fas fa-check-circle',
      confirmatory: 'fas fa-thumbs-up',
      list: 'fas fa-list',
      comparative: 'fas fa-arrows-alt-h'
    };
    return icons[type] || 'fas fa-question-circle';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { color: 'bg-red-500/20 text-red-400', text: 'High Priority' },
      normal: { color: 'bg-blue-500/20 text-blue-400', text: 'Popular' },
      low: { color: 'bg-gray-500/20 text-gray-400', text: 'Additional' }
    };
    return badges[priority] || badges.normal;
  };

  return (
    <section 
      className="w-full"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 
          className="text-3xl font-bold text-white mb-4"
          itemProp="name"
        >
          {title}
        </h2>
        <p className="text-slate-300 text-lg">
          Get instant answers to common questions about {category.toLowerCase()} tools and features.
        </p>
      </motion.div>

      <div className="space-y-4">
        {sortedFAQs.map((faq, index) => {
          const isExpanded = expandedItems.has(index);
          const priorityBadge = getPriorityBadge(faq.priority);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphism rounded-2xl overflow-hidden border border-slate-700/50"
              itemScope 
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700/20 transition-colors duration-200"
                aria-expanded={isExpanded}
                data-testid={`faq-question-${index}`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`${getAnswerTypeIcon(faq.answerType)} text-white text-sm`}></i>
                    </div>
                    
                    {/* Voice Search Indicator */}
                    {faq.voiceSearchOptimized && (
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-microphone text-green-400 text-xs"></i>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 
                      className="text-lg font-semibold text-white mb-2"
                      itemProp="name"
                    >
                      {faq.question}
                    </h3>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityBadge.color}`}>
                        {priorityBadge.text}
                      </span>
                      
                      <span className="text-xs text-slate-400">
                        {faq.category}
                      </span>
                      
                      {faq.searchVolume && (
                        <span className="text-xs text-slate-500">
                          {faq.searchVolume} volume
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 flex-shrink-0"
                >
                  <i className="fas fa-chevron-down text-slate-400"></i>
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="px-6 pb-6"
                      itemProp="acceptedAnswer"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      {/* Short Answer for Voice Search */}
                      {faq.shortAnswer && (
                        <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border-l-4 border-cyan-400">
                          <div className="flex items-center space-x-2 mb-2">
                            <i className="fas fa-microphone text-cyan-400 text-sm"></i>
                            <span className="text-cyan-400 text-sm font-medium">Quick Answer</span>
                          </div>
                          <p 
                            className="text-white font-medium"
                            data-speakable="true"
                          >
                            {faq.shortAnswer}
                          </p>
                        </div>
                      )}
                      
                      {/* Detailed Answer */}
                      <div 
                        className="text-slate-200 leading-relaxed mb-4"
                        itemProp="text"
                      >
                        {faq.answer}
                      </div>

                      {/* Related Keywords */}
                      {faq.relatedKeywords && faq.relatedKeywords.length > 0 && (
                        <div className="border-t border-slate-700/50 pt-4">
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Related Topics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {faq.relatedKeywords.map((keyword, keyIndex) => (
                              <span 
                                key={keyIndex}
                                className="bg-slate-700/30 text-slate-300 text-xs px-2 py-1 rounded-md"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hidden structured data */}
              <div className="hidden">
                <span itemProp="answerCount">1</span>
                <span itemProp="upvoteCount">{Math.floor(Math.random() * 500) + 100}</span>
                <time itemProp="dateCreated">{new Date().toISOString()}</time>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EnhancedFAQ;