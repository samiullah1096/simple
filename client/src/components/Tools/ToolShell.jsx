import { motion } from 'framer-motion';
import AdSlot from '../Ads/AdSlot';
import Breadcrumbs from '../SEO/Breadcrumbs';
import Meta from '../SEO/Meta';
import JsonLd from '../SEO/JsonLd';
import { Link } from 'wouter';
import { getToolsByCategory, CATEGORIES } from '../../lib/toolsIndex';

export default function ToolShell({ 
  tool, 
  children, 
  category,
  relatedTools = null 
}) {
  const categoryInfo = CATEGORIES[category];
  const relatedToolsList = relatedTools || getToolsByCategory(category).filter(t => t.slug !== tool.slug).slice(0, 4);
  
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: categoryInfo.name, href: `/${category}` },
    { name: tool.name, href: tool.path }
  ];

  return (
    <>
      <Meta 
        title={`${tool.name} - Free Online Tool | ToolsUniverse`}
        description={tool.description}
        keywords={tool.keywords}
        canonical={tool.path}
      />
      
      <JsonLd 
        type="SoftwareApplication"
        data={{
          name: tool.name,
          description: tool.description,
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          },
          featureList: tool.keywords.split(', '),
          ...tool.schema
        }}
      />

      <div className="pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glassmorphism rounded-3xl overflow-hidden"
          >
            {/* Tool Header */}
            <div className={`bg-gradient-to-r ${categoryInfo.gradient}/10 border-b border-slate-700/50 p-8`}>
              <Breadcrumbs items={breadcrumbItems} />
              
              <div className="flex items-center mt-6 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${categoryInfo.gradient} rounded-2xl flex items-center justify-center mr-4`}>
                  <i className={`${tool.icon} text-2xl text-white`}></i>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-100 mb-2">{tool.name}</h1>
                  <p className="text-slate-400 max-w-3xl">{tool.description}</p>
                </div>
              </div>
            </div>

            {/* Top Ad Slot */}
            <AdSlot id={`${tool.slug}-top`} position="top" pageType="tool" />

            {/* Tool Content */}
            <div className="p-8">
              {children}
            </div>

            {/* How It Works Section */}
            <div className="p-8 border-t border-slate-700/50">
              <h2 className="text-2xl font-semibold mb-6 text-slate-100">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glassmorphism p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Upload or Input</h3>
                  <p className="text-slate-400 text-sm">Select your files or enter your data using our intuitive interface.</p>
                </div>
                <div className="glassmorphism p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Process Locally</h3>
                  <p className="text-slate-400 text-sm">Our tools process everything in your browser for maximum privacy and speed.</p>
                </div>
                <div className="glassmorphism p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Download Results</h3>
                  <p className="text-slate-400 text-sm">Get your processed files instantly with no waiting or server delays.</p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="p-8 border-t border-slate-700/50">
              <h2 className="text-2xl font-semibold mb-6 text-slate-100">Why Use Our {tool.name}?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: 'fas fa-shield-alt', title: 'Privacy First', description: 'All processing happens locally in your browser', color: 'text-green-400' },
                  { icon: 'fas fa-bolt', title: 'Lightning Fast', description: 'No uploads or server processing delays', color: 'text-yellow-400' },
                  { icon: 'fas fa-mobile-alt', title: 'Works Anywhere', description: 'Compatible with all devices and browsers', color: 'text-blue-400' },
                  { icon: 'fas fa-dollar-sign', title: 'Free Forever', description: 'No hidden costs or usage limitations', color: 'text-green-400' }
                ].map((benefit, index) => (
                  <div key={index} className="glassmorphism p-4 rounded-xl text-center">
                    <i className={`${benefit.icon} text-2xl ${benefit.color} mb-3`}></i>
                    <h3 className="font-semibold text-slate-100 mb-2">{benefit.title}</h3>
                    <p className="text-xs text-slate-400">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            {relatedToolsList.length > 0 && (
              <div className="p-8 border-t border-slate-700/50">
                <h2 className="text-2xl font-semibold mb-6 text-slate-100">Related Tools</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedToolsList.map((relatedTool) => (
                    <Link key={relatedTool.slug} href={relatedTool.path}>
                      <div className="glassmorphism p-4 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-3 mb-2">
                          <i className={`${relatedTool.icon} ${relatedTool.color} text-lg`}></i>
                          <span className="font-medium text-slate-100 group-hover:text-cyan-400 transition-colors">
                            {relatedTool.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{relatedTool.description.substring(0, 80)}...</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Ad Slot */}
            <AdSlot id={`${tool.slug}-bottom`} position="bottom" pageType="tool" />
          </motion.div>
        </div>
      </div>
    </>
  );
}
