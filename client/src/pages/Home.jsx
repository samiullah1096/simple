import { motion } from 'framer-motion';
import { Link } from 'wouter';
import AdSlot from '../components/Ads/AdSlot';
import ToolCard from '../components/Tools/ToolCard';
import { getFeaturedTools, CATEGORIES } from '../lib/toolsIndex';
import Meta from '../components/SEO/Meta';
import JsonLd from '../components/SEO/JsonLd';

export default function Home() {
  const featuredTools = getFeaturedTools();

  const stats = [
    { number: '60+', label: 'Tools Available', icon: 'fas fa-tools' },
    { number: '1M+', label: 'Files Processed', icon: 'fas fa-file' },
    { number: '100%', label: 'Privacy Protected', icon: 'fas fa-shield-alt' },
    { number: '24/7', label: 'Available', icon: 'fas fa-clock' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      content: 'ToolsUniverse has revolutionized my workflow. The PDF tools alone save me hours every week. Fast, reliable, and completely secure.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b13c?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Designer',
      content: 'As a freelance designer, I need reliable tools that work anywhere. These image and PDF tools are exactly what I needed - professional quality, no installation required.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Financial Advisor',
      content: 'The financial calculators are incredibly accurate and easy to use. I use the EMI calculator regularly for client consultations. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const faqs = [
    {
      question: 'Are my files stored on your servers?',
      answer: 'No, absolutely not. All file processing happens directly in your web browser using client-side JavaScript. Your files never leave your device, never touch our servers, and are never transmitted over the internet.'
    },
    {
      question: 'Do I need to create an account to use the tools?',
      answer: 'No registration is required. All 60+ tools are available immediately without creating an account, providing email addresses, or any form of sign-up process.'
    },
    {
      question: 'Is there a limit on file sizes or usage?',
      answer: 'File size limits are determined by your device\'s available memory since processing happens locally. For optimal performance, we recommend files under 100MB for most tools.'
    },
    {
      question: 'Do the tools work offline?',
      answer: 'Yes! Once a tool page is loaded, most functions work completely offline. This is possible because all processing happens in your browser using Web APIs and JavaScript libraries.'
    }
  ];

  return (
    <>
      <Meta 
        title="ToolsUniverse - All-in-One Online Tools | Fast, Free, Secure"
        description="60+ professional online tools for PDF, Image, Audio, Text, and Finance. Fully client-side processing, privacy-focused, and production-ready. Free forever."
        keywords="online tools, PDF tools, image converter, audio editor, text tools, finance calculator, free tools, productivity"
      />
      
      <JsonLd 
        type="WebSite"
        data={{
          name: "ToolsUniverse",
          url: window.location.origin,
          description: "Professional online tools for PDF, Image, Audio, Text, and Finance operations",
          potentialAction: {
            "@type": "SearchAction",
            target: `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }}
      />

      <div className="pt-16">
        {/* Top Ad Slot */}
        <AdSlot id="home-top" position="top" pageType="general" />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32 hero-gradient">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6">
                <span className="gradient-text">Universe Tools</span><br />
                <span className="text-slate-100 dark:text-slate-100">All-in-One Platform</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-300 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                60+ professional online tools for PDF, Image, Audio, Text, and Productivity tasks. 
                <span className="text-cyan-400 font-semibold"> 100% client-side processing</span> - your data never leaves your device.
              </p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              >
                <Link href="#categories">
                  <button className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 animate-pulse-glow">
                    <i className="fas fa-rocket mr-2"></i>
                    Explore All Tools
                  </button>
                </Link>
                <button className="glassmorphism hover:bg-slate-700/50 text-slate-100 dark:text-slate-100 font-semibold px-8 py-4 rounded-2xl transform transition-all duration-300 hover:scale-105 border-slate-600 dark:border-slate-600">
                  <i className="fas fa-play mr-2"></i>
                  Watch Demo
                </button>
              </motion.div>

              {/* Hero Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{stat.number}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Tool Categories Grid */}
        <section id="categories" className="py-20 bg-gradient-to-b from-slate-950/50 to-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Tool Categories</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Discover our comprehensive collection of professional-grade online tools, 
                each category containing 10-15 specialized utilities for your workflow.
              </p>
            </motion.div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(CATEGORIES).map(([key, category], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/${key}`}>
                    <div className="tool-card glassmorphism rounded-2xl p-8 group cursor-pointer h-full">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <i className={`${category.icon} text-2xl text-white`}></i>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-slate-400 mb-6 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                        <span className="font-semibold">Explore {category.name}</span>
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Inline Ad Slot */}
        <AdSlot id="home-mid" position="inline" pageType="general" />

        {/* Featured Tools Showcase */}
        <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Trending Tools</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Most popular tools used by professionals worldwide. Each tool is optimized for speed, accuracy, and ease of use.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool, index) => (
                <motion.div
                  key={`${tool.category.toLowerCase().replace(' tools', '')}-${tool.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-slate-950/50 to-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Why Choose Universe Tools?</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Built with cutting-edge technology and user privacy in mind. Every tool is optimized for performance, security, and ease of use.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: 'fas fa-shield-alt',
                  title: '100% Privacy',
                  description: 'All processing happens in your browser. Your files and data never leave your device, ensuring complete privacy and security.',
                  color: 'from-cyan-400 to-cyan-600'
                },
                {
                  icon: 'fas fa-bolt',
                  title: 'Lightning Fast',
                  description: 'Optimized algorithms and client-side processing ensure instant results without waiting for server responses or uploads.',
                  color: 'from-purple-400 to-purple-600'
                },
                {
                  icon: 'fas fa-dollar-sign',
                  title: 'Forever Free',
                  description: 'All tools are completely free to use with no hidden fees, registration requirements, or usage limits.',
                  color: 'from-green-400 to-green-600'
                },
                {
                  icon: 'fas fa-mobile-alt',
                  title: 'Mobile Optimized',
                  description: 'Responsive design ensures all tools work perfectly on mobile devices, tablets, and desktops.',
                  color: 'from-yellow-400 to-orange-500'
                },
                {
                  icon: 'fas fa-user-shield',
                  title: 'No Registration',
                  description: 'Start using any tool immediately without creating accounts, providing personal information, or email verification.',
                  color: 'from-red-400 to-red-600'
                },
                {
                  icon: 'fas fa-code',
                  title: 'Open Source',
                  description: 'Built with transparency in mind. Source code is available for review, ensuring trust and continuous improvement.',
                  color: 'from-blue-400 to-blue-600'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glassmorphism rounded-2xl p-8 text-center group hover:bg-slate-700/30 transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${benefit.icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-100">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">What Users Say</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Trusted by professionals, students, and creators worldwide for their daily workflow optimization.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glassmorphism rounded-2xl p-8 hover:bg-slate-700/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-100">{testimonial.name}</h4>
                      <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-b from-slate-950/50 to-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Frequently Asked Questions</span>
              </h2>
              <p className="text-xl text-slate-400">
                Everything you need to know about Universe Tools and our privacy-first approach.
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glassmorphism p-6 rounded-2xl group"
                >
                  <summary className="font-semibold text-slate-100 cursor-pointer list-none flex items-center justify-between text-lg">
                    <span>{faq.question}</span>
                    <i className="fas fa-chevron-down text-slate-400 group-open:rotate-180 transition-transform duration-300"></i>
                  </summary>
                  <div className="mt-6 text-slate-400 leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Ad Slot */}
        <AdSlot id="home-bottom" position="bottom" pageType="general" />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glassmorphism rounded-3xl p-12"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Ready to Get Started?</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Join thousands of professionals who trust Universe Tools for their daily workflow. 
                Start using any of our 60+ tools right now - no registration required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#categories">
                  <button className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    <i className="fas fa-tools mr-2"></i>
                    Browse All Tools
                  </button>
                </Link>
                <Link href="/pdf">
                  <button className="glassmorphism hover:bg-slate-700/50 text-slate-100 font-semibold px-8 py-4 rounded-2xl transform transition-all duration-300 hover:scale-105">
                    <i className="fas fa-bookmark mr-2"></i>
                    View Categories
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* JSON-LD for FAQs */}
        <JsonLd 
          type="FAQPage"
          data={{
            mainEntity: faqs.map(faq => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          }}
        />
      </div>
    </>
  );
}
