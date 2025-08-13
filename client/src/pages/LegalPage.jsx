import { motion } from 'framer-motion';
import Meta from '../components/SEO/Meta';
import Breadcrumbs from '../components/SEO/Breadcrumbs';

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'January 2024',
    content: [
      {
        section: 'Information We Collect',
        content: 'ToolsUniverse operates on a privacy-first principle. All file processing happens directly in your browser using client-side JavaScript. We do not collect, store, or have access to any files you process through our tools.'
      },
      {
        section: 'Local Processing',
        content: 'All tools on our platform process your data locally in your web browser. This means your files never leave your device, never touch our servers, and are never transmitted over the internet. This ensures complete privacy and security for your sensitive documents.'
      },
      {
        section: 'Analytics and Cookies',
        content: 'We may use analytics tools to understand how our website is used. This helps us improve our services. You can opt out of analytics tracking through our cookie consent banner. We also use cookies for essential website functionality and to remember your preferences.'
      },
      {
        section: 'Third-Party Services',
        content: 'Our website may include advertisements from third-party providers like Google AdSense. These services may use cookies and tracking technologies. Please refer to their respective privacy policies for more information about their data practices.'
      },
      {
        section: 'Contact Information',
        content: 'If you have any questions about this Privacy Policy, please contact us through our contact page. We are committed to addressing any privacy concerns promptly and transparently.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'January 2024',
    content: [
      {
        section: 'Acceptance of Terms',
        content: 'By accessing and using ToolsUniverse, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
      },
      {
        section: 'Use License',
        content: 'Permission is granted to temporarily use ToolsUniverse for personal and commercial purposes. This is the grant of a license, not a transfer of title. You may not modify or copy the materials, use the materials for any commercial purpose without written consent, or attempt to decompile or reverse engineer any software contained on the website.'
      },
      {
        section: 'Service Availability',
        content: 'We strive to keep ToolsUniverse available 24/7, but we do not guarantee uninterrupted access. We may modify or discontinue the service at any time without notice. We are not liable for any interruption of service or loss of data.'
      },
      {
        section: 'User Responsibilities',
        content: 'You are responsible for ensuring that your use of our tools complies with applicable laws and regulations. You must not use our services for any illegal or unauthorized purpose, or in a way that could damage, disable, or impair the service.'
      },
      {
        section: 'Limitation of Liability',
        content: 'ToolsUniverse and its suppliers will not be liable for any damages arising from the use or inability to use the materials on this website, even if we have been notified orally or in writing of the possibility of such damage. Some jurisdictions do not allow limitations on implied warranties or limitations of liability for consequential damages.'
      }
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    lastUpdated: 'January 2024',
    content: [
      {
        section: 'General Disclaimer',
        content: 'The information on ToolsUniverse is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms whether express or implied.'
      },
      {
        section: 'Tool Accuracy',
        content: 'While we strive to ensure the accuracy and reliability of our tools, we do not warrant that the tools will meet your specific requirements or that the operation of the tools will be uninterrupted or error-free. You use the tools at your own risk.'
      },
      {
        section: 'File Processing',
        content: 'All file processing happens locally in your browser. We are not responsible for any data loss, corruption, or security issues that may occur during the use of our tools. Always keep backups of important files.'
      },
      {
        section: 'External Links',
        content: 'Our website may contain links to external websites. We have no control over the content of these sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.'
      }
    ]
  },
  about: {
    title: 'About ToolsUniverse',
    lastUpdated: 'January 2024',
    content: [
      {
        section: 'Our Mission',
        content: 'ToolsUniverse was created with a simple mission: to provide professional-grade online tools that respect user privacy and work seamlessly across all devices. We believe that powerful tools should be accessible to everyone, without compromising on security or requiring complex installations.'
      },
      {
        section: 'Privacy-First Approach',
        content: 'Unlike many online tools that require file uploads to remote servers, all our tools process data directly in your web browser. This means your files never leave your device, ensuring complete privacy and security. This approach also makes our tools faster and more reliable.'
      },
      {
        section: 'Technology',
        content: 'Our tools are built using modern web technologies including advanced JavaScript libraries, WebAssembly, and Web APIs. This allows us to provide desktop-quality functionality directly in your browser, with no downloads or installations required.'
      },
      {
        section: 'Open Source',
        content: 'We believe in transparency and community-driven development. Much of our codebase is open source, allowing developers to contribute improvements and ensuring that our tools remain trustworthy and secure.'
      },
      {
        section: 'Continuous Improvement',
        content: 'We regularly update and improve our tools based on user feedback and technological advances. Our goal is to provide the best possible experience while maintaining our commitment to privacy and ease of use.'
      }
    ]
  },
  contact: {
    title: 'Contact Us',
    lastUpdated: 'January 2024',
    content: [
      {
        section: 'Get in Touch',
        content: 'We would love to hear from you! Whether you have questions about our tools, suggestions for improvements, or need technical support, we are here to help.'
      },
      {
        section: 'Support',
        content: 'For technical support or questions about using our tools, please check our FAQ section first. If you cannot find the answer you are looking for, feel free to reach out to us directly.'
      },
      {
        section: 'Feature Requests',
        content: 'Have an idea for a new tool or feature? We welcome suggestions from our community. Many of our tools have been developed based on user requests, and we are always looking for ways to improve our platform.'
      },
      {
        section: 'Business Inquiries',
        content: 'For business partnerships, advertising opportunities, or other commercial inquiries, please contact us through the appropriate channels. We are open to collaborations that align with our mission of providing accessible, privacy-focused tools.'
      },
      {
        section: 'Bug Reports',
        content: 'If you encounter any issues or bugs while using our tools, please report them to us with as much detail as possible. Include information about your browser, operating system, and the specific steps that led to the issue.'
      }
    ]
  }
};

export default function LegalPage({ type }) {
  const content = LEGAL_CONTENT[type];
  
  if (!content) {
    return <div>Page not found</div>;
  }

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: content.title, href: `/${type === 'about' || type === 'contact' ? type : `legal/${type}`}` }
  ];

  return (
    <>
      <Meta 
        title={`${content.title} | ToolsUniverse`}
        description={`${content.title} for ToolsUniverse - Learn about our policies and practices.`}
        canonical={`/${type === 'about' || type === 'contact' ? type : `legal/${type}`}`}
      />

      <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-950/50 to-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glassmorphism rounded-3xl p-8 md:p-12"
          >
            <Breadcrumbs items={breadcrumbItems} />
            
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                {content.title}
              </h1>
              <p className="text-slate-400">
                Last updated: {content.lastUpdated}
              </p>
            </header>

            <div className="prose prose-slate max-w-none">
              {content.content.map((section, index) => (
                <motion.section
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-semibold text-slate-100 mb-4">
                    {section.section}
                  </h2>
                  <p className="text-slate-300 leading-relaxed">
                    {section.content}
                  </p>
                </motion.section>
              ))}
            </div>

            {type === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-12 p-8 glassmorphism rounded-2xl"
              >
                <h3 className="text-xl font-semibold text-slate-100 mb-6">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-cyan-400 text-xl"></i>
                    <div>
                      <div className="font-medium text-slate-100">Email</div>
                      <div className="text-slate-400">contact@toolsuniverse.com</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fab fa-github text-cyan-400 text-xl"></i>
                    <div>
                      <div className="font-medium text-slate-100">GitHub</div>
                      <div className="text-slate-400">github.com/toolsuniverse</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fab fa-twitter text-cyan-400 text-xl"></i>
                    <div>
                      <div className="font-medium text-slate-100">Twitter</div>
                      <div className="text-slate-400">@toolsuniverse</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-clock text-cyan-400 text-xl"></i>
                    <div>
                      <div className="font-medium text-slate-100">Response Time</div>
                      <div className="text-slate-400">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <button 
                onClick={() => window.history.back()}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
                data-testid="button-go-back"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Go Back
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
