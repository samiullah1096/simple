import React, { useState, useCallback } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function PDFWatermark() {
  const tool = TOOLS.pdf.find(t => t.slug === 'watermark');
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [watermarkType, setWatermarkType] = useState('text');
  
  // Text watermark settings
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState([36]);
  const [opacity, setOpacity] = useState([50]);
  const [rotation, setRotation] = useState([45]);
  const [textColor, setTextColor] = useState('#ff0000');
  
  // Position settings
  const [position, setPosition] = useState('center');
  const [xOffset, setXOffset] = useState([0]);
  const [yOffset, setYOffset] = useState([0]);
  
  // Image watermark settings
  const [imageFile, setImageFile] = useState(null);
  const [imageOpacity, setImageOpacity] = useState([50]);
  const [imageScale, setImageScale] = useState([100]);
  
  // Page settings
  const [applyToPages, setApplyToPages] = useState('all');
  const [pageRange, setPageRange] = useState('');

  const { toast } = useToast();

  const handleFileUpload = useCallback((event) => {
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
  }, [toast]);

  const handleImageUpload = useCallback((event) => {
    const uploadedImage = event.target.files[0];
    if (!uploadedImage) return;

    if (!uploadedImage.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(uploadedImage);
  }, [toast]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 0, b: 0 };
  };

  const getPosition = (pageWidth, pageHeight, watermarkWidth, watermarkHeight) => {
    const xOffsetValue = xOffset[0];
    const yOffsetValue = yOffset[0];
    
    switch (position) {
      case 'top-left':
        return { x: 50 + xOffsetValue, y: pageHeight - 50 - watermarkHeight + yOffsetValue };
      case 'top-center':
        return { x: (pageWidth - watermarkWidth) / 2 + xOffsetValue, y: pageHeight - 50 - watermarkHeight + yOffsetValue };
      case 'top-right':
        return { x: pageWidth - 50 - watermarkWidth + xOffsetValue, y: pageHeight - 50 - watermarkHeight + yOffsetValue };
      case 'center-left':
        return { x: 50 + xOffsetValue, y: (pageHeight - watermarkHeight) / 2 + yOffsetValue };
      case 'center':
        return { x: (pageWidth - watermarkWidth) / 2 + xOffsetValue, y: (pageHeight - watermarkHeight) / 2 + yOffsetValue };
      case 'center-right':
        return { x: pageWidth - 50 - watermarkWidth + xOffsetValue, y: (pageHeight - watermarkHeight) / 2 + yOffsetValue };
      case 'bottom-left':
        return { x: 50 + xOffsetValue, y: 50 + yOffsetValue };
      case 'bottom-center':
        return { x: (pageWidth - watermarkWidth) / 2 + xOffsetValue, y: 50 + yOffsetValue };
      case 'bottom-right':
        return { x: pageWidth - 50 - watermarkWidth + xOffsetValue, y: 50 + yOffsetValue };
      default:
        return { x: (pageWidth - watermarkWidth) / 2 + xOffsetValue, y: (pageHeight - watermarkHeight) / 2 + yOffsetValue };
    }
  };

  const parsePageRange = (range, totalPages) => {
    if (!range.trim()) return [];
    
    const pages = new Set();
    const parts = range.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= end && start >= 1 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            pages.add(i);
          }
        }
      } else {
        const pageNum = parseInt(trimmed);
        if (pageNum >= 1 && pageNum <= totalPages) {
          pages.add(pageNum);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const addWatermark = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file first.",
        variant: "destructive",
      });
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      toast({
        title: "No watermark text",
        description: "Please enter watermark text.",
        variant: "destructive",
      });
      return;
    }

    if (watermarkType === 'image' && !imageFile) {
      toast({
        title: "No image selected",
        description: "Please select an image for the watermark.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Determine which pages to apply watermark to
      let targetPages = [];
      if (applyToPages === 'all') {
        targetPages = pages.map((_, index) => index);
      } else if (applyToPages === 'range') {
        const pageNumbers = parsePageRange(pageRange, pages.length);
        targetPages = pageNumbers.map(num => num - 1); // Convert to 0-based index
      }

      if (targetPages.length === 0) {
        toast({
          title: "No pages selected",
          description: "Please specify valid pages to apply the watermark.",
          variant: "destructive",
        });
        return;
      }

      let embeddedImage = null;
      if (watermarkType === 'image') {
        const imageBytes = await imageFile.arrayBuffer();
        if (imageFile.type.includes('png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }
      }

      // Apply watermark to selected pages
      for (const pageIndex of targetPages) {
        const page = pages[pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        if (watermarkType === 'text') {
          const color = hexToRgb(textColor);
          const textWidth = watermarkText.length * fontSize[0] * 0.6; // Approximate text width
          const textHeight = fontSize[0];
          
          const pos = getPosition(pageWidth, pageHeight, textWidth, textHeight);
          
          page.drawText(watermarkText, {
            x: pos.x,
            y: pos.y,
            size: fontSize[0],
            color: rgb(color.r, color.g, color.b),
            opacity: opacity[0] / 100,
            rotate: degrees(rotation[0])
          });
        } else if (watermarkType === 'image' && embeddedImage) {
          const imageDims = embeddedImage.scale(imageScale[0] / 100);
          const pos = getPosition(pageWidth, pageHeight, imageDims.width, imageDims.height);
          
          page.drawImage(embeddedImage, {
            x: pos.x,
            y: pos.y,
            width: imageDims.width,
            height: imageDims.height,
            opacity: imageOpacity[0] / 100,
            rotate: degrees(rotation[0])
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const filename = file.name.replace(/\.pdf$/i, '_watermarked.pdf');
      saveAs(blob, filename);

      toast({
        title: "Watermark added successfully!",
        description: `Watermark applied to ${targetPages.length} page(s). File saved as "${filename}".`,
      });

    } catch (error) {
      console.error('Watermark error:', error);
      toast({
        title: "Failed to add watermark",
        description: "An error occurred while adding the watermark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-stamp text-red-400"></i>
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to add watermark
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

      {/* Watermark Settings */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Watermark Settings</CardTitle>
            <CardDescription>
              Configure your watermark appearance and placement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={watermarkType} onValueChange={setWatermarkType} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" data-testid="tab-text">Text Watermark</TabsTrigger>
                <TabsTrigger value="image" data-testid="tab-image">Image Watermark</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6">
                <div>
                  <Label htmlFor="watermark-text">Watermark Text</Label>
                  <Textarea
                    id="watermark-text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                    className="mt-1"
                    data-testid="input-watermark-text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Font Size: {fontSize[0]}px</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={100}
                      min={8}
                      step={2}
                      className="mt-2"
                      data-testid="slider-font-size"
                    />
                  </div>

                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="mt-1 h-10"
                      data-testid="input-text-color"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-6">
                <div>
                  <Label htmlFor="image-upload">Watermark Image</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1"
                    data-testid="input-image-upload"
                  />
                  {imageFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>

                {watermarkType === 'image' && (
                  <div>
                    <Label>Image Scale: {imageScale[0]}%</Label>
                    <Slider
                      value={imageScale}
                      onValueChange={setImageScale}
                      max={200}
                      min={10}
                      step={5}
                      className="mt-2"
                      data-testid="slider-image-scale"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Common Settings */}
            <div className="space-y-6 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Opacity: {watermarkType === 'text' ? opacity[0] : imageOpacity[0]}%</Label>
                  <Slider
                    value={watermarkType === 'text' ? opacity : imageOpacity}
                    onValueChange={watermarkType === 'text' ? setOpacity : setImageOpacity}
                    max={100}
                    min={10}
                    step={5}
                    className="mt-2"
                    data-testid="slider-opacity"
                  />
                </div>

                <div>
                  <Label>Rotation: {rotation[0]}°</Label>
                  <Slider
                    value={rotation}
                    onValueChange={setRotation}
                    max={360}
                    min={0}
                    step={15}
                    className="mt-2"
                    data-testid="slider-rotation"
                  />
                </div>
              </div>

              <div>
                <Label>Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="mt-1" data-testid="select-position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="center-left">Center Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="center-right">Center Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>X Offset: {xOffset[0]}px</Label>
                  <Slider
                    value={xOffset}
                    onValueChange={setXOffset}
                    max={200}
                    min={-200}
                    step={10}
                    className="mt-2"
                    data-testid="slider-x-offset"
                  />
                </div>

                <div>
                  <Label>Y Offset: {yOffset[0]}px</Label>
                  <Slider
                    value={yOffset}
                    onValueChange={setYOffset}
                    max={200}
                    min={-200}
                    step={10}
                    className="mt-2"
                    data-testid="slider-y-offset"
                  />
                </div>
              </div>
            </div>

            {/* Page Selection */}
            <div className="space-y-4 border-t pt-6">
              <div>
                <Label>Apply to Pages</Label>
                <Select value={applyToPages} onValueChange={setApplyToPages}>
                  <SelectTrigger className="mt-1" data-testid="select-apply-pages">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    <SelectItem value="range">Page Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {applyToPages === 'range' && (
                <div>
                  <Label htmlFor="page-range">Page Range</Label>
                  <Input
                    id="page-range"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g., 1-3, 5, 7-10"
                    className="mt-1"
                    data-testid="input-page-range"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Use comma-separated values and ranges (e.g., 1-3, 5, 7-10)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Watermark Button */}
      {file && (
        <div className="flex justify-center">
          <Button
            onClick={addWatermark}
            disabled={processing || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !imageFile)}
            size="lg"
            className="px-8"
            data-testid="button-add-watermark"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Adding Watermark...
              </>
            ) : (
              <>
                <i className="fas fa-stamp mr-2"></i>
                Add Watermark
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Add PDF Watermark</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload PDF</h4>
                <p className="text-sm text-muted-foreground">Select your PDF document to add watermark</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Watermark Type</h4>
                <p className="text-sm text-muted-foreground">Select text or image watermark and configure settings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Customize Appearance</h4>
                <p className="text-sm text-muted-foreground">Adjust opacity, rotation, position, and other settings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Watermarked PDF</h4>
                <p className="text-sm text-muted-foreground">Get your PDF with the applied watermark</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}