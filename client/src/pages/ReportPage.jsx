import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Meta from '../components/SEO/Meta';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: 'bug',
    tool: '',
    description: '',
    steps: '',
    browser: '',
    os: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <>
        <Meta 
          title="Issue Reported | ToolsUniverse"
          description="Thank you for reporting the issue. We'll investigate and fix it soon."
          canonical="/report"
        />

        <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-950/50 to-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check-circle text-green-400 text-3xl"></i>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Thank You!
              </h1>
              
              <p className="text-slate-300 text-lg mb-8">
                Your issue report has been submitted successfully. Our team will investigate and work on a fix as soon as possible.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Back to Home
                </Link>
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      issueType: 'bug',
                      tool: '',
                      description: '',
                      steps: '',
                      browser: '',
                      os: ''
                    });
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
                >
                  Report Another Issue
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta 
        title="Report Issue | ToolsUniverse"
        description="Report bugs or issues with ToolsUniverse tools. Help us improve by providing detailed information about problems you encounter."
        canonical="/report"
      />

      <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-950/50 to-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glassmorphism rounded-3xl p-8 md:p-12"
          >
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li className="flex items-center">
                  <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-chevron-right text-slate-500 text-sm mr-4"></i>
                  <span className="text-slate-400 text-sm">Report Issue</span>
                </li>
              </ol>
            </nav>
            
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Report an Issue
              </h1>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Found a bug or experiencing problems? Help us improve ToolsUniverse by providing detailed information about the issue.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Issue Type
                  </label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  >
                    <option value="bug">Bug Report</option>
                    <option value="performance">Performance Issue</option>
                    <option value="compatibility">Browser Compatibility</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tool Affected
                  </label>
                  <input
                    type="text"
                    name="tool"
                    value={formData.tool}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="e.g., PDF Merger, Image Converter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Issue Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                  placeholder="Describe the issue you're experiencing in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Steps to Reproduce
                </label>
                <textarea
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                  placeholder="1. Go to... &#10;2. Click on... &#10;3. See error..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Browser
                  </label>
                  <input
                    type="text"
                    name="browser"
                    value={formData.browser}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="e.g., Chrome 120, Firefox 115"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Operating System
                  </label>
                  <input
                    type="text"
                    name="os"
                    value={formData.os}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="e.g., Windows 11, macOS 14, Ubuntu 22.04"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-bug mr-2"></i>
                  Submit Issue Report
                </button>
                
                <Link 
                  href="/contact"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors text-center"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Contact Support Instead
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}