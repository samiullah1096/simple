import { useState, useCallback } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function CaseConverter() {
  const tool = TOOLS.text.find(t => t.slug === 'case-converter');
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState({});
  const { toast } = useToast();

  const convertCases = useCallback((text) => {
    if (!text.trim()) {
      setResults({});
      return;
    }

    const conversions = {
      uppercase: text.toUpperCase(),
      lowercase: text.toLowerCase(),
      titleCase: text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentenceCase: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      camelCase: text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, ''),
      pascalCase: text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, ''),
      snakeCase: text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w_]/g, ''),
      kebabCase: text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, ''),
      constantCase: text
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w_]/g, ''),
      dotCase: text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^\w.]/g, ''),
      pathCase: text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '/')
        .replace(/[^\w/]/g, ''),
      alternatingCase: text
        .split('')
        .map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join(''),
      inverseCase: text
        .split('')
        .map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join(''),
      capitalizeWords: text.replace(/\b\w/g, char => char.toUpperCase())
    };

    setResults(conversions);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    convertCases(text);
  };

  const copyToClipboard = async (text, caseName) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${caseName} copied to clipboard`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const clearAll = () => {
    setInputText('');
    setResults({});
  };

  const caseOptions = [
    {
      key: 'uppercase',
      name: 'UPPERCASE',
      description: 'All letters in uppercase',
      icon: 'fas fa-arrow-up'
    },
    {
      key: 'lowercase',
      name: 'lowercase',
      description: 'All letters in lowercase',
      icon: 'fas fa-arrow-down'
    },
    {
      key: 'titleCase',
      name: 'Title Case',
      description: 'First letter of each word capitalized',
      icon: 'fas fa-heading'
    },
    {
      key: 'sentenceCase',
      name: 'Sentence case',
      description: 'First letter capitalized',
      icon: 'fas fa-font'
    },
    {
      key: 'camelCase',
      name: 'camelCase',
      description: 'Words joined, first lowercase, rest capitalized',
      icon: 'fas fa-code'
    },
    {
      key: 'pascalCase',
      name: 'PascalCase',
      description: 'Words joined, all first letters capitalized',
      icon: 'fas fa-code'
    },
    {
      key: 'snakeCase',
      name: 'snake_case',
      description: 'Words separated by underscores, lowercase',
      icon: 'fas fa-minus'
    },
    {
      key: 'kebabCase',
      name: 'kebab-case',
      description: 'Words separated by hyphens, lowercase',
      icon: 'fas fa-minus'
    },
    {
      key: 'constantCase',
      name: 'CONSTANT_CASE',
      description: 'Words separated by underscores, uppercase',
      icon: 'fas fa-minus'
    },
    {
      key: 'dotCase',
      name: 'dot.case',
      description: 'Words separated by dots, lowercase',
      icon: 'fas fa-circle'
    },
    {
      key: 'pathCase',
      name: 'path/case',
      description: 'Words separated by forward slashes',
      icon: 'fas fa-slash-forward'
    },
    {
      key: 'alternatingCase',
      name: 'aLtErNaTiNg CaSe',
      description: 'Alternating uppercase and lowercase letters',
      icon: 'fas fa-exchange-alt'
    },
    {
      key: 'inverseCase',
      name: 'iNVERSE cASE',
      description: 'Inverts the case of each letter',
      icon: 'fas fa-sync-alt'
    },
    {
      key: 'capitalizeWords',
      name: 'Capitalize Words',
      description: 'First letter of each word capitalized, rest unchanged',
      icon: 'fas fa-text-width'
    }
  ];

  const faqs = [
    {
      question: 'What text case formats are supported?',
      answer: 'Our case converter supports 14 different formats including camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, UPPERCASE, lowercase, Sentence case, and more specialized formats.'
    },
    {
      question: 'How does camelCase differ from PascalCase?',
      answer: 'camelCase starts with a lowercase letter (firstName), while PascalCase starts with an uppercase letter (FirstName). Both join words without spaces and capitalize subsequent words.'
    },
    {
      question: 'When should I use snake_case vs kebab-case?',
      answer: 'snake_case uses underscores and is common in Python, databases, and file names. kebab-case uses hyphens and is popular in URLs, CSS classes, and HTML attributes.'
    },
    {
      question: 'What is CONSTANT_CASE used for?',
      answer: 'CONSTANT_CASE (all uppercase with underscores) is used for constants in programming, environment variables, and configuration settings. It follows naming conventions in many programming languages.'
    },
    {
      question: 'Can I convert multiple lines of text at once?',
      answer: 'Yes, the converter handles multi-line text and applies the selected case transformation to the entire input while preserving line breaks and structure.'
    }
  ];

  const howToSteps = [
    { title: 'Enter Text', description: 'Type or paste your text into the input area' },
    { title: 'View Conversions', description: 'See your text automatically converted to 14 different case formats' },
    { title: 'Copy Results', description: 'Click the copy button next to any format to copy it to clipboard' },
    { title: 'Use in Projects', description: 'Apply the converted text in your code, documents, or websites' }
  ];

  const benefits = [
    'Convert between 14 different text case formats',
    'Real-time conversion as you type',
    'One-click copy to clipboard functionality',
    'Support for programming naming conventions',
    'Handle multi-line text and special characters',
    'Perfect for developers and content creators'
  ];

  const useCases = [
    'Convert variable names for different programming languages',
    'Format text for URLs and file names',
    'Create consistent naming in databases',
    'Standardize text for documentation',
    'Prepare content for different platforms',
    'Convert between writing and coding styles'
  ];

  return (
    <ToolShell 
      tool={tool} 
      faqs={faqs}
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-6">
          <i className="fas fa-text-height text-2xl text-blue-400"></i>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Case Converter
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Convert text between different cases including camelCase, snake_case, kebab-case, and more.
        </p>
      </div>

      {/* Input Section */}
      <Card className="glassmorphism">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="input-text" className="text-base font-medium">
              Enter Your Text
            </Label>
            {inputText && (
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="text-slate-500 hover:text-slate-700"
              >
                <i className="fas fa-times mr-2" />
                Clear
              </Button>
            )}
          </div>
          <Textarea
            id="input-text"
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={handleInputChange}
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Results Section */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Converted Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseOptions.map((option) => {
              const convertedText = results[option.key];
              if (!convertedText) return null;

              return (
                <Card key={option.key} className="glassmorphism hover:scale-105 transition-transform duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <i className={`${option.icon} text-blue-600 dark:text-blue-400 text-sm`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{option.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(convertedText, option.name)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <i className="fas fa-copy text-slate-500 hover:text-blue-500" />
                      </Button>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border">
                      <p className="text-sm font-mono break-all">
                        {convertedText}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!inputText && (
        <Card className="glassmorphism">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-keyboard text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ready to Convert</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Enter some text above to see it converted into different cases.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-bolt text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold">Instant Conversion</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            All conversions happen in real-time as you type.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-copy text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold">One-Click Copy</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Copy any converted text to clipboard with a single click.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-list text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold">14 Case Types</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Supports all common programming and writing case formats.
          </p>
        </div>
      </div>
      </div>
    </ToolShell>
  );
}