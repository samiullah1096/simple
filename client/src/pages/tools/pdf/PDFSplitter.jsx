import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function PDFSplitter() {
  const tool = getToolBySlug('pdf', 'split');
  const [file, setFile] = useState(null);
  const [splitType, setSplitType] = useState('pages'); // 'pages' or 'ranges'
  const [pageRanges, setPageRanges] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [splitFiles, setSplitFiles] = useState([]);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setSplitFiles([]);
    } else {
      setError('Please select a valid PDF file');
    }
  }, []);

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const splitIntoPages = async (pdfDoc, totalPages) => {
    const files = [];
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      files.push({
        name: `page_${i + 1}.pdf`,
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        size: pdfBytes.length
      });
    }
    return files;
  };

  const splitByRanges = async (pdfDoc, totalPages) => {
    const files = [];
    const ranges = pageRanges.split(',').map(range => range.trim());
    
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      let startPage, endPage;
      
      if (range.includes('-')) {
        [startPage, endPage] = range.split('-').map(p => parseInt(p.trim()));
      } else {
        startPage = endPage = parseInt(range);
      }
      
      if (startPage < 1 || endPage > totalPages || startPage > endPage) {
        throw new Error(`Invalid range: ${range}`);
      }
      
      const newPdf = await PDFDocument.create();
      const pageIndices = [];
      for (let j = startPage - 1; j < endPage; j++) {
        pageIndices.push(j);
      }
      
      const pages = await newPdf.copyPages(pdfDoc, pageIndices);
      pages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      files.push({
        name: `pages_${startPage}-${endPage}.pdf`,
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        size: pdfBytes.length
      });
    }
    return files;
  };

  const handleSplit = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setProcessing(true);
    setError('');
    setSplitFiles([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      let files;
      if (splitType === 'pages') {
        files = await splitIntoPages(pdfDoc, totalPages);
      } else {
        if (!pageRanges) {
          throw new Error('Please specify page ranges');
        }
        files = await splitByRanges(pdfDoc, totalPages);
      }

      setSplitFiles(files);
    } catch (err) {
      setError(err.message || 'Error splitting PDF');
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = async () => {
    if (splitFiles.length === 0) return;

    // Create a zip file would require a zip library, for now download individually
    splitFiles.forEach(file => {
      downloadFile(file.blob, file.name);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toolContent = (
    <div className="space-y-8">

      {/* Main Tool */}
      <Card className="glassmorphism">
        <CardContent className="p-6 space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="pdf-file" className="text-base font-medium">
              Select PDF File
            </Label>
            <div className="relative">
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            {file && (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Selected: {file.name} ({formatFileSize(file.size)})
              </div>
            )}
          </div>

          {/* Split Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Split Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  splitType === 'pages' 
                    ? 'ring-2 ring-red-400 bg-red-50/50 dark:bg-red-900/10' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                onClick={() => setSplitType('pages')}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-files-o text-red-600 dark:text-red-400"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Individual Pages</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Split into separate files for each page
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  splitType === 'ranges' 
                    ? 'ring-2 ring-red-400 bg-red-50/50 dark:bg-red-900/10' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                onClick={() => setSplitType('ranges')}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-layer-group text-red-600 dark:text-red-400"></i>
                  </div>
                  <h3 className="font-semibold mb-2">Custom Ranges</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Split by specific page ranges
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Range Input */}
          {splitType === 'ranges' && (
            <div className="space-y-4">
              <Label htmlFor="page-ranges" className="text-base font-medium">
                Page Ranges
              </Label>
              <Input
                id="page-ranges"
                type="text"
                placeholder="e.g., 1-3, 5, 7-10"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
              />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter page ranges separated by commas. Examples: "1-3" for pages 1 to 3, "5" for page 5 only
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <i className="fas fa-exclamation-triangle w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button
            onClick={handleSplit}
            disabled={!file || processing}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2" />
                Splitting PDF...
              </>
            ) : (
              <>
                <i className="fas fa-cut mr-2" />
                Split PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {splitFiles.length > 0 && (
        <Card className="glassmorphism">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fas fa-check-circle text-green-400 mr-2" />
                Split Complete ({splitFiles.length} files)
              </h3>
              <Button onClick={downloadAll} variant="outline" size="sm">
                <i className="fas fa-download mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {splitFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <i className="fas fa-file-pdf text-red-600 dark:text-red-400 text-sm" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => downloadFile(file.blob, file.name)}
                    variant="ghost"
                    size="sm"
                  >
                    <i className="fas fa-download" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-shield-alt text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold">Privacy First</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            All processing happens in your browser. Files never leave your device.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-bolt text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold">Lightning Fast</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Instantly split PDFs without waiting for uploads or processing queues.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-cogs text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold">Flexible Options</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Split by individual pages or custom ranges to meet your needs.
          </p>
        </div>
      </div>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload PDF',
      description: 'Select the PDF file you want to split'
    },
    {
      title: 'Choose Split Method',
      description: 'Split by individual pages or custom page ranges'
    },
    {
      title: 'Set Options',
      description: 'Specify page ranges if using custom split method'
    },
    {
      title: 'Download Files',
      description: 'Get individual PDF files or download all at once'
    }
  ];

  const benefits = [
    'Split PDFs into individual pages',
    'Custom page range extraction',
    'Browser-based processing',
    'No file size limitations',
    'Instant results'
  ];

  const useCases = [
    'Extract specific pages from documents',
    'Share individual pages from reports',
    'Create smaller files from large PDFs',
    'Organize document sections',
    'Prepare pages for editing'
  ];

  return (
    <ToolShell 
      tool={tool} 
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      {toolContent}
    </ToolShell>
  );
}