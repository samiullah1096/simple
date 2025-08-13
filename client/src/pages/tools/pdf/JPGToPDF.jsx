import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function JPGToPDF() {
  const [images, setImages] = useState([]);
  const [converting, setConverting] = useState(false);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [margin, setMargin] = useState([20]);
  const [fitMode, setFitMode] = useState('fit');
  const { toast } = useToast();

  const pageSizes = {
    'A4': { width: 595, height: 842 },
    'A3': { width: 842, height: 1191 },
    'A5': { width: 420, height: 595 },
    'Letter': { width: 612, height: 792 },
    'Legal': { width: 612, height: 1008 },
    'Custom': { width: 595, height: 842 }
  };

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));

    if (validImages.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only image files are allowed.",
        variant: "destructive",
      });
    }

    const newImages = validImages.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      order: images.length + index
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [images.length, toast]);

  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Clean up URL
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return filtered;
    });
  };

  const moveImage = (fromIndex, toIndex) => {
    setImages(prev => {
      const newImages = [...prev];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return newImages.map((img, index) => ({ ...img, order: index }));
    });
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please add at least one image to create a PDF.",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      // Get page dimensions
      let { width, height } = pageSizes[pageSize];
      if (orientation === 'landscape') {
        [width, height] = [height, width];
      }

      const marginValue = margin[0];

      for (const image of images) {
        const page = pdfDoc.addPage([width, height]);
        
        // Read image file
        const imageBytes = await image.file.arrayBuffer();
        let embeddedImage;

        // Embed image based on type
        if (image.file.type.includes('jpeg') || image.file.type.includes('jpg')) {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (image.file.type.includes('png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Convert other formats to PNG using canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = image.url;
          });

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const pngDataUrl = canvas.toDataURL('image/png');
          const pngBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
          embeddedImage = await pdfDoc.embedPng(pngBytes);
        }

        const { width: imgWidth, height: imgHeight } = embeddedImage.scale(1);
        
        // Calculate dimensions based on fit mode
        let drawWidth, drawHeight, x, y;
        const availableWidth = width - (marginValue * 2);
        const availableHeight = height - (marginValue * 2);

        if (fitMode === 'fit') {
          // Fit image within page while maintaining aspect ratio
          const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
          drawWidth = imgWidth * scale;
          drawHeight = imgHeight * scale;
          x = marginValue + (availableWidth - drawWidth) / 2;
          y = marginValue + (availableHeight - drawHeight) / 2;
        } else if (fitMode === 'fill') {
          // Fill page, may crop image
          const scale = Math.max(availableWidth / imgWidth, availableHeight / imgHeight);
          drawWidth = imgWidth * scale;
          drawHeight = imgHeight * scale;
          x = marginValue + (availableWidth - drawWidth) / 2;
          y = marginValue + (availableHeight - drawHeight) / 2;
        } else { // stretch
          // Stretch to fill entire available area
          drawWidth = availableWidth;
          drawHeight = availableHeight;
          x = marginValue;
          y = marginValue;
        }

        page.drawImage(embeddedImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'images-to-pdf.pdf');

      toast({
        title: "PDF created successfully!",
        description: `Successfully converted ${images.length} image(s) to PDF.`,
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-images text-red-400"></i>
            Upload Images
          </CardTitle>
          <CardDescription>
            Select multiple images to convert to a single PDF document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Choose Images</Label>
              <Input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
                data-testid="input-image-upload"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPG, PNG, WebP, and other image formats
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Settings */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>PDF Settings</CardTitle>
            <CardDescription>
              Customize your PDF output preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Page Size</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger data-testid="select-page-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                    <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                    <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
                    <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                    <SelectItem value="Legal">Legal (8.5 × 14 in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Orientation</Label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger data-testid="select-orientation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Image Fit Mode</Label>
                <Select value={fitMode} onValueChange={setFitMode}>
                  <SelectTrigger data-testid="select-fit-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fit">Fit (Maintain aspect ratio)</SelectItem>
                    <SelectItem value="fill">Fill (May crop image)</SelectItem>
                    <SelectItem value="stretch">Stretch (Fill page)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Page Margin: {margin[0]}mm</Label>
                <Slider
                  value={margin}
                  onValueChange={setMargin}
                  max={50}
                  min={0}
                  step={5}
                  className="mt-2"
                  data-testid="slider-margin"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview and Ordering */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Image Order</CardTitle>
            <CardDescription>
              Drag and drop to reorder images in your PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
                  data-testid={`image-preview-${index}`}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs truncate font-medium">{image.name}</p>
                    <p className="text-xs text-muted-foreground">Page {index + 1}</p>
                  </div>
                  
                  {/* Controls */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                        onClick={() => moveImage(index, index - 1)}
                        data-testid={`button-move-up-${index}`}
                      >
                        <i className="fas fa-chevron-up text-xs"></i>
                      </Button>
                    )}
                    {index < images.length - 1 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                        onClick={() => moveImage(index, index + 1)}
                        data-testid={`button-move-down-${index}`}
                      >
                        <i className="fas fa-chevron-down text-xs"></i>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      onClick={() => removeImage(image.id)}
                      data-testid={`button-remove-${index}`}
                    >
                      <i className="fas fa-times text-xs"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convert Button */}
      {images.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={convertToPDF}
            disabled={converting}
            size="lg"
            className="px-8"
            data-testid="button-convert"
          >
            {converting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating PDF...
              </>
            ) : (
              <>
                <i className="fas fa-file-pdf mr-2"></i>
                Create PDF ({images.length} image{images.length > 1 ? 's' : ''})
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Convert Images to PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Images</h4>
                <p className="text-sm text-muted-foreground">Select multiple images from your device</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Configure Settings</h4>
                <p className="text-sm text-muted-foreground">Choose page size, orientation, and image fitting options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Arrange Order</h4>
                <p className="text-sm text-muted-foreground">Reorder images as they should appear in the PDF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download PDF</h4>
                <p className="text-sm text-muted-foreground">Get your combined PDF document with all images</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}