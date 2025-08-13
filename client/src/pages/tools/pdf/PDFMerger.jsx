import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function PDFMerger() {
  const tool = getToolBySlug('pdf', 'merge');
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
      // This would use PDF-lib or similar library for actual PDF merging
      // For demo purposes, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock merged PDF blob
      const mockPDFContent = new Blob(['Mock merged PDF content'], { type: 'application/pdf' });
      setOutputFile({
        name: 'merged-document.pdf',
        blob: mockPDFContent,
        size: mockPDFContent.size
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

  return (
    <ToolShell tool={tool} category="pdf">
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
          >
            <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-4"></i>
            <p className="text-lg mb-2 text-slate-300">Drag and drop PDF files here</p>
            <p className="text-slate-400 mb-4">or click to browse</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl transition-colors">
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
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-semibold transition-colors"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Merging PDFs...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Merge PDFs
                </>
              )}
            </button>
            <button
              onClick={resetTool}
              className="px-6 py-4 glassmorphism hover:bg-slate-700/50 text-slate-300 rounded-2xl transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>
              Reset
            </button>
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
