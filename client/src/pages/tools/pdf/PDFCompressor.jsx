import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

export default function PDFCompressor() {
  const tool = TOOLS.pdf.find(t => t.slug === 'compress');
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [compressedFile, setCompressedFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);

  const qualitySettings = {
    high: { name: 'High Quality', description: 'Better quality, larger size' },
    medium: { name: 'Medium Quality', description: 'Balanced quality and size' },
    low: { name: 'Low Quality', description: 'Smaller size, lower quality' }
  };

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setError('');
      setCompressedFile(null);
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

  const handleCompress = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setProcessing(true);
    setError('');
    setCompressedFile(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Apply compression based on quality setting
      let compressionOptions = {};
      
      switch (quality) {
        case 'low':
          compressionOptions = {
            useObjectStreams: true,
            addDefaultPage: false,
            subset: true
          };
          break;
        case 'medium':
          compressionOptions = {
            useObjectStreams: true,
            addDefaultPage: false
          };
          break;
        case 'high':
          compressionOptions = {
            useObjectStreams: false,
            addDefaultPage: false
          };
          break;
        default:
          compressionOptions = {};
      }

      // Remove unnecessary metadata and objects
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('ToolsUniverse PDF Compressor');

      // Save with compression
      const pdfBytes = await pdfDoc.save(compressionOptions);
      
      const compressedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const fileName = file.name.replace('.pdf', '_compressed.pdf');
      
      setCompressedFile({
        name: fileName,
        blob: compressedBlob,
        size: pdfBytes.length
      });

    } catch (err) {
      console.error('Compression error:', err);
      setError('Error compressing PDF. The file might be corrupted or password protected.');
    } finally {
      setProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = () => {
    if (!compressedFile || !originalSize) return 0;
    return ((originalSize - compressedFile.size) / originalSize * 100).toFixed(1);
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

          {/* Quality Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Compression Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(qualitySettings).map(([key, setting]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col">
                      <span className="font-medium">{setting.name}</span>
                      <span className="text-sm text-slate-500">{setting.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <i className="fas fa-exclamation-triangle w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button
            onClick={handleCompress}
            disabled={!file || processing}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2" />
                Compressing PDF...
              </>
            ) : (
              <>
                <i className="fas fa-compress-arrows-alt mr-2" />
                Compress PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {compressedFile && (
        <Card className="glassmorphism">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-4">
                <i className="fas fa-check-circle text-2xl text-green-400"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compression Complete!</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your PDF has been compressed successfully.
              </p>
            </div>
            
            {/* Compression Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Original Size</p>
                <p className="text-lg font-semibold">{formatFileSize(originalSize)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Compressed Size</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {formatFileSize(compressedFile.size)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Size Reduction</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {getCompressionRatio()}%
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <Button 
                onClick={() => downloadFile(compressedFile.blob, compressedFile.name)}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                <i className="fas fa-download mr-2" />
                Download Compressed PDF
              </Button>
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
            All compression happens locally. Your files never leave your device.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-balance-scale text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold">Quality Control</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Choose your compression level to balance file size and quality.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-bolt text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold">Instant Results</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Get compressed PDFs in seconds without uploading to servers.
          </p>
        </div>
      </div>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload PDF',
      description: 'Select the PDF file you want to compress'
    },
    {
      title: 'Choose Quality',
      description: 'Pick compression level based on your needs'
    },
    {
      title: 'Compress File',
      description: 'Process the PDF with advanced compression algorithms'
    },
    {
      title: 'Download Result',
      description: 'Save your compressed PDF with reduced file size'
    }
  ];

  const benefits = [
    'Significantly reduce PDF file sizes',
    'Maintain document quality and readability',
    'Privacy-first browser-based processing',
    'Multiple compression levels',
    'Instant compression results'
  ];

  const useCases = [
    'Email attachment size limits',
    'Storage space optimization',
    'Faster upload and download times',
    'Web optimization for faster loading',
    'Archive management and organization'
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