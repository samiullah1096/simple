import React from 'react';
import { motion } from 'framer-motion';

const AnswerSnippet = ({ 
  question, 
  answer, 
  shortAnswer, 
  type = 'definition',
  priority = 'high',
  relatedKeywords = [],
  category = 'General'
}) => {
  const snippetTypes = {
    definition: {
      icon: 'fas fa-lightbulb',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    howto: {
      icon: 'fas fa-list-ol',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    },
    comparison: {
      icon: 'fas fa-balance-scale',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    factual: {
      icon: 'fas fa-check-circle',
      bgColor: 'from-orange-500/20 to-yellow-500/20',
      borderColor: 'border-orange-500/30'
    }
  };

  const currentType = snippetTypes[type] || snippetTypes.definition;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentType.bgColor} border ${currentType.borderColor} p-6 mb-8`}
      itemScope 
      itemType="https://schema.org/Question"
    >
      {/* Priority indicator */}
      {priority === 'high' && (
        <div className="absolute top-4 right-4">
          <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Question */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <i className={`${currentType.icon} text-white text-lg`}></i>
          </div>
        </div>
        <div className="flex-1">
          <h3 
            className="text-xl font-semibold text-white mb-2 leading-tight"
            itemProp="name"
          >
            {question}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-slate-300">
            <span className="bg-slate-700/50 px-2 py-1 rounded-md">{category}</span>
            <span>•</span>
            <span className="capitalize">{type}</span>
          </div>
        </div>
      </div>

      {/* Short Answer for Voice Search */}
      <div 
        className="bg-slate-800/50 rounded-xl p-4 mb-4 border-l-4 border-cyan-400"
        itemProp="acceptedAnswer"
        itemScope
        itemType="https://schema.org/Answer"
      >
        <div className="flex items-center space-x-2 mb-2">
          <i className="fas fa-microphone text-cyan-400 text-sm"></i>
          <span className="text-cyan-400 text-sm font-medium">Quick Answer</span>
        </div>
        <p 
          className="text-white font-medium leading-relaxed"
          itemProp="text"
          data-speakable="true"
        >
          {shortAnswer}
        </p>
      </div>

      {/* Detailed Answer */}
      <div className="text-slate-200 leading-relaxed mb-4">
        <p>{answer}</p>
      </div>

      {/* Related Keywords */}
      {relatedKeywords.length > 0 && (
        <div className="border-t border-slate-700/50 pt-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Related Topics:</h4>
          <div className="flex flex-wrap gap-2">
            {relatedKeywords.map((keyword, index) => (
              <span 
                key={index}
                className="bg-slate-700/30 text-slate-300 text-xs px-2 py-1 rounded-md"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AEO Structured Data Attributes */}
      <div className="hidden" itemProp="additionalProperty">
        <span itemProp="name">answerType</span>
        <span itemProp="value">{type}</span>
      </div>
      <div className="hidden" itemProp="additionalProperty">
        <span itemProp="name">priority</span>
        <span itemProp="value">{priority}</span>
      </div>
    </motion.div>
  );
};

export default AnswerSnippet;