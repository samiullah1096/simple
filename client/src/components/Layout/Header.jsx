import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useSearch } from '../../hooks/useSearch';

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const searchRef = useRef(null);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isLight = html.classList.contains('light');
    
    if (isLight) {
      html.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { 
      name: 'Tools', 
      href: '#',
      submenu: [
        { name: 'PDF Tools', href: '/pdf', icon: 'fas fa-file-pdf', color: 'text-red-400' },
        { name: 'Image Tools', href: '/image', icon: 'fas fa-image', color: 'text-green-400' },
        { name: 'Audio Tools', href: '/audio', icon: 'fas fa-music', color: 'text-purple-400' },
        { name: 'Text Tools', href: '/text', icon: 'fas fa-font', color: 'text-blue-400' },
        { name: 'Productivity', href: '/productivity', icon: 'fas fa-calculator', color: 'text-yellow-400' },
        { name: 'Finance', href: '/finance', icon: 'fas fa-chart-line', color: 'text-emerald-400' }
      ]
    },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-nav border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-tools text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold gradient-text">ToolsUniverse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <>
                    <button className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium flex items-center space-x-1">
                      <span>{item.name}</span>
                      <i className="fas fa-chevron-down text-xs"></i>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-64 glassmorphism-dark rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                      {item.submenu.map((subItem) => (
                        <Link 
                          key={subItem.name}
                          href={subItem.href} 
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 rounded-xl transition-colors"
                        >
                          <i className={`${subItem.icon} ${subItem.color}`}></i>
                          <span className="text-slate-300 hover:text-white">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link 
                    href={item.href} 
                    className={`transition-colors duration-200 font-medium ${
                      location === item.href 
                        ? 'text-cyan-400' 
                        : 'text-slate-300 hover:text-cyan-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Search & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-slate-300 hover:text-cyan-400 transition-colors duration-200 md:hidden"
                aria-label="Toggle search"
              >
                <i className="fas fa-search text-lg"></i>
              </button>
              
              <div className={`${isSearchOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full md:top-auto right-0 md:right-auto mt-2 md:mt-0 w-80 md:w-64`}>
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-600 rounded-xl px-4 py-2 pl-10 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                
                {/* Search Results */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glassmorphism-dark rounded-xl shadow-xl max-h-80 overflow-y-auto p-2">
                    {searchResults.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={tool.path}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <i className={`${tool.icon} ${tool.color} text-lg`}></i>
                        <div>
                          <div className="font-medium text-slate-100">{tool.name}</div>
                          <div className="text-xs text-slate-400">{tool.category}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="absolute top-full left-0 right-0 mt-2 glassmorphism-dark rounded-xl shadow-xl p-4 text-center">
                    <div className="text-slate-400">No tools found</div>
                  </div>
                )}
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-cyan-400 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <i className="fas fa-moon text-lg"></i>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glassmorphism-dark rounded-2xl m-4 p-4">
            <nav className="space-y-3">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <div className="font-medium text-slate-300 px-3 py-2">{item.name}</div>
                      <div className="ml-4 space-y-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <i className={`${subItem.icon} ${subItem.color}`}></i>
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
