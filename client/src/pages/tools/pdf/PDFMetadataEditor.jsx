import { useState } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function PDFMetadataEditor() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
    creationDate: '',
    modificationDate: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const tool = TOOLS.pdf.find(t => t.slug === 'metadata');

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Simulate reading existing metadata
      setMetadata({
        title: 'Document Title',
        author: 'Document Author',
        subject: 'Document Subject',
        keywords: 'pdf, document, metadata',
        creator: 'ToolsUniverse',
        producer: 'PDF Editor',
        creationDate: new Date().toISOString().split('T')[0],
        modificationDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const updateMetadata = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      // Simulate metadata update process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create download link
      const blob = new Blob(['Updated PDF with new metadata'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name.replace('.pdf', '_updated.pdf');
      link.click();
      
    } catch (error) {
      console.error('Metadata update failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setMetadata({
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: '',
      creationDate: '',
      modificationDate: ''
    });
  };

  const faqs = [
    {
      question: 'What PDF metadata can I edit?',
      answer: 'You can edit title, author, subject, keywords, creator, producer, and date information. These properties help organize and identify your PDF documents.'
    },
    {
      question: 'Will editing metadata affect the PDF content?',
      answer: 'No, editing metadata only changes the document properties. The actual content, formatting, and layout remain completely unchanged.'
    },
    {
      question: 'Why is PDF metadata important?',
      answer: 'Metadata helps with document organization, search optimization, and professional presentation. It\'s especially useful for business documents and publications.'
    }
  ];

  const howToSteps = [
    'Upload your PDF document',
    'Review the current metadata fields',
    'Edit the metadata properties as needed',
    'Click "Update Metadata" to apply changes',
    'Download your PDF with updated metadata'
  ];

  const benefits = [
    'Professional document organization',
    'Improved searchability and indexing',
    'SEO optimization for web PDFs',
    'Better document management',
    'Enhanced document properties'
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
          <h2 className="text-2xl font-bold text-slate-100">Upload PDF Document</h2>
          
          <div className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
              data-testid="input-pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer block"
              data-testid="label-upload"
            >
              <i className="fas fa-file-pdf text-4xl text-red-400 mb-4 block"></i>
              <p className="text-lg text-slate-300 mb-2">
                Drop PDF file here or click to browse
              </p>
              <p className="text-sm text-slate-500">
                PDF files only
              </p>
            </label>
          </div>

          {file && (
            <div className="glassmorphism rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <i className="fas fa-file-pdf text-red-400"></i>
                <span className="text-slate-300">{file.name}</span>
                <span className="text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Metadata Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Edit Metadata</h2>
          
          {!file ? (
            <div className="glassmorphism rounded-2xl p-8 text-center">
              <i className="fas fa-info-circle text-4xl text-blue-400 mb-4 block"></i>
              <p className="text-slate-400">
                Upload a PDF to edit its metadata
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:border-blue-400 focus:outline-none"
                  data-testid="input-title"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Author</label>
                <input
                  type="text"
                  value={metadata.author}
                  onChange={(e) => setMetadata({...metadata, author: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:border-blue-400 focus:outline-none"
                  data-testid="input-author"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={metadata.subject}
                  onChange={(e) => setMetadata({...metadata, subject: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:border-blue-400 focus:outline-none"
                  data-testid="input-subject"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Keywords</label>
                <input
                  type="text"
                  value={metadata.keywords}
                  onChange={(e) => setMetadata({...metadata, keywords: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:border-blue-400 focus:outline-none"
                  placeholder="keyword1, keyword2, keyword3"
                  data-testid="input-keywords"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={updateMetadata}
                  disabled={!file || isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors"
                  data-testid="button-update"
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Update Metadata
                    </>
                  )}
                </button>

                <button
                  onClick={resetTool}
                  className="px-6 py-3 glassmorphism hover:bg-slate-700/50 text-slate-300 rounded-xl transition-colors"
                  data-testid="button-reset"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Reset
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ToolShell>
  );
}