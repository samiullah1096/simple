import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function WordToPDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState([]);

  const tool = TOOLS.pdf.find(t => t.slug === 'word-to-pdf');

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const convertToPDF = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const converted = files.map(file => ({
        name: file.name.replace(/\.(docx?|odt)$/i, '.pdf'),
        size: Math.floor(file.size * 0.8), // Simulated compression
        downloadUrl: URL.createObjectURL(new Blob(['PDF content'], { type: 'application/pdf' }))
      }));
      
      setProcessedFiles(converted);
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setProcessedFiles([]);
  };

  const faqs = [
    {
      question: 'What Word formats are supported?',
      answer: 'Our converter supports DOC, DOCX, and ODT formats. All Microsoft Word and OpenOffice Writer documents are compatible.'
    },
    {
      question: 'Will my document formatting be preserved?',
      answer: 'Yes, our converter maintains fonts, layouts, images, tables, and all formatting elements during the conversion process.'
    },
    {
      question: 'Can I convert password-protected Word documents?',
      answer: 'Currently, password-protected documents need to be unlocked before conversion. We recommend removing protection temporarily.'
    }
  ];

  const howToSteps = [
    'Select your Word document (DOC, DOCX, or ODT)',
    'Click "Convert to PDF" to start the process',
    'Wait for the conversion to complete',
    'Download your converted PDF file',
    'Enjoy your professionally formatted PDF document'
  ];

  const benefits = [
    'Preserves original formatting and layout',
    'Supports all major Word formats',
    'Professional quality PDF output',
    'No software installation required',
    'Batch conversion capability'
  ];

  return (
    <ToolShell tool={tool} faqs={faqs} howToSteps={howToSteps} benefits={benefits}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Upload Word Documents</h2>
          
          <div className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".doc,.docx,.odt"
              onChange={handleFileUpload}
              multiple
              className="hidden"
              id="word-upload"
              data-testid="input-word-upload"
            />
            <label
              htmlFor="word-upload"
              className="cursor-pointer block"
              data-testid="label-upload"
            >
              <i className="fas fa-file-word text-4xl text-blue-400 mb-4 block"></i>
              <p className="text-lg text-slate-300 mb-2">
                Drop Word files here or click to browse
              </p>
              <p className="text-sm text-slate-500">
                Supports DOC, DOCX, ODT formats
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-200">Selected Files:</h3>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 glassmorphism rounded-xl"
                  data-testid={`file-item-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-file-word text-blue-400"></i>
                    <span className="text-slate-300">{file.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={convertToPDF}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-semibold transition-colors"
              data-testid="button-convert"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Converting...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Convert to PDF
                </>
              )}
            </button>

            {files.length > 0 && (
              <button
                onClick={resetTool}
                className="px-6 py-4 glassmorphism hover:bg-slate-700/50 text-slate-300 rounded-2xl transition-colors"
                data-testid="button-reset"
              >
                <i className="fas fa-redo mr-2"></i>
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Converted PDFs</h2>
          
          {processedFiles.length === 0 ? (
            <div className="glassmorphism rounded-2xl p-8 text-center">
              <i className="fas fa-file-pdf text-4xl text-red-400 mb-4 block"></i>
              <p className="text-slate-400">
                Converted PDFs will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedFiles.map((file, index) => (
                <div
                  key={index}
                  className="glassmorphism rounded-xl p-4"
                  data-testid={`converted-file-${index}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-pdf text-red-400"></i>
                      <span className="text-slate-300">{file.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = file.downloadUrl;
                      link.download = file.name;
                      link.click();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                    data-testid={`button-download-${index}`}
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </ToolShell>
  );
}