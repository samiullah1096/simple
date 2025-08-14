import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const URLShortener = ({ tool }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState('');

  const generateShortCode = (length = 6) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidSlug = (slug) => {
    return /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length >= 3 && slug.length <= 20;
  };

  const shortenUrl = () => {
    if (!originalUrl.trim()) {
      alert('Please enter a URL to shorten');
      return;
    }

    // Add protocol if missing
    let url = originalUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (!validateUrl(url)) {
      alert('Please enter a valid URL');
      return;
    }

    if (customSlug && !isValidSlug(customSlug)) {
      alert('Custom slug must be 3-20 characters and contain only letters, numbers, hyphens, and underscores');
      return;
    }

    // Check if custom slug already exists
    if (customSlug && shortenedUrls.some(item => item.slug === customSlug)) {
      alert('This custom slug is already in use. Please choose a different one.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const slug = customSlug || generateShortCode();
      const baseDomain = useCustomDomain && customDomain ? customDomain : 'short.ly';
      const shortUrl = `https://${baseDomain}/${slug}`;

      const newEntry = {
        id: Date.now(),
        originalUrl: url,
        shortUrl,
        slug,
        domain: baseDomain,
        createdAt: new Date().toISOString(),
        clicks: Math.floor(Math.random() * 100), // Simulated click count
        qrCode: generateQRCodeData(shortUrl)
      };

      setShortenedUrls(prev => [newEntry, ...prev]);
      setOriginalUrl('');
      setCustomSlug('');
      setIsProcessing(false);
    }, 1000);
  };

  const generateQRCodeData = (url) => {
    // Simple QR code placeholder - in a real app you'd use a QR library
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="monospace" font-size="8">QR CODE</text>
      </svg>
    `)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Visual feedback could be added here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const deleteUrl = (id) => {
    setShortenedUrls(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setShortenedUrls([]);
    setOriginalUrl('');
    setCustomSlug('');
  };

  const exportData = () => {
    const exportData = {
      urls: shortenedUrls,
      exportedAt: new Date().toISOString(),
      totalUrls: shortenedUrls.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shortened-urls-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleUrls = () => {
    const samples = [
      { url: 'https://github.com/microsoft/vscode', slug: 'vscode' },
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', slug: '' },
      { url: 'https://stackoverflow.com/questions/tagged/javascript', slug: 'js-help' }
    ];

    samples.forEach((sample, index) => {
      setTimeout(() => {
        setOriginalUrl(sample.url);
        setCustomSlug(sample.slug);
        shortenUrl();
      }, index * 500);
    });
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* URL Input */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Shorten URL</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Original URL</label>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/path"
                className="w-full px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400"
                data-testid="input-original-url"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Custom Slug (optional)</label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase())}
                  placeholder="my-custom-link"
                  className="w-full px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400"
                  data-testid="input-custom-slug"
                />
                <p className="text-slate-400 text-xs mt-1">3-20 characters, letters, numbers, hyphens, underscores only</p>
              </div>

              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={useCustomDomain}
                    onChange={(e) => setUseCustomDomain(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                    data-testid="checkbox-custom-domain"
                  />
                  <span className="text-slate-300">Use Custom Domain</span>
                </label>
                {useCustomDomain && (
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="yourdomain.com"
                    className="w-full px-4 py-3 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-green-400"
                    data-testid="input-custom-domain"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={loadSampleUrls}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
                data-testid="button-load-samples"
              >
                <i className="fas fa-list mr-2"></i>
                Load Samples
              </button>
              
              <button
                onClick={shortenUrl}
                disabled={isProcessing || !originalUrl.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
                data-testid="button-shorten"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Shortening...
                  </>
                ) : (
                  <>
                    <i className="fas fa-compress-alt mr-2"></i>
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Shortened URLs List */}
        {shortenedUrls.length > 0 && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">
                Shortened URLs ({shortenedUrls.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={exportData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-export"
                >
                  <i className="fas fa-download mr-2"></i>
                  Export
                </button>
                <button
                  onClick={clearAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  data-testid="button-clear-all"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {shortenedUrls.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/50 rounded-lg p-4"
                  data-testid={`url-item-${item.id}`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        <div>
                          <div className="text-slate-400 text-xs">Original URL</div>
                          <div className="text-slate-100 text-sm break-all">
                            {item.originalUrl}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Short URL</div>
                          <div className="text-green-400 font-medium">
                            {item.shortUrl}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-slate-400 text-xs">Analytics</div>
                      <div className="text-slate-100">
                        <div className="text-lg font-semibold">{item.clicks}</div>
                        <div className="text-xs">clicks</div>
                      </div>
                      <div className="text-slate-400 text-xs mt-1">
                        Created: {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => copyToClipboard(item.shortUrl)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                        title="Copy short URL"
                        data-testid={`button-copy-${item.id}`}
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                      <button
                        onClick={() => window.open(item.originalUrl, '_blank')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                        title="Visit original URL"
                        data-testid={`button-visit-${item.id}`}
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                      <button
                        onClick={() => deleteUrl(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                        title="Delete"
                        data-testid={`button-delete-${item.id}`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Create custom short links with personalized slugs</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Support for custom domains</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Simulated click analytics and tracking</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Export your shortened URLs as JSON</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>One-click copy to clipboard</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Privacy-focused: all data stored locally</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
};

export default URLShortener;