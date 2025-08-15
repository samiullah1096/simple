import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function PasswordGenerator() {
  const tool = TOOLS.text.find(t => t.slug === 'password-generator');
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [strength, setStrength] = useState(null);
  const [multiple, setMultiple] = useState(false);
  const [passwordCount, setPasswordCount] = useState(5);
  const [passwords, setPasswords] = useState([]);

  const charSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  const getCharacterSet = () => {
    let charset = '';
    if (options.lowercase) charset += charSets.lowercase;
    if (options.uppercase) charset += charSets.uppercase;
    if (options.numbers) charset += charSets.numbers;
    if (options.symbols) charset += charSets.symbols;
    
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !charSets.similar.includes(char)).join('');
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !charSets.ambiguous.includes(char)).join('');
    }
    
    return charset;
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (pwd.length >= 8) score += 2;
    else feedback.push('Use at least 8 characters');
    
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push('Include uppercase letters');
    
    if (/\d/.test(pwd)) score += 1;
    else feedback.push('Include numbers');
    
    if (/[^A-Za-z0-9]/.test(pwd)) score += 2;
    else feedback.push('Include special characters');
    
    // Bonus points
    if (pwd.length >= 20) score += 1;
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(pwd)) score += 1;
    
    let level = 'Very Weak';
    let color = 'text-red-400';
    let bgColor = 'bg-red-500';
    let width = '20%';
    
    if (score >= 8) {
      level = 'Very Strong';
      color = 'text-green-400';
      bgColor = 'bg-green-500';
      width = '100%';
    } else if (score >= 6) {
      level = 'Strong';
      color = 'text-lime-400';
      bgColor = 'bg-lime-500';
      width = '80%';
    } else if (score >= 4) {
      level = 'Medium';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-500';
      width = '60%';
    } else if (score >= 2) {
      level = 'Weak';
      color = 'text-orange-400';
      bgColor = 'bg-orange-500';
      width = '40%';
    }
    
    return { level, color, bgColor, width, score, feedback };
  };

  const generatePassword = () => {
    const charset = getCharacterSet();
    if (!charset) return '';
    
    let result = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += charset.charAt(array[i] % charset.length);
    }
    
    return result;
  };

  const handleGenerate = () => {
    if (multiple) {
      const newPasswords = [];
      for (let i = 0; i < passwordCount; i++) {
        newPasswords.push(generatePassword());
      }
      setPasswords(newPasswords);
      setPassword('');
      setStrength(null);
    } else {
      const newPassword = generatePassword();
      setPassword(newPassword);
      setStrength(calculateStrength(newPassword));
      setPasswords([]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleOptionChange = (option) => {
    const newOptions = { ...options, [option]: !options[option] };
    
    // Ensure at least one character type is selected
    const hasCharacterType = newOptions.lowercase || newOptions.uppercase || 
                            newOptions.numbers || newOptions.symbols;
    if (!hasCharacterType) return;
    
    setOptions(newOptions);
  };

  const toolContent = (
    <div className="space-y-6">
      {/* Password Options */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Password Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full mb-2"
              data-testid="slider-length"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>4</span>
              <span>50</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { key: 'uppercase', label: 'Uppercase Letters (A-Z)' },
              { key: 'lowercase', label: 'Lowercase Letters (a-z)' },
              { key: 'numbers', label: 'Numbers (0-9)' },
              { key: 'symbols', label: 'Symbols (!@#$%^&*)' }
            ].map((option) => (
              <label key={option.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={options[option.key]}
                  onChange={() => handleOptionChange(option.key)}
                  className="mr-2"
                  data-testid={`checkbox-${option.key}`}
                />
                <span className="text-slate-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="font-medium text-slate-300 mb-2">Advanced Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={() => handleOptionChange('excludeSimilar')}
                className="mr-2"
                data-testid="checkbox-exclude-similar"
              />
              <span className="text-slate-300">Exclude similar characters (i, l, 1, L, o, 0, O)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={() => handleOptionChange('excludeAmbiguous')}
                className="mr-2"
                data-testid="checkbox-exclude-ambiguous"
              />
              <span className="text-slate-300">Exclude ambiguous characters</span>
            </label>
          </div>
        </div>
      </div>

      {/* Multiple Passwords Option */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-200">Generation Mode</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={multiple}
              onChange={(e) => setMultiple(e.target.checked)}
              className="mr-2"
              data-testid="checkbox-multiple"
            />
            <span className="text-slate-300">Generate multiple passwords</span>
          </label>
        </div>
        
        {multiple && (
          <div className="flex items-center gap-4">
            <label className="text-slate-300">Count:</label>
            <input
              type="number"
              value={passwordCount}
              onChange={(e) => setPasswordCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              min="1"
              max="20"
              className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100"
              data-testid="input-count"
            />
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleGenerate}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="button-generate"
        >
          <i className="fas fa-key mr-2"></i>Generate {multiple ? 'Passwords' : 'Password'}
        </motion.button>
      </div>

      {/* Single Password Result */}
      {password && !multiple && (
        <div className="space-y-4">
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-200">Generated Password</h3>
              <button 
                onClick={() => copyToClipboard(password)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                data-testid="button-copy"
              >
                <i className="fas fa-copy mr-2"></i>Copy
              </button>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 font-mono text-lg text-slate-100 break-all" data-testid="password-result">
              {password}
            </div>
            
            {strength && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Password Strength:</span>
                  <span className={`font-medium ${strength.color}`}>{strength.level}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${strength.bgColor}`}
                    style={{ width: strength.width }}
                  ></div>
                </div>
                {strength.feedback.length > 0 && (
                  <div className="text-sm text-slate-400">
                    Suggestions: {strength.feedback.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multiple Passwords Result */}
      {passwords.length > 0 && multiple && (
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-200">Generated Passwords</h3>
            <button 
              onClick={() => copyToClipboard(passwords.join('\n'))}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              data-testid="button-copy-all"
            >
              <i className="fas fa-copy mr-2"></i>Copy All
            </button>
          </div>
          <div className="space-y-2">
            {passwords.map((pwd, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-3">
                <span className="font-mono text-slate-100 break-all flex-1" data-testid={`password-${index}`}>{pwd}</span>
                <button 
                  onClick={() => copyToClipboard(pwd)}
                  className="ml-4 text-slate-400 hover:text-slate-200 text-sm"
                  data-testid={`button-copy-${index}`}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password Tips */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Password Security Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-cyan-400 mb-2">✅ Do:</h4>
            <ul className="space-y-1">
              <li>• Use at least 12 characters</li>
              <li>• Include mixed character types</li>
              <li>• Use unique passwords for each account</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-400 mb-2">❌ Don't:</h4>
            <ul className="space-y-1">
              <li>• Use personal information</li>
              <li>• Reuse passwords across sites</li>
              <li>• Share passwords with others</li>
              <li>• Use dictionary words</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      faqs={[
        {
          question: 'How secure are the generated passwords?',
          answer: 'Our passwords are generated using cryptographically secure random number generation (crypto.getRandomValues()). The strength depends on length and character variety - longer passwords with mixed character types are more secure.'
        },
        {
          question: 'Should I exclude similar characters?',
          answer: 'Excluding similar characters like "i, l, 1, L, o, 0, O" can help avoid confusion when typing passwords manually, but it slightly reduces the character set. Use this option if you plan to type the password frequently.'
        },
        {
          question: 'What makes a password strong?',
          answer: 'Strong passwords are long (12+ characters), use multiple character types (uppercase, lowercase, numbers, symbols), and are unique for each account. Avoid dictionary words, personal information, and predictable patterns.'
        }
      ]}
      howToSteps={[
        'Set your desired password length using the slider',
        'Choose character types to include (uppercase, lowercase, numbers, symbols)',
        'Configure advanced options if needed',
        'Choose single or multiple password generation',
        'Click Generate to create secure passwords'
      ]}
      benefits={[
        'Cryptographically secure random generation',
        'Customizable length and character sets',
        'Real-time password strength analysis',
        'Multiple password generation option'
      ]}
      useCases={[
        'Creating secure login passwords',
        'Generating API keys and tokens',
        'Setting up two-factor authentication backup codes',
        'Creating temporary passwords for sharing'
      ]}
    >
      {toolContent}
    </ToolShell>
  );
}