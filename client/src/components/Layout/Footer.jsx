import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: 'Tool Categories',
      links: [
        { name: 'PDF Tools', href: '/pdf' },
        { name: 'Image Tools', href: '/image' },
        { name: 'Audio Tools', href: '/audio' },
        { name: 'Text Tools', href: '/text' },
        { name: 'Productivity', href: '/productivity' },
        { name: 'Finance Tools', href: '/finance' }
      ]
    },
    {
      title: 'Popular Tools',
      links: [
        { name: 'PDF Merger', href: '/pdf/merge' },
        { name: 'Background Remover', href: '/image/remove-background' },
        { name: 'Word Counter', href: '/text/word-counter' },
        { name: 'EMI Calculator', href: '/finance/emi-calculator' },
        { name: 'Audio Converter', href: '/audio/convert' },
        { name: 'Image Resizer', href: '/image/resize' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Getting Started', href: '/getting-started' },
        { name: 'API Documentation', href: '/api-docs' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Changelog', href: '/changelog' },
        { name: 'Status Page', href: '/status' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/legal/privacy' },
        { name: 'Terms of Service', href: '/legal/terms' },
        { name: 'Cookie Policy', href: '/legal/cookies' },
        { name: 'Disclaimer', href: '/legal/disclaimer' },
        { name: 'Contact', href: '/contact' },
        { name: 'About Us', href: '/about' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: 'fab fa-github', href: 'https://github.com/toolsuniverse' },
    { name: 'Twitter', icon: 'fab fa-twitter', href: 'https://twitter.com/toolsuniverse' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', href: 'https://linkedin.com/company/toolsuniverse' },
    { name: 'Discord', icon: 'fab fa-discord', href: 'https://discord.gg/toolsuniverse' }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-tools text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold gradient-text">ToolsUniverse</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm">
              The ultimate collection of professional online tools for PDF, Image, Audio, Text, and Finance operations. 
              Privacy-first, lightning-fast, and forever free.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glassmorphism-dark rounded-lg flex items-center justify-center hover:bg-slate-700/50 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-slate-400 hover:text-cyan-400 transition-colors`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-slate-100 font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © {currentYear} ToolsUniverse. All rights reserved. Made with ❤️ for productivity.
            </div>
            <div className="text-slate-400 text-sm flex items-center space-x-4">
              <span>Last updated: January 2024</span>
              <span className="hidden md:inline">•</span>
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
