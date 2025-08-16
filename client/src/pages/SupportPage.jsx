import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Meta from '../components/SEO/Meta';

const SUPPORT_CONTENT = {
  help: {
    title: 'Help Center',
    description: 'Find answers to common questions and get help with ToolsUniverse.',
    sections: [
      {
        title: 'Getting Started',
        icon: 'fas fa-play-circle',
        content: 'ToolsUniverse is designed to be intuitive and easy to use. Simply select a tool from any category, upload your file, and the processing happens instantly in your browser. No registration or software installation required.',
        links: [
          { text: 'View All Categories', href: '/#categories' },
          { text: 'Popular Tools', href: '/#popular-tools' }
        ]
      },
      {
        title: 'File Privacy & Security',
        icon: 'fas fa-shield-alt',
        content: 'Your files never leave your device. All processing happens locally in your browser using client-side JavaScript. We cannot access, store, or view any files you process through our tools.',
        links: [
          { text: 'Privacy Policy', href: '/legal/privacy' },
          { text: 'Security Features', href: '/about' }
        ]
      },
      {
        title: 'Supported File Formats',
        icon: 'fas fa-file-alt',
        content: 'We support a wide range of file formats including PDF, JPG, PNG, MP3, MP4, DOCX, TXT, and many more. Each tool displays supported formats before you upload.',
        links: [
          { text: 'PDF Tools', href: '/pdf' },
          { text: 'Image Tools', href: '/image' },
          { text: 'Audio Tools', href: '/audio' }
        ]
      },
      {
        title: 'Troubleshooting',
        icon: 'fas fa-wrench',
        content: 'If you experience issues, try refreshing the page, clearing browser cache, or using a different browser. Most tools work best in modern browsers like Chrome, Firefox, or Safari.',
        links: [
          { text: 'Report an Issue', href: '/contact' },
          { text: 'Browser Requirements', href: '/faq' }
        ]
      }
    ]
  },
  guide: {
    title: 'User Guide',
    description: 'Complete guide to using ToolsUniverse tools effectively.',
    sections: [
      {
        title: 'PDF Tools Guide',
        icon: 'fas fa-file-pdf',
        content: 'Learn how to merge, split, compress, and edit PDF files using our comprehensive PDF toolkit. All operations preserve quality and maintain document structure.',
        tools: ['PDF Merger', 'PDF Splitter', 'PDF Compressor', 'PDF Editor']
      },
      {
        title: 'Image Tools Guide',
        icon: 'fas fa-image',
        content: 'Master image editing with our AI-powered tools. Remove backgrounds, resize images, apply filters, and optimize for web use with professional results.',
        tools: ['Background Remover', 'Image Resizer', 'Image Compressor', 'Image Filters']
      },
      {
        title: 'Audio Tools Guide',
        icon: 'fas fa-music',
        content: 'Convert, edit, and enhance audio files with studio-quality results. Our tools support all major audio formats with real-time processing.',
        tools: ['Audio Converter', 'Audio Cutter', 'Volume Booster', 'Audio Joiner']
      },
      {
        title: 'Productivity Tools',
        icon: 'fas fa-calculator',
        content: 'Boost your productivity with calculators, converters, and utilities. From financial calculators to unit converters, we have tools for every need.',
        tools: ['EMI Calculator', 'Unit Converter', 'QR Generator', 'Password Generator']
      }
    ]
  },
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Quick answers to the most common questions about ToolsUniverse.',
    questions: [
      {
        q: 'Is ToolsUniverse really free?',
        a: 'Yes, all tools are completely free to use with no hidden costs, registration requirements, or usage limits.'
      },
      {
        q: 'Do I need to create an account?',
        a: 'No account creation is required. You can use all tools immediately without any registration or sign-up process.'
      },
      {
        q: 'What browsers are supported?',
        a: 'ToolsUniverse works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
      },
      {
        q: 'Are there file size limits?',
        a: 'File size limits depend on your browser and device memory. Most tools can handle files up to 100MB effectively. Larger files may take longer to process.'
      },
      {
        q: 'Can I use tools offline?',
        a: 'Once a tool page is loaded, it can work offline since all processing happens in your browser. However, you need an internet connection to initially load the tool.'
      },
      {
        q: 'How do I report bugs or request features?',
        a: 'You can contact us through our contact page or send feedback directly. We actively review all suggestions and bug reports.'
      }
    ]
  }
};

export default function SupportPage({ type = 'help' }) {
  const content = SUPPORT_CONTENT[type];
  
  if (!content) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-950/50 to-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
            <p className="text-slate-300 mb-8">The support page you're looking for doesn't exist.</p>
            <Link href="/" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-2xl font-semibold transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Support', href: '/help' },
    { name: content.title, href: `/${type}` }
  ];

  return (
    <>
      <Meta 
        title={`${content.title} | ToolsUniverse`}
        description={content.description}
        canonical={`/${type}`}
      />

      <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-950/50 to-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glassmorphism rounded-3xl p-8 md:p-12"
          >
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                {breadcrumbItems.map((item, index) => (
                  <li key={item.name} className="flex items-center">
                    {index > 0 && <i className="fas fa-chevron-right text-slate-500 text-sm mr-4"></i>}
                    {index === breadcrumbItems.length - 1 ? (
                      <span className="text-slate-400 text-sm">{item.name}</span>
                    ) : (
                      <Link href={item.href} className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {content.title}
              </h1>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                {content.description}
              </p>
            </header>

            {/* Help Center Content */}
            {type === 'help' && (
              <div className="grid md:grid-cols-2 gap-8">
                {content.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <i className={`${section.icon} text-white text-xl`}></i>
                      </div>
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                    </div>
                    <p className="text-slate-200 leading-relaxed mb-4">{section.content}</p>
                    {section.links && (
                      <div className="space-y-2">
                        {section.links.map((link, linkIndex) => (
                          <Link 
                            key={linkIndex}
                            href={link.href}
                            className="block text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                          >
                            → {link.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* User Guide Content */}
            {type === 'guide' && (
              <div className="space-y-8">
                {content.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <i className={`${section.icon} text-white text-xl`}></i>
                      </div>
                      <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                    </div>
                    <p className="text-slate-200 leading-relaxed mb-4">{section.content}</p>
                    {section.tools && (
                      <div className="flex flex-wrap gap-2">
                        {section.tools.map((tool, toolIndex) => (
                          <span 
                            key={toolIndex}
                            className="bg-slate-700/30 text-slate-300 text-sm px-3 py-1 rounded-md"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* FAQ Content */}
            {type === 'faq' && (
              <div className="space-y-6">
                {content.questions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50"
                  >
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <i className="fas fa-question-circle text-cyan-400 mr-3"></i>
                      {item.q}
                    </h3>
                    <p className="text-slate-200 leading-relaxed">{item.a}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Still need help?</h3>
              <p className="text-slate-300 mb-6">Can't find what you're looking for? We're here to help!</p>
              <Link 
                href="/contact"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl animated-button"
              >
                Contact Support
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}