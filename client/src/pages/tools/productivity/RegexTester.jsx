import React, { useState, useEffect } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const testRegex = () => {
    setError('');
    setResults(null);

    if (!pattern) {
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      
      if (!testString) {
        setResults({ regex: regex.toString(), isValid: true });
        return;
      }

      const matches = [];
      let match;

      if (flags.includes('g')) {
        // Global flag - find all matches
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
          
          // Prevent infinite loop
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Non-global - find first match
        match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
        }
      }

      // Test if the entire string matches
      const testResult = regex.test(testString);
      
      // String replacement example
      const replacement = testString.replace(regex, '[$&]');

      setResults({
        regex: regex.toString(),
        isValid: true,
        matches,
        matchCount: matches.length,
        testResult,
        replacement,
        split: testString.split(regex)
      });

    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  const highlightMatches = () => {
    if (!results || !results.matches || results.matches.length === 0) {
      return testString;
    }

    let highlighted = testString;
    let offset = 0;

    results.matches.forEach((match, index) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const before = highlighted.slice(0, start);
      const matchText = highlighted.slice(start, end);
      const after = highlighted.slice(end);
      
      highlighted = before + `<mark class="bg-yellow-200 dark:bg-yellow-800">${matchText}</mark>` + after;
      offset += '<mark class="bg-yellow-200 dark:bg-yellow-800"></mark>'.length;
    });

    return highlighted;
  };

  const commonPatterns = [
    { name: 'Email', pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', flags: 'g' },
    { name: 'URL', pattern: 'https?:\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?', flags: 'g' },
    { name: 'Phone (US)', pattern: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})', flags: 'g' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}\\b', flags: 'g' },
    { name: 'IPv4 Address', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b', flags: 'g' },
    { name: 'HTML Tags', pattern: '<[^>]+>', flags: 'g' },
    { name: 'Whitespace', pattern: '\\s+', flags: 'g' },
    { name: 'Numbers', pattern: '\\d+', flags: 'g' }
  ];

  const loadPattern = (presetPattern, presetFlags) => {
    setPattern(presetPattern);
    setFlags(presetFlags);
  };

  return (
    <ToolShell
      title="Regex Tester"
      description="Test and validate regular expressions with real-time matching and detailed results"
      category="Productivity Tools"
      features={[
        "Real-time regex testing and validation",
        "Visual match highlighting",
        "Common pattern presets",
        "Detailed match information with groups"
      ]}
      faqs={[
        {
          question: "What regex flags are supported?",
          answer: "All standard JavaScript regex flags: g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode), and y (sticky)."
        },
        {
          question: "How do I test capture groups?",
          answer: "Use parentheses in your pattern to create capture groups. The results will show both the full match and individual group captures."
        },
        {
          question: "Can I use named capture groups?",
          answer: "Yes, use the syntax (?<name>pattern) to create named groups. Named captures will be displayed separately in the results."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Regular Expression Tester</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2">Regular Expression Pattern</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter your regex pattern..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Flags</label>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="g, i, m..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Test String</label>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against your regex..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Common Patterns</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {commonPatterns.map((preset, index) => (
              <button
                key={index}
                onClick={() => loadPattern(preset.pattern, preset.flags)}
                className="text-left p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 transition duration-200"
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                  /{preset.pattern}/{preset.flags}
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Regex Error</h4>
            <p className="text-red-700 dark:text-red-300 font-mono text-sm">{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Results</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.matchCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Matches Found</div>
                </div>
                
                <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.isValid ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Valid Regex</div>
                </div>
                
                <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {results.regex}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Compiled Regex</div>
                </div>
              </div>

              {testString && (
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Highlighted Matches</h5>
                  <div 
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm border"
                    dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                  />
                </div>
              )}

              {results.matches && results.matches.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Match Details</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {results.matches.map((match, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Match:</span>
                            <span className="ml-2 font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                              {match.match}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Position:</span>
                            <span className="ml-2 font-mono">{match.index}</span>
                          </div>
                          <div>
                            <span className="font-medium">Length:</span>
                            <span className="ml-2 font-mono">{match.match.length}</span>
                          </div>
                        </div>
                        
                        {match.groups.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">Groups:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.groups.map((group, groupIndex) => (
                                <span
                                  key={groupIndex}
                                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono"
                                >
                                  {groupIndex + 1}: {group || '(empty)'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {Object.keys(match.namedGroups).length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">Named Groups:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(match.namedGroups).map(([name, value]) => (
                                <span
                                  key={name}
                                  className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded font-mono"
                                >
                                  {name}: {value || '(empty)'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.replacement && results.replacement !== testString && (
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Replacement Example (with [$&])</h5>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm border">
                    {results.replacement}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Quick Reference</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <strong>Character Classes:</strong>
              <br />. (any), \d (digit), \w (word), \s (space)
            </div>
            <div>
              <strong>Quantifiers:</strong>
              <br />* (0+), + (1+), ? (0-1), {'{n}'} (exactly n)
            </div>
            <div>
              <strong>Anchors:</strong>
              <br />^ (start), $ (end), \b (word boundary)
            </div>
            <div>
              <strong>Flags:</strong>
              <br />g (global), i (ignore case), m (multiline)
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default RegexTester;