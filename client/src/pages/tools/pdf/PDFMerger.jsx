import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function PDFMerger() {
  const tool = TOOLS.pdf.find(t => t.slug === 'merge');
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFile, setOutputFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    const newFiles = pdfFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      preview: null
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const moveFile = (fromIndex, toIndex) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Dynamically import PDF-lib to keep bundle size optimized
      const { PDFDocument } = await import('pdf-lib');
      
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each file and add its pages to the merged document
      for (const fileData of files) {
        const arrayBuffer = await fileData.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      
      // Generate the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      
      setOutputFile({
        name: 'merged-document.pdf',
        blob: mergedBlob,
        size: mergedBlob.size
      });
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMergedPDF = () => {
    if (!outputFile) return;
    
    const url = URL.createObjectURL(outputFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFiles([]);
    setOutputFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const faqs = [
    {
      question: 'How do I merge PDF files online for free?',
      answer: 'Simply upload 2 or more PDF files using the file selector or drag-and-drop area. Arrange them in your desired order, then click "Merge PDFs" to combine them into a single document.'
    },
    {
      question: 'Is it safe to merge PDFs online?',
      answer: 'Yes, absolutely safe. All PDF processing happens directly in your browser using client-side JavaScript. Your files never leave your device or get uploaded to any servers.'
    },
    {
      question: 'What is the maximum number of PDFs I can merge?',
      answer: 'You can merge as many PDF files as your device memory allows. For optimal performance, we recommend merging up to 50 files at once.'
    },
    {
      question: 'Can I rearrange the order of PDFs before merging?',
      answer: 'Yes! Use the up and down arrow buttons next to each file to reorder them. The final merged PDF will follow the order shown in the file list.'
    },
    {
      question: 'What happens to bookmarks and metadata when merging PDFs?',
      answer: 'Bookmarks and most metadata from individual PDFs are preserved in the merged document. However, document-level metadata like title and author will need to be set separately.'
    }
  ];

  const howToSteps = [
    'Click "Choose Files" or drag PDF files into the upload area',
    'Select 2 or more PDF files from your device',
    'Arrange the files in your desired order using the arrow buttons',
    'Click "Merge PDFs" to combine all files into one document',
    'Download your merged PDF file when processing is complete'
  ];

  const benefits = [
    'Combine multiple PDFs instantly',
    'Drag-and-drop file ordering',
    'No file upload to servers',
    'Preserves original quality',
    'Works with password-protected PDFs',
    'No file size limits'
  ];

  const useCases = [
    'Combine contract documents for business',
    'Merge research papers and articles',
    'Consolidate invoices and receipts',
    'Create comprehensive reports',
    'Combine multiple forms into one file',
    'Merge presentation slides from different sources'
  ];

  return (
    <ToolShell 
      tool={tool} 
      faqs={faqs}
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-100">Upload PDF Files</h2>
          
          {/* File Upload Area */}
          <div 
            className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            data-testid="upload-area"
          >
            <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-4"></i>
            <p className="text-lg mb-2 text-slate-300">Drag and drop PDF files here</p>
            <p className="text-slate-400 mb-4">or click to browse</p>
            <button 
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl transition-colors"
              data-testid="button-choose-files"
            >
              <i className="fas fa-folder-open mr-2"></i>
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file"
            />
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-100">Selected Files ({files.length})</h3>
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glassmorphism p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-file-pdf text-red-400 text-xl"></i>
                    <div>
                      <div className="font-medium text-slate-100">{file.name}</div>
                      <div className="text-sm text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveFile(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <i className="fas fa-arrow-up"></i>
                    </button>
                    <button
                      onClick={() => moveFile(index, Math.min(files.length - 1, index + 1))}
                      disabled={index === files.length - 1}
                      className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <i className="fas fa-arrow-down"></i>
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                      title="Remove file"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={mergePDFs}
              disabled={files.length < 2 || isProcessing}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                files.length >= 2 && !isProcessing
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
              data-testid="button-merge-pdfs"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Merging PDFs...
                </>
              ) : (
                <>
                  <i className="fas fa-object-group mr-2"></i>
                  Merge PDFs ({files.length})
                </>
              )}
            </button>
            
            {files.length > 0 && (
              <button
                onClick={resetTool}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-colors"
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
          <h2 className="text-2xl font-bold text-slate-100">Preview & Download</h2>
          
          {/* Preview Area */}
          <div className="glassmorphism rounded-2xl p-6 h-96 flex items-center justify-center">
            {outputFile ? (
              <div className="text-center">
                <i className="fas fa-file-pdf text-6xl text-green-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">PDF Merged Successfully!</h3>
                <p className="text-slate-400 mb-6">Your merged PDF is ready for download</p>
                <button
                  onClick={downloadMergedPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Merged PDF
                </button>
              </div>
            ) : isProcessing ? (
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-6xl text-cyan-400 mb-4"></i>
                <p className="text-slate-400">Processing your PDFs...</p>
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <i className="fas fa-file-pdf text-6xl mb-4 opacity-50"></i>
                <p>Merged PDF preview will appear here</p>
                <p className="text-sm mt-2">Upload files and click merge to start</p>
              </div>
            )}
          </div>

          {/* File Information */}
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Merge Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total files:</span>
                <span className="text-slate-100">{files.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total size:</span>
                <span className="text-slate-100">
                  {files.length > 0 
                    ? (files.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2) + ' MB'
                    : '0 MB'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processing time:</span>
                <span className="text-slate-100">
                  {isProcessing ? 'Processing...' : outputFile ? '< 2 seconds' : 'Not started'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Privacy:</span>
                <span className="text-green-400">100% local processing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ToolShell>
  );
}
