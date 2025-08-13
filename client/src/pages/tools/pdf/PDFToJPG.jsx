import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PDFToJPG() {
  const tool = getToolBySlug('pdf', 'to-jpg');
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [pages, setPages] = useState([]);
  const [quality, setQuality] = useState([90]);
  const [resolution, setResolution] = useState('150');
  const [format, setFormat] = useState('jpeg');
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    await loadPDFPages(uploadedFile);
  }, [toast]);

  const loadPDFPages = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      
      const pageList = [];
      for (let i = 1; i <= pageCount; i++) {
        pageList.push({
          pageNumber: i,
          selected: true
        });
      }
      setPages(pageList);
    } catch (error) {
      toast({
        title: "Error loading PDF",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const convertToImages = async () => {
    if (!file || pages.length === 0) return;

    setConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const selectedPages = pages.filter(page => page.selected);
      
      if (selectedPages.length === 0) {
        toast({
          title: "No pages selected",
          description: "Please select at least one page to convert.",
          variant: "destructive",
        });
        return;
      }

      const images = [];
      const dpi = parseInt(resolution);
      const scale = dpi / 72; // PDF default DPI is 72

      for (const pageInfo of selectedPages) {
        const page = await pdf.getPage(pageInfo.pageNumber);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert canvas to blob
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, `image/${format}`, quality[0] / 100);
        });

        images.push({
          blob,
          filename: `page-${pageInfo.pageNumber}.${format}`
        });
      }

      // Download images
      if (images.length === 1) {
        saveAs(images[0].blob, images[0].filename);
      } else {
        // Create ZIP file for multiple images
        const zip = new JSZip();
        images.forEach(image => {
          zip.file(image.filename, image.blob);
        });
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `pdf-pages.zip`);
      }

      toast({
        title: "Conversion successful!",
        description: `Successfully converted ${images.length} page(s) to ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConverting(false);
    }
  };

  const togglePageSelection = (pageNumber) => {
    setPages(prev => prev.map(page => 
      page.pageNumber === pageNumber 
        ? { ...page, selected: !page.selected }
        : page
    ));
  };

  const selectAllPages = () => {
    setPages(prev => prev.map(page => ({ ...page, selected: true })));
  };

  const deselectAllPages = () => {
    setPages(prev => prev.map(page => ({ ...page, selected: false })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-file-image text-red-400"></i>
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to convert pages to JPG images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pdf-upload">Choose PDF File</Label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="mt-1"
                data-testid="input-pdf-upload"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Settings</CardTitle>
            <CardDescription>
              Customize the output format and quality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Output Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger data-testid="select-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Resolution (DPI)</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger data-testid="select-resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="72">72 DPI (Web)</SelectItem>
                    <SelectItem value="150">150 DPI (Standard)</SelectItem>
                    <SelectItem value="300">300 DPI (High Quality)</SelectItem>
                    <SelectItem value="600">600 DPI (Print Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {format === 'jpeg' && (
              <div>
                <Label>JPEG Quality: {quality[0]}%</Label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="mt-2"
                  data-testid="slider-quality"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Lower size</span>
                  <span>Higher quality</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Page Selection */}
      {pages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Pages</CardTitle>
            <CardDescription>
              Choose which pages to convert to images
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllPages}
                data-testid="button-select-all"
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={deselectAllPages}
                data-testid="button-deselect-all"
              >
                Deselect All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {pages.map((page) => (
                <div
                  key={page.pageNumber}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    page.selected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => togglePageSelection(page.pageNumber)}
                  data-testid={`page-${page.pageNumber}`}
                >
                  <div className="flex flex-col items-center">
                    <i className="fas fa-file-alt text-2xl mb-2 text-gray-400"></i>
                    <span className="text-sm font-medium">Page {page.pageNumber}</span>
                    {page.selected && (
                      <i className="fas fa-check-circle text-blue-500 mt-1"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convert Button */}
      {file && pages.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={convertToImages}
            disabled={converting || pages.filter(p => p.selected).length === 0}
            size="lg"
            className="px-8"
            data-testid="button-convert"
          >
            {converting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Converting...
              </>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>
                Convert & Download
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Convert PDF to JPG</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload PDF File</h4>
                <p className="text-sm text-muted-foreground">Select your PDF document from your device</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Settings</h4>
                <p className="text-sm text-muted-foreground">Select format, resolution, and quality preferences</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Select Pages</h4>
                <p className="text-sm text-muted-foreground">Choose which pages to convert to images</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Images</h4>
                <p className="text-sm text-muted-foreground">Get individual images or a ZIP file with all converted pages</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}