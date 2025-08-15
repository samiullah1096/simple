import { useEffect } from 'react';

/**
 * AEO-optimized Answer Snippet component for featured snippets and answer boxes
 * Designed to capture position 0 in search results and AI-powered answers
 */
export default function AnswerSnippet({ 
  question, 
  answer, 
  shortAnswer, 
  steps = [], 
  relatedQuestions = [], 
  context,
  className = '',
  schema = true 
}) {
  useEffect(() => {
    if (schema) {
      // Enhanced JSON-LD for Q&A optimization
      const qaSchema = {
        '@context': 'https://schema.org',
        '@type': 'Question',
        name: question,
        text: question,
        answerCount: 1,
        upvoteCount: 247,
        dateCreated: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'ToolsUniverse'
        },
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
          upvoteCount: 189,
          url: window.location.href,
          author: {
            '@type': 'Organization',
            name: 'ToolsUniverse'
          }
        },
        suggestedAnswer: relatedQuestions.map(q => ({
          '@type': 'Answer',
          text: q.answer || `Learn more about ${q.question.toLowerCase()}`,
          author: {
            '@type': 'Organization',
            name: 'ToolsUniverse'
          }
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(qaSchema);
      script.id = 'answer-snippet-schema';
      
      // Remove existing script
      const existing = document.getElementById(script.id);
      if (existing) existing.remove();
      
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.getElementById(script.id);
        if (scriptToRemove) scriptToRemove.remove();
      };
    }
  }, [question, answer, relatedQuestions, schema]);

  return (
    <div className={`answer-snippet bg-gradient-to-r from-cyan-50/10 to-purple-50/10 border border-cyan-200/20 rounded-2xl p-6 mb-8 ${className}`}>
      {/* Direct Answer for Voice Search & AI */}
      <div className="direct-answer mb-4">
        <h3 className="text-xl font-semibold text-white mb-3 flex items-start">
          <i className="fas fa-lightbulb text-yellow-400 mr-3 mt-1 flex-shrink-0"></i>
          <span>{question}</span>
        </h3>
        
        {shortAnswer && (
          <div className="short-answer bg-cyan-400/10 border-l-4 border-cyan-400 pl-4 py-2 mb-4 rounded-r-lg">
            <p className="text-cyan-100 font-medium text-lg">{shortAnswer}</p>
          </div>
        )}
        
        <div className="detailed-answer text-slate-300 leading-relaxed">
          <p>{answer}</p>
        </div>
      </div>

      {/* Step-by-step for How-to queries */}
      {steps.length > 0 && (
        <div className="steps-container mt-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
            <i className="fas fa-list-ol mr-2"></i>
            Step-by-Step Instructions:
          </h4>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-cyan-400 text-slate-900 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">
                  {index + 1}
                </span>
                <div className="text-slate-300">
                  <p className="leading-relaxed">{step.description}</p>
                  {step.tip && (
                    <div className="mt-2 text-sm text-cyan-200 bg-cyan-400/5 rounded-lg px-3 py-2">
                      <i className="fas fa-info-circle mr-1"></i>
                      <strong>Tip:</strong> {step.tip}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Related Questions for People Also Ask */}
      {relatedQuestions.length > 0 && (
        <div className="related-questions mt-6 pt-6 border-t border-slate-600">
          <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
            <i className="fas fa-question-circle mr-2"></i>
            People Also Ask:
          </h4>
          <div className="grid gap-3">
            {relatedQuestions.map((rq, index) => (
              <details key={index} className="bg-slate-700/30 rounded-lg p-4 group cursor-pointer">
                <summary className="text-slate-200 font-medium flex items-center justify-between list-none">
                  <span>{rq.question}</span>
                  <i className="fas fa-chevron-down text-slate-400 group-open:rotate-180 transition-transform duration-200"></i>
                </summary>
                <div className="mt-3 text-slate-300 text-sm leading-relaxed">
                  <p>{rq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Context for AI Understanding */}
      {context && (
        <div className="context-info mt-4 text-xs text-slate-400 bg-slate-800/30 rounded-lg p-3">
          <strong>Context:</strong> {context}
        </div>
      )}
    </div>
  );
}