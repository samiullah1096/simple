import { motion } from 'framer-motion';
import { Link } from 'wouter';
import AdSlot from '../components/Ads/AdSlot';
import ToolCard from '../components/Tools/ToolCard';
import Meta from '../components/SEO/Meta';
import JsonLd from '../components/SEO/JsonLd';
import Breadcrumbs from '../components/SEO/Breadcrumbs';
import { getToolsByCategory, CATEGORIES } from '../lib/toolsIndex';

export default function CategoryPage({ category }) {
  const categoryInfo = CATEGORIES[category];
  const tools = getToolsByCategory(category);

  if (!categoryInfo) {
    return <div>Category not found</div>;
  }

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: categoryInfo.name, href: `/${category}` }
  ];

  const stats = [
    { number: tools.length, label: 'Tools Available' },
    { number: '100%', label: 'Free to Use' },
    { number: '0', label: 'Registration Required' },
    { number: '∞', label: 'Usage Limits' }
  ];

  return (
    <>
      <Meta 
        title={`${categoryInfo.name} - Free Online Tools | ToolsUniverse`}
        description={`${categoryInfo.description}. ${tools.length} professional tools available for free.`}
        keywords={`${category} tools, ${tools.map(t => t.name.toLowerCase()).join(', ')}, free online tools`}
        canonical={`/${category}`}
      />
      
      <JsonLd 
        type="CollectionPage"
        data={{
          name: categoryInfo.name,
          description: categoryInfo.description,
          url: `${window.location.origin}/${category}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: tools.length,
            itemListElement: tools.map((tool, index) => ({
              "@type": "SoftwareApplication",
              position: index + 1,
              name: tool.name,
              description: tool.description,
              url: `${window.location.origin}${tool.path}`
            }))
          }
        }}
      />

      <div className="pt-16 min-h-screen">
        {/* Top Ad Slot */}
        <AdSlot id={`${category}-top`} position="top" pageType="general" />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 hero-gradient">
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
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="flex items-center justify-center mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${categoryInfo.gradient} rounded-2xl flex items-center justify-center mr-4`}>
                  <i className={`${categoryInfo.icon} text-3xl text-white`}></i>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold gradient-text">
                  {categoryInfo.name}
                </h1>
              </div>
              
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {categoryInfo.description}. Professional-grade tools that work entirely in your browser 
                with 100% privacy protection and no registration required.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{stat.number}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-20 bg-gradient-to-b from-slate-950/50 to-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text">Available Tools</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Choose from our collection of {tools.length} professional {category} tools. 
                All tools process your data locally for maximum privacy and speed.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  data-testid={`tool-card-${tool.slug}`}
                >
                  <ToolCard tool={tool} index={index} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Inline Ad Slot */}
        <AdSlot id={`${category}-mid`} position="inline" pageType="general" />

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text">Why Choose Our {categoryInfo.name}?</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Every tool is designed with privacy, speed, and ease of use in mind. 
                No uploads, no registration, no hidden costs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: 'fas fa-shield-alt',
                  title: 'Privacy Protected',
                  description: 'All processing happens in your browser. No data leaves your device.',
                  color: 'from-green-400 to-green-600'
                },
                {
                  icon: 'fas fa-bolt',
                  title: 'Lightning Fast',
                  description: 'No server uploads or processing delays. Get instant results.',
                  color: 'from-yellow-400 to-orange-500'
                },
                {
                  icon: 'fas fa-mobile-alt',
                  title: 'Works Everywhere',
                  description: 'Optimized for all devices - desktop, tablet, and mobile.',
                  color: 'from-blue-400 to-blue-600'
                },
                {
                  icon: 'fas fa-dollar-sign',
                  title: 'Completely Free',
                  description: 'No subscriptions, no limits, no hidden fees. Free forever.',
                  color: 'from-emerald-400 to-emerald-600'
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

        {/* Bottom Ad Slot */}
        <AdSlot id={`${category}-bottom`} position="bottom" pageType="general" />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-slate-950/50 to-slate-900/50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glassmorphism rounded-3xl p-12"
            >
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text">Ready to Get Started?</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Choose any tool above to start processing your files instantly. 
                No registration required, completely secure, and always free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <button 
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
                    data-testid="button-explore-all"
                  >
                    <i className="fas fa-home mr-2"></i>
                    Explore All Categories
                  </button>
                </Link>
                <Link href="#tools">
                  <button 
                    className="glassmorphism hover:bg-slate-700/50 text-slate-100 font-semibold px-8 py-4 rounded-2xl transform transition-all duration-300 hover:scale-105"
                    data-testid="button-view-tools"
                  >
                    <i className="fas fa-tools mr-2"></i>
                    View Tools Above
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
