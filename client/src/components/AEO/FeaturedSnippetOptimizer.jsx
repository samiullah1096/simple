import React from 'react';
import { motion } from 'framer-motion';

const FeaturedSnippetOptimizer = ({ 
  question,
  answer,
  type = 'paragraph',
  data = [],
  steps = [],
  listItems = [],
  className = ''
}) => {
  
  const renderParagraphSnippet = () => (
    <div 
      className="featured-snippet-paragraph bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6"
      itemScope
      itemType="https://schema.org/Answer"
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <i className="fas fa-lightbulb text-blue-400 mr-3"></i>
        {question}
      </h3>
      <p 
        className="text-slate-200 leading-relaxed text-lg"
        itemProp="text"
        data-featured-snippet="paragraph"
      >
        {answer}
      </p>
    </div>
  );

  const renderListSnippet = () => (
    <div 
      className="featured-snippet-list bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <i className="fas fa-list text-green-400 mr-3"></i>
        {question}
      </h3>
      <ul className="space-y-3" itemProp="itemListElement">
        {listItems.map((item, index) => (
          <li 
            key={index}
            className="flex items-start space-x-3 text-slate-200"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span 
              className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-medium"
              itemProp="position"
            >
              {index + 1}
            </span>
            <span itemProp="name" data-featured-snippet="list-item">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderStepsSnippet = () => (
    <div 
      className="featured-snippet-steps bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6"
      itemScope
      itemType="https://schema.org/HowTo"
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <i className="fas fa-list-ol text-purple-400 mr-3"></i>
        {question}
      </h3>
      <div className="space-y-4" itemProp="step">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex items-start space-x-4 p-4 bg-slate-800/30 rounded-xl"
            itemScope
            itemType="https://schema.org/HowToStep"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 
                className="font-medium text-white mb-2"
                itemProp="name"
              >
                Step {index + 1}
              </h4>
              <p 
                className="text-slate-200"
                itemProp="text"
                data-featured-snippet="step"
              >
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTableSnippet = () => (
    <div 
      className="featured-snippet-table bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-6 overflow-x-auto"
      itemScope
      itemType="https://schema.org/Table"
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <i className="fas fa-table text-orange-400 mr-3"></i>
        {question}
      </h3>
      <table className="w-full" itemProp="about">
        <thead>
          <tr className="border-b border-slate-700">
            {data[0] && Object.keys(data[0]).map((header, index) => (
              <th 
                key={index}
                className="text-left py-3 px-4 text-white font-medium"
                data-featured-snippet="table-header"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className="border-b border-slate-800 hover:bg-slate-800/20"
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td 
                  key={cellIndex}
                  className="py-3 px-4 text-slate-200"
                  data-featured-snippet="table-cell"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const snippetRenderers = {
    paragraph: renderParagraphSnippet,
    list: renderListSnippet,
    steps: renderStepsSnippet,
    table: renderTableSnippet
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`featured-snippet-optimizer ${className}`}
      data-snippet-type={type}
    >
      {snippetRenderers[type] ? snippetRenderers[type]() : renderParagraphSnippet()}
      
      {/* Hidden metadata for search engines */}
      <div className="hidden">
        <meta itemProp="answerType" content={type} />
        <meta itemProp="featured" content="true" />
        <meta itemProp="position" content="0" />
        <time itemProp="datePublished">{new Date().toISOString()}</time>
        <span itemProp="author">ToolsUniverse</span>
      </div>
    </motion.div>
  );
};

// Utility component for quick snippet generation
export const QuickSnippet = ({ title, content, type = 'paragraph' }) => {
  return (
    <FeaturedSnippetOptimizer
      question={title}
      answer={content}
      type={type}
      className="mb-6"
    />
  );
};

// SEO-optimized snippet for tool pages
export const ToolSnippet = ({ toolName, description, features = [], howToUse = [] }) => {
  return (
    <div className="space-y-6">
      <FeaturedSnippetOptimizer
        question={`What is ${toolName}?`}
        answer={description}
        type="paragraph"
      />
      
      {features.length > 0 && (
        <FeaturedSnippetOptimizer
          question={`${toolName} Features`}
          listItems={features}
          type="list"
        />
      )}
      
      {howToUse.length > 0 && (
        <FeaturedSnippetOptimizer
          question={`How to use ${toolName}?`}
          steps={howToUse}
          type="steps"
        />
      )}
    </div>
  );
};

export default FeaturedSnippetOptimizer;