import { useEffect } from 'react';

/**
 * Featured Snippet Optimization component for AEO
 * Targets Google's featured snippets and answer boxes
 */
export default function FeaturedSnippetOptimizer({ 
  targetQuery, 
  directAnswer, 
  listItems = [], 
  steps = [], 
  tableData = null,
  entity = '',
  category = 'general' 
}) {
  useEffect(() => {
    // Enhanced structured data for featured snippets
    const snippetSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${targetQuery} - Complete Answer`,
      description: directAnswer,
      mainEntity: {
        '@type': 'Thing',
        name: entity || targetQuery,
        description: directAnswer,
        category: category
      },
      // Enhanced for answer boxes
      about: {
        '@type': 'Thing',
        name: entity || 'Online Tools',
        description: `Comprehensive information about ${entity.toLowerCase() || 'online tools'}`
      },
      // Speakable content for voice results
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.featured-answer', '.direct-answer', '.snippet-content'],
        xpath: '/html/body//*[@class=\"featured-answer\"]'
      }
    };

    // Add How-to schema for step-based snippets
    if (steps.length > 0) {
      snippetSchema['@type'] = 'HowTo';
      snippetSchema.name = targetQuery;
      snippetSchema.description = directAnswer;
      snippetSchema.step = steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: `Step ${index + 1}`,
        text: step.description || step,
        image: step.image || undefined
      }));
      snippetSchema.totalTime = `PT${Math.max(steps.length * 2, 5)}M`;
      snippetSchema.supply = [{
        '@type': 'HowToSupply',
        name: 'Web Browser'
      }];
    }

    // Add list schema for list-based snippets
    if (listItems.length > 0) {
      snippetSchema.mainEntity = {
        '@type': 'ItemList',
        name: targetQuery,
        description: directAnswer,
        numberOfItems: listItems.length,
        itemListElement: listItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name || item,
          description: item.description || undefined,
          url: item.url || window.location.href
        }))
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(snippetSchema);
    script.id = 'featured-snippet-schema';
    
    // Remove existing script
    const existing = document.getElementById(script.id);
    if (existing) existing.remove();
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [targetQuery, directAnswer, listItems, steps, tableData, entity, category]);

  return (
    <div className="featured-snippet-optimizer">
      {/* Direct answer for featured snippets */}
      <div className="featured-answer direct-answer snippet-content">
        <div className="answer-text" itemProp="text">
          {directAnswer}
        </div>
      </div>

      {/* List format for list snippets */}
      {listItems.length > 0 && (
        <div className="snippet-list" itemScope itemType="https://schema.org/ItemList">
          <meta itemProp="name" content={targetQuery} />
          <meta itemProp="numberOfItems" content={listItems.length} />
          <ol className="featured-list">
            {listItems.map((item, index) => (
              <li key={index} itemScope itemProp="itemListElement" itemType="https://schema.org/ListItem">
                <meta itemProp="position" content={index + 1} />
                <span itemProp="name">{item.name || item}</span>
                {item.description && (
                  <span className="item-description" itemProp="description">
                    {item.description}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Step format for how-to snippets */}
      {steps.length > 0 && (
        <div className="snippet-steps" itemScope itemType="https://schema.org/HowTo">
          <meta itemProp="name" content={targetQuery} />
          <meta itemProp="description" content={directAnswer} />
          <ol className="featured-steps">
            {steps.map((step, index) => (
              <li key={index} itemScope itemProp="step" itemType="https://schema.org/HowToStep">
                <meta itemProp="position" content={index + 1} />
                <span className="step-number">Step {index + 1}:</span>
                <span itemProp="text">{step.description || step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Table format for table snippets */}
      {tableData && (
        <div className="snippet-table">
          <table className="featured-table">
            <thead>
              <tr>
                {tableData.headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hidden structured data for search engines */}
      <div className="sr-only" itemScope itemType="https://schema.org/WebPage">
        <meta itemProp="name" content={targetQuery} />
        <meta itemProp="description" content={directAnswer} />
        <meta itemProp="keywords" content={`${targetQuery}, ${entity}, ${category}`} />
        <div itemProp="mainEntity" itemScope itemType="https://schema.org/Thing">
          <meta itemProp="name" content={entity || targetQuery} />
          <meta itemProp="description" content={directAnswer} />
        </div>
      </div>
    </div>
  );
}