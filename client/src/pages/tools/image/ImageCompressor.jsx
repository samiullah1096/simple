import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function ImageCompressor() {
  const [images, setImages] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState('original');
  const [maxWidth, setMaxWidth] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [compressionProgress, setCompressionProgress] = useState(0);
  const { toast } = useToast();

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
      originalSize: file.size,
      originalFormat: file.type,
      url: URL.createObjectURL(file),
      compressed: null,
      compressedSize: null,
      compressionRatio: null
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [toast]);

  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
        if (imageToRemove.compressed) {
          URL.revokeObjectURL(imageToRemove.compressed);
        }
      }
      return filtered;
    });
  };

  const compressImage = async (imageData) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions if max width/height specified
        let { width, height } = img;
        
        if (maxWidth && width > parseInt(maxWidth)) {
          height = (height * parseInt(maxWidth)) / width;
          width = parseInt(maxWidth);
        }
        
        if (maxHeight && height > parseInt(maxHeight)) {
          width = (width * parseInt(maxHeight)) / height;
          height = parseInt(maxHeight);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output format
        let outputFormat = imageData.originalFormat;
        if (format !== 'original') {
          outputFormat = `image/${format}`;
        }

        // Convert to blob with compression
        const qualityValue = format === 'png' ? undefined : quality[0] / 100;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressionRatio = ((imageData.originalSize - blob.size) / imageData.originalSize * 100).toFixed(1);
              resolve({
                blob,
                size: blob.size,
                compressionRatio: parseFloat(compressionRatio),
                url: URL.createObjectURL(blob)
              });
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          outputFormat,
          qualityValue
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageData.url;
    });
  };

  const compressAllImages = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please add at least one image to compress.",
        variant: "destructive",
      });
      return;
    }

    setCompressing(true);
    setCompressionProgress(0);
    
    const totalImages = images.length;
    let processedImages = 0;

    try {
      const compressedImages = [];

      for (const image of images) {
        try {
          const compressed = await compressImage(image);
          const updatedImage = {
            ...image,
            compressed: compressed.url,
            compressedSize: compressed.size,
            compressionRatio: compressed.compressionRatio,
            compressedBlob: compressed.blob
          };
          compressedImages.push(updatedImage);
          
          processedImages++;
          setCompressionProgress((processedImages / totalImages) * 100);
        } catch (error) {
          console.error(`Error compressing ${image.name}:`, error);
          compressedImages.push(image); // Keep original if compression fails
          processedImages++;
          setCompressionProgress((processedImages / totalImages) * 100);
        }
      }

      setImages(compressedImages);
      
      const successfulCompressions = compressedImages.filter(img => img.compressed).length;
      toast({
        title: "Compression completed!",
        description: `Successfully compressed ${successfulCompressions} out of ${totalImages} image(s).`,
      });

    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression failed",
        description: "An error occurred during compression. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompressing(false);
      setCompressionProgress(0);
    }
  };

  const downloadImage = (image) => {
    if (!image.compressedBlob) return;

    let filename = image.name;
    if (format !== 'original') {
      const nameWithoutExt = image.name.replace(/\.[^/.]+$/, '');
      filename = `${nameWithoutExt}_compressed.${format === 'jpeg' ? 'jpg' : format}`;
    } else {
      filename = image.name.replace(/(\.[^/.]+)$/, '_compressed$1');
    }

    saveAs(image.compressedBlob, filename);
    
    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const downloadAllCompressed = async () => {
    const compressedImages = images.filter(img => img.compressedBlob);
    
    if (compressedImages.length === 0) {
      toast({
        title: "No compressed images",
        description: "Please compress images first before downloading.",
        variant: "destructive",
      });
      return;
    }

    if (compressedImages.length === 1) {
      downloadImage(compressedImages[0]);
      return;
    }

    // For multiple images, download them one by one
    for (const image of compressedImages) {
      downloadImage(image);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const clearAllImages = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.url);
      if (image.compressed) {
        URL.revokeObjectURL(image.compressed);
      }
    });
    setImages([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateTotalSavings = () => {
    const compressedImages = images.filter(img => img.compressedSize !== null);
    if (compressedImages.length === 0) return { original: 0, compressed: 0, savings: 0 };

    const totalOriginal = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
    const totalCompressed = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
    const savings = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);

    return {
      original: totalOriginal,
      compressed: totalCompressed,
      savings: parseFloat(savings)
    };
  };

  const totalSavings = calculateTotalSavings();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-compress text-green-400"></i>
            Upload Images
          </CardTitle>
          <CardDescription>
            Select multiple images to compress and reduce file sizes
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
                Supports JPEG, PNG, WebP, and other image formats
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compression Settings */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compression Settings</CardTitle>
            <CardDescription>
              Adjust quality and output format for optimal compression
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
                    <SelectItem value="original">Keep Original Format</SelectItem>
                    <SelectItem value="jpeg">JPEG (Smaller, lossy)</SelectItem>
                    <SelectItem value="png">PNG (Larger, lossless)</SelectItem>
                    <SelectItem value="webp">WebP (Modern, efficient)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {format !== 'png' && (
                <div>
                  <Label>Quality: {quality[0]}%</Label>
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
                    <span>Smaller size</span>
                    <span>Better quality</span>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="max-width">Max Width (px)</Label>
                <Input
                  id="max-width"
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  placeholder="Original width"
                  className="mt-1"
                  data-testid="input-max-width"
                />
              </div>

              <div>
                <Label htmlFor="max-height">Max Height (px)</Label>
                <Input
                  id="max-height"
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                  placeholder="Original height"
                  className="mt-1"
                  data-testid="input-max-height"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Compression Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• JPEG: Best for photos, smaller files, some quality loss</li>
                <li>• PNG: Best for graphics with transparency, larger files</li>
                <li>• WebP: Modern format with excellent compression and quality</li>
                <li>• Lower quality = smaller file size but reduced image quality</li>
                <li>• Setting max dimensions will resize images proportionally</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compression Progress */}
      {compressing && (
        <Card>
          <CardHeader>
            <CardTitle>Compressing Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={compressionProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(compressionProgress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compression Summary */}
      {images.some(img => img.compressedSize !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>Compression Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {images.filter(img => img.compressedSize !== null).length}
                </div>
                <div className="text-sm text-muted-foreground">Images Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {formatFileSize(totalSavings.original)}
                </div>
                <div className="text-sm text-muted-foreground">Original Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {formatFileSize(totalSavings.compressed)}
                </div>
                <div className="text-sm text-muted-foreground">Compressed Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">
                  {totalSavings.savings}%
                </div>
                <div className="text-sm text-muted-foreground">Space Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images List */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Images ({images.length})</span>
              <div className="flex gap-2">
                {images.some(img => img.compressedBlob) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAllCompressed}
                    data-testid="button-download-all"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download All
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllImages}
                  data-testid="button-clear-all"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                  data-testid={`image-item-${index}`}
                >
                  <div className="flex gap-4">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    {image.compressed && (
                      <img
                        src={image.compressed}
                        alt={`${image.name} compressed`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{image.name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Original:</span>
                        <span>{formatFileSize(image.originalSize)}</span>
                      </div>
                      {image.compressedSize !== null && (
                        <>
                          <div className="flex justify-between">
                            <span>Compressed:</span>
                            <span>{formatFileSize(image.compressedSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Savings:</span>
                            <span className={image.compressionRatio > 0 ? 'text-green-600' : 'text-red-600'}>
                              {image.compressionRatio > 0 ? '-' : '+'}{Math.abs(image.compressionRatio)}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {image.compressedBlob ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadImage(image)}
                        data-testid={`button-download-${index}`}
                      >
                        <i className="fas fa-download mr-2"></i>
                        Download
                      </Button>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Not compressed
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      data-testid={`button-remove-${index}`}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compress Button */}
      {images.length > 0 && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={compressAllImages}
            disabled={compressing}
            size="lg"
            className="px-8"
            data-testid="button-compress-all"
          >
            {compressing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Compressing...
              </>
            ) : (
              <>
                <i className="fas fa-compress mr-2"></i>
                Compress All Images
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Compress Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Images</h4>
                <p className="text-sm text-muted-foreground">Select multiple images you want to compress</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Adjust Settings</h4>
                <p className="text-sm text-muted-foreground">Choose quality, format, and maximum dimensions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Compress Images</h4>
                <p className="text-sm text-muted-foreground">Click compress to process all images at once</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Results</h4>
                <p className="text-sm text-muted-foreground">Download individual images or all compressed images</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}