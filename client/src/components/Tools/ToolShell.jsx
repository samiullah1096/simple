import { motion } from 'framer-motion';
import AdSlot from '../Ads/AdSlot';
import Meta from '../SEO/Meta';
import JsonLd from '../SEO/JsonLd';
import { getRelatedTools } from '../../lib/toolsIndex';
import { Link } from 'wouter';

export default function ToolShell({ 
  tool, 
  children, 
  faqs = [], 
  howToSteps = [], 
  benefits = [], 
  useCases = [] 
}) {
  const relatedTools = getRelatedTools(tool.category, tool.slug);

  const defaultFaqs = [
    {
      question: `Is the ${tool.name} tool free to use?`,
      answer: 'Yes, this tool is completely free to use with no registration required. All processing happens in your browser for complete privacy.'
    },
    {
      question: 'Is my data secure when using this tool?',
      answer: 'Absolutely. All file processing happens directly in your browser using client-side JavaScript. Your files never leave your device or get uploaded to any servers.'
    },
    {
      question: 'What file formats are supported?',
      answer: `This tool supports all standard formats for ${tool.category.toLowerCase()}. The specific formats depend on your browser's capabilities.`
    },
    {
      question: 'Are there any file size limits?',
      answer: 'File size limits depend on your device\'s available memory since processing happens locally. For optimal performance, we recommend files under 100MB.'
    }
  ];

  const finalFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <>
      <Meta 
        title={`${tool.name} - Free Online Tool | ToolsUniverse`}
        description={tool.description}
        keywords={tool.keywords}
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
          featureList: benefits.length > 0 ? benefits : [
            "Free to use",
            "No registration required", 
            "Privacy-focused",
            "Works offline"
          ]
        }}
      />

      <JsonLd 
        type="FAQPage"
        data={{
          mainEntity: finalFaqs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
        }}
      />

      <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Breadcrumbs */}
        <div className="bg-slate-900/50 border-b border-slate-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-cyan-400 transition-colors">
                <i className="fas fa-home mr-1"></i>
                Home
              </Link>
              <i className="fas fa-chevron-right"></i>
              <Link href={`/${tool.category.toLowerCase().replace(' tools', '')}`} className="hover:text-cyan-400 transition-colors">
                {tool.category}
              </Link>
              <i className="fas fa-chevron-right"></i>
              <span className="text-slate-300">{tool.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Tool Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className={`w-20 h-20 bg-gradient-to-br ${tool.color.replace('text-', 'from-').replace('-400', '-500')} to-${tool.color.split('-')[1]}-600 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <i className={`${tool.icon} text-3xl text-white`}></i>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
              {tool.name}
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {tool.description}
            </p>
          </motion.div>

          {/* Top Ad Slot */}
          <AdSlot id={`${tool.slug}-top`} position="top" pageType="tool" />

          {/* Main Tool Content */}
          <div className="max-w-6xl mx-auto">
            {children}
          </div>

          {/* How It Works Section */}
          {howToSteps.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="glassmorphism rounded-2xl p-8 border-slate-700">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <i className="fas fa-list-ol mr-3 text-cyan-400"></i>
                  How to Use {tool.name}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {howToSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100 mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Benefits Section */}
          {benefits.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="glassmorphism rounded-2xl p-8 border-slate-700">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <i className="fas fa-star mr-3 text-yellow-400"></i>
                  Why Use {tool.name}?
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <i className="fas fa-check-circle text-green-400"></i>
                      <span className="text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Use Cases Section */}
          {useCases.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="glassmorphism rounded-2xl p-8 border-slate-700">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <i className="fas fa-lightbulb mr-3 text-purple-400"></i>
                  Common Use Cases
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {useCases.map((useCase, index) => (
                    <div key={index} className="glassmorphism rounded-xl p-4 border-slate-600">
                      <p className="text-slate-300">{useCase}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Bottom Ad Slot */}
          <AdSlot id={`${tool.slug}-bottom`} position="bottom" pageType="tool" />

          {/* FAQ Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="glassmorphism rounded-2xl p-8 border-slate-700">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                <i className="fas fa-question-circle mr-3 text-blue-400"></i>
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {finalFaqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-700 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-slate-100 mb-2">{faq.question}</h3>
                    <p className="text-slate-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="glassmorphism rounded-2xl p-8 border-slate-700">
                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <i className="fas fa-tools mr-3 text-orange-400"></i>
                  Related Tools
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools.slice(0, 6).map((relatedTool, index) => (
                    <Link key={index} href={relatedTool.path}>
                      <div className="glassmorphism rounded-xl p-4 border-slate-600 hover:border-cyan-500 transition-all duration-300 group cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${relatedTool.color.replace('text-', 'from-').replace('-400', '-500')} to-${relatedTool.color.split('-')[1]}-600 rounded-lg flex items-center justify-center`}>
                            <i className={`${relatedTool.icon} text-white`}></i>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                              {relatedTool.name}
                            </h3>
                            <p className="text-sm text-slate-400">{relatedTool.category}</p>
                          </div>
                          <i className="fas fa-arrow-right text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300"></i>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Keywords Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="glassmorphism rounded-2xl p-8 border-slate-700">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                <i className="fas fa-tags mr-3 text-pink-400"></i>
                Related Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {tool.keywords.split(', ').map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-600"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Last Updated */}
          <div className="text-center mt-8 text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
}