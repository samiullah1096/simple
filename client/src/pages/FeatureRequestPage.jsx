import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Meta from '../components/SEO/Meta';

export default function FeatureRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    featureTitle: '',
    category: 'pdf',
    description: '',
    useCase: '',
    priority: 'medium'
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
          title="Feature Request Submitted | ToolsUniverse"
          description="Thank you for your feature request. We'll review it and consider it for future updates."
          canonical="/request"
        />

        <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-950/50 to-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-lightbulb text-blue-400 text-3xl"></i>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Thank You for Your Idea!
              </h1>
              
              <p className="text-slate-300 text-lg mb-8">
                Your feature request has been submitted successfully. Our development team will review it and consider it for future updates.
              </p>
              
              <div className="bg-slate-800/30 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 text-sm font-bold">1</span>
                    </div>
                    <span className="text-slate-300">We'll review your request within 7 days</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 text-sm font-bold">2</span>
                    </div>
                    <span className="text-slate-300">Evaluate feasibility and user demand</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 text-sm font-bold">3</span>
                    </div>
                    <span className="text-slate-300">Add to development roadmap if approved</span>
                  </div>
                </div>
              </div>
              
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
                      featureTitle: '',
                      category: 'pdf',
                      description: '',
                      useCase: '',
                      priority: 'medium'
                    });
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
                >
                  Submit Another Request
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
        title="Feature Request | ToolsUniverse"
        description="Request new features or tools for ToolsUniverse. Help us build the tools you need by sharing your ideas and suggestions."
        canonical="/request"
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
                  <span className="text-slate-400 text-sm">Feature Request</span>
                </li>
              </ol>
            </nav>
            
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Request a Feature
              </h1>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Have an idea for a new tool or feature? We'd love to hear from you! Your suggestions help us improve ToolsUniverse.
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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Feature Title
                </label>
                <input
                  type="text"
                  name="featureTitle"
                  value={formData.featureTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g., Advanced PDF Editor, AI Image Enhancer"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  >
                    <option value="pdf">PDF Tools</option>
                    <option value="image">Image Tools</option>
                    <option value="audio">Audio Tools</option>
                    <option value="text">Text Tools</option>
                    <option value="productivity">Productivity Tools</option>
                    <option value="finance">Finance Tools</option>
                    <option value="general">General Enhancement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  >
                    <option value="low">Low - Nice to have</option>
                    <option value="medium">Medium - Would be useful</option>
                    <option value="high">High - Really needed</option>
                    <option value="critical">Critical - Essential for workflow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Feature Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                  placeholder="Describe the feature you'd like to see. What should it do? How should it work?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Use Case & Benefits
                </label>
                <textarea
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                  placeholder="How would this feature help you or other users? What problem does it solve?"
                />
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <i className="fas fa-info-circle text-cyan-400 mr-3"></i>
                  What happens after you submit?
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-green-400 text-sm"></i>
                    <span>We review all feature requests carefully</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-green-400 text-sm"></i>
                    <span>Popular requests are prioritized for development</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-green-400 text-sm"></i>
                    <span>You'll be notified when your requested feature is released</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-lightbulb mr-2"></i>
                  Submit Feature Request
                </button>
                
                <Link 
                  href="/contact"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors text-center"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Contact Us Instead
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}