import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function BatchImageProcessor() {
  const [files, setFiles] = useState([]);
  const [operation, setOperation] = useState('resize');
  const [resizeWidth, setResizeWidth] = useState([800]);
  const [resizeHeight, setResizeHeight] = useState([600]);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState([80]);
  const [outputFormat, setOutputFormat] = useState('original');
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const tool = getToolBySlug('image', 'batch-process');

  const operations = {
    resize: 'Resize Images',
    compress: 'Compress Images',
    convert: 'Convert Format',
    watermark: 'Add Watermark'
  };

  const formats = {
    original: 'Keep Original',
    jpeg: 'JPEG',
    png: 'PNG',
    webp: 'WebP'
  };

  const handleFilesChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file');
      return;
    }

    if (selectedFiles.length > 50) {
      setError('Maximum 50 images allowed for batch processing');
      return;
    }

    setFiles(selectedFiles);
    setProcessedImages([]);
    setError('');
  }, []);

  const processImage = async (file, canvas, ctx) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          let targetWidth = img.width;
          let targetHeight = img.height;
          
          if (operation === 'resize') {
            targetWidth = resizeWidth[0];
            targetHeight = resizeHeight[0];
            
            if (maintainAspectRatio) {
              const aspectRatio = img.width / img.height;
              if (targetWidth / targetHeight > aspectRatio) {
                targetWidth = targetHeight * aspectRatio;
              } else {
                targetHeight = targetWidth / aspectRatio;
              }
            }
          }
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          // Clear and draw image
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          
          // Determine output format
          let outputMime = file.type;
          let fileExtension = file.name.split('.').pop();
          
          if (outputFormat !== 'original') {
            outputMime = `image/${outputFormat}`;
            fileExtension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
          }
          
          // Apply quality if JPEG
          const qualityValue = outputMime === 'image/jpeg' ? quality[0] / 100 : 0.95;
          
          canvas.toBlob((blob) => {
            const processedFile = {
              blob,
              name: file.name.replace(/\.[^/.]+$/, `_processed.${fileExtension}`),
              originalName: file.name,
              size: blob.size
            };
            resolve(processedFile);
          }, outputMime, qualityValue);
        };
        
        img.src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    });
  };

  const processBatch = async () => {
    if (files.length === 0) {
      setError('Please select images to process');
      return;
    }

    setProcessing(true);
    setError('');
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const processed = [];
      
      for (let i = 0; i < files.length; i++) {
        const processedFile = await processImage(files[i], canvas, ctx);
        processed.push(processedFile);
        
        // Update progress
        const progress = ((i + 1) / files.length) * 100;
        console.log(`Processing progress: ${progress.toFixed(1)}%`);
      }
      
      setProcessedImages(processed);
      
      toast({
        title: "Success!",
        description: `${processed.length} images processed successfully.`,
      });
      
    } catch (err) {
      console.error('Error processing images:', err);
      setError('Failed to process images. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = async () => {
    if (processedImages.length === 0) {
      setError('No processed images to download');
      return;
    }

    try {
      const zip = new JSZip();
      
      processedImages.forEach((img, index) => {
        zip.file(img.name, img.blob);
      });
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `batch_processed_images_${operation}.zip`);
      
      toast({
        title: "Downloaded!",
        description: "All processed images have been downloaded as a ZIP file.",
      });
      
    } catch (err) {
      console.error('Error creating ZIP:', err);
      setError('Failed to create download ZIP. Please try again.');
    }
  };

  const downloadSingle = (processedFile) => {
    saveAs(processedFile.blob, processedFile.name);
  };

  const toolContent = (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Upload & Settings</CardTitle>
            <CardDescription className="text-slate-400">
              Upload multiple images and configure batch processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="images-upload" className="text-slate-300">Choose Images (max 50)</Label>
              <Input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="bg-slate-800 border-slate-600 text-slate-100"
                data-testid="input-images-files"
              />
              {files.length > 0 && (
                <p className="text-sm text-slate-400 mt-2">{files.length} images selected</p>
              )}
            </div>

            {files.length > 0 && (
              <>
                <div>
                  <Label className="text-slate-300">Processing Operation</Label>
                  <Select value={operation} onValueChange={setOperation}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.entries(operations).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {operation === 'resize' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Width: {resizeWidth[0]}px</Label>
                        <Slider
                          value={resizeWidth}
                          onValueChange={setResizeWidth}
                          max={2000}
                          min={100}
                          step={50}
                          className="mt-2"
                          data-testid="slider-width"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Height: {resizeHeight[0]}px</Label>
                        <Slider
                          value={resizeHeight}
                          onValueChange={setResizeHeight}
                          max={2000}
                          min={100}
                          step={50}
                          className="mt-2"
                          data-testid="slider-height"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onCheckedChange={setMaintainAspectRatio}
                        data-testid="checkbox-aspect-ratio"
                      />
                      <Label htmlFor="aspect-ratio" className="text-slate-300">Maintain aspect ratio</Label>
                    </div>
                  </>
                )}

                {(operation === 'compress' || operation === 'convert') && (
                  <div>
                    <Label className="text-slate-300">Quality: {quality[0]}%</Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={10}
                      step={5}
                      className="mt-2"
                      data-testid="slider-quality"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-slate-300">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.entries(formats).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={processBatch}
                    disabled={processing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="button-process-batch"
                  >
                    {processing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cogs mr-2"></i>
                        Process Images
                      </>
                    )}
                  </Button>
                  
                  {processedImages.length > 0 && (
                    <Button
                      onClick={downloadAll}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-download-all"
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download All
                    </Button>
                  )}
                </div>
              </>
            )}

            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Results</CardTitle>
            <CardDescription className="text-slate-400">
              {processedImages.length > 0 ? `${processedImages.length} images processed` : 'Processed images will appear here'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {processedImages.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {processedImages.map((img, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm font-medium">{img.name}</p>
                      <p className="text-slate-400 text-xs">
                        {(img.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      onClick={() => downloadSingle(img)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid={`button-download-${index}`}
                    >
                      <i className="fas fa-download"></i>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fas fa-layer-group text-4xl mb-4"></i>
                <p>Process images to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload Images',
      description: 'Select multiple images (up to 50) for batch processing'
    },
    {
      title: 'Choose Operation',
      description: 'Select resize, compress, convert, or watermark operation'
    },
    {
      title: 'Configure Settings',
      description: 'Adjust dimensions, quality, and output format'
    },
    {
      title: 'Process & Download',
      description: 'Process all images and download individually or as ZIP'
    }
  ];

  const benefits = [
    'Process up to 50 images at once',
    'Multiple operations available',
    'Customizable output settings',
    'Download as ZIP or individually',
    'Real-time processing progress'
  ];

  const useCases = [
    'Preparing images for web upload',
    'Creating consistent image sizes',
    'Bulk format conversion',
    'Social media optimization',
    'Portfolio preparation'
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