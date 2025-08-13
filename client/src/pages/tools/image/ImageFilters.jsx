import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function ImageFilters() {
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Filter values
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [hue, setHue] = useState([0]);
  const [blur, setBlur] = useState([0]);
  const [sepia, setSepia] = useState([0]);
  const [grayscale, setGrayscale] = useState([0]);
  const [invert, setInvert] = useState([0]);
  
  // Color adjustments
  const [exposure, setExposure] = useState([0]);
  const [shadows, setShadows] = useState([0]);
  const [highlights, setHighlights] = useState([0]);
  const [warmth, setWarmth] = useState([0]);
  const [vignette, setVignette] = useState([0]);

  const canvasRef = useRef(null);
  const originalImageRef = useRef(null);
  const { toast } = useToast();

  const presetFilters = {
    'normal': { name: 'Normal', brightness: 100, contrast: 100, saturation: 100, sepia: 0, grayscale: 0 },
    'vintage': { name: 'Vintage', brightness: 110, contrast: 120, saturation: 80, sepia: 30, grayscale: 0 },
    'bw': { name: 'Black & White', brightness: 100, contrast: 110, saturation: 0, sepia: 0, grayscale: 100 },
    'sepia': { name: 'Sepia', brightness: 110, contrast: 90, saturation: 80, sepia: 100, grayscale: 0 },
    'dramatic': { name: 'Dramatic', brightness: 90, contrast: 150, saturation: 120, sepia: 0, grayscale: 0 },
    'cool': { name: 'Cool', brightness: 105, contrast: 110, saturation: 90, sepia: 0, grayscale: 0 },
    'warm': { name: 'Warm', brightness: 115, contrast: 105, saturation: 110, sepia: 20, grayscale: 0 },
    'faded': { name: 'Faded', brightness: 120, contrast: 80, saturation: 70, sepia: 15, grayscale: 0 }
  };

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          file,
          url: e.target.result,
          width: img.width,
          height: img.height
        });
        originalImageRef.current = img;
        applyFilters(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const applyFilters = useCallback((img = originalImageRef.current) => {
    if (!img || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Apply CSS filters
    const filters = [
      `brightness(${brightness[0]}%)`,
      `contrast(${contrast[0]}%)`,
      `saturate(${saturation[0]}%)`,
      `hue-rotate(${hue[0]}deg)`,
      `blur(${blur[0]}px)`,
      `sepia(${sepia[0]}%)`,
      `grayscale(${grayscale[0]}%)`,
      `invert(${invert[0]}%)`
    ].join(' ');
    
    ctx.filter = filters;
    ctx.drawImage(img, 0, 0);
    
    // Apply custom effects if any
    if (vignette[0] > 0) {
      applyVignette(ctx, canvas.width, canvas.height, vignette[0]);
    }
    
  }, [brightness, contrast, saturation, hue, blur, sepia, grayscale, invert, vignette]);

  const applyVignette = (ctx, width, height, intensity) => {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity / 100})`);
    
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };

  useEffect(() => {
    if (image) {
      applyFilters();
    }
  }, [image, applyFilters]);

  const applyPreset = (presetKey) => {
    const preset = presetFilters[presetKey];
    setBrightness([preset.brightness]);
    setContrast([preset.contrast]);
    setSaturation([preset.saturation]);
    setSepia([preset.sepia]);
    setGrayscale([preset.grayscale]);
    setHue([0]);
    setBlur([0]);
    setInvert([0]);
    setVignette([0]);
  };

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setHue([0]);
    setBlur([0]);
    setSepia([0]);
    setGrayscale([0]);
    setInvert([0]);
    setExposure([0]);
    setShadows([0]);
    setHighlights([0]);
    setWarmth([0]);
    setVignette([0]);
  };

  const downloadImage = async () => {
    if (!canvasRef.current) return;

    setProcessing(true);
    try {
      canvasRef.current.toBlob((blob) => {
        const filename = image.file.name.replace(/\.[^/.]+$/, '_filtered.png');
        saveAs(blob, filename);
        
        toast({
          title: "Download started",
          description: `Downloading ${filename}`,
        });
        
        setProcessing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "An error occurred while preparing the download.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-adjust text-green-400"></i>
            Upload Image
          </CardTitle>
          <CardDescription>
            Select an image to apply professional filters and effects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Choose Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
                data-testid="input-image-upload"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Live preview of your image with applied filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {/* Original vs Filtered */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Original</h4>
                      <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <img
                          src={image.url}
                          alt="Original"
                          className="w-full h-auto max-h-64 object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Filtered</h4>
                      <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <canvas
                          ref={canvasRef}
                          className="w-full h-auto max-h-64 object-contain"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Dimensions: {image.width} × {image.height} pixels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter Presets</CardTitle>
                <CardDescription>
                  Quick filter presets for common effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(presetFilters).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(key)}
                      className="text-xs"
                      data-testid={`preset-${key}`}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full"
                    data-testid="button-reset"
                  >
                    <i className="fas fa-undo mr-2"></i>
                    Reset All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adjust Filters</CardTitle>
                <CardDescription>
                  Fine-tune individual filter settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic" data-testid="tab-basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced" data-testid="tab-advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div>
                      <Label>Brightness: {brightness[0]}%</Label>
                      <Slider
                        value={brightness}
                        onValueChange={setBrightness}
                        max={200}
                        min={0}
                        step={1}
                        className="mt-2"
                        data-testid="slider-brightness"
                      />
                    </div>

                    <div>
                      <Label>Contrast: {contrast[0]}%</Label>
                      <Slider
                        value={contrast}
                        onValueChange={setContrast}
                        max={200}
                        min={0}
                        step={1}
                        className="mt-2"
                        data-testid="slider-contrast"
                      />
                    </div>

                    <div>
                      <Label>Saturation: {saturation[0]}%</Label>
                      <Slider
                        value={saturation}
                        onValueChange={setSaturation}
                        max={200}
                        min={0}
                        step={1}
                        className="mt-2"
                        data-testid="slider-saturation"
                      />
                    </div>

                    <div>
                      <Label>Hue: {hue[0]}°</Label>
                      <Slider
                        value={hue}
                        onValueChange={setHue}
                        max={360}
                        min={-360}
                        step={1}
                        className="mt-2"
                        data-testid="slider-hue"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div>
                      <Label>Blur: {blur[0]}px</Label>
                      <Slider
                        value={blur}
                        onValueChange={setBlur}
                        max={10}
                        min={0}
                        step={0.1}
                        className="mt-2"
                        data-testid="slider-blur"
                      />
                    </div>

                    <div>
                      <Label>Sepia: {sepia[0]}%</Label>
                      <Slider
                        value={sepia}
                        onValueChange={setSepia}
                        max={100}
                        min={0}
                        step={1}
                        className="mt-2"
                        data-testid="slider-sepia"
                      />
                    </div>

                    <div>
                      <Label>Grayscale: {grayscale[0]}%</Label>
                      <Slider
                        value={grayscale}
                        onValueChange={setGrayscale}
                        max={100}
                        min={0}
                        step={1}
                        className="mt-2"
                        data-testid="slider-grayscale"
                      />
                    </div>

                    <div>
                      <Label>Invert: {invert[0]}%</Label>
                      <Slider
                        value={invert}
                        onValueChange={setInvert}
                        max={100}
                        min={0}
                        step={1}
                        className="mt-2"
                        data-testid="slider-invert"
                      />
                    </div>

                    <div>
                      <Label>Vignette: {vignette[0]}%</Label>
                      <Slider
                        value={vignette}
                        onValueChange={setVignette}
                        max={100}
                        min={0}
                        step={1}
                        className="mt-2"
                        data-testid="slider-vignette"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t">
                  <Button
                    onClick={downloadImage}
                    disabled={processing}
                    className="w-full"
                    size="lg"
                    data-testid="button-download"
                  >
                    {processing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download mr-2"></i>
                        Download Filtered Image
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Apply Image Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload Image</h4>
                <p className="text-sm text-muted-foreground">Select an image file from your device</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Preset or Customize</h4>
                <p className="text-sm text-muted-foreground">Apply a quick preset or adjust individual filter settings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Preview Changes</h4>
                <p className="text-sm text-muted-foreground">See real-time preview of your filter adjustments</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Result</h4>
                <p className="text-sm text-muted-foreground">Save your enhanced image with applied filters</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Guide</CardTitle>
          <CardDescription>
            Understanding different filter effects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-600">Brightness</h4>
                <p className="text-sm text-muted-foreground">Controls overall lightness of the image</p>
              </div>
              <div>
                <h4 className="font-medium text-green-600">Contrast</h4>
                <p className="text-sm text-muted-foreground">Adjusts difference between light and dark areas</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-600">Saturation</h4>
                <p className="text-sm text-muted-foreground">Controls color intensity and vibrancy</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-600">Sepia</h4>
                <p className="text-sm text-muted-foreground">Applies warm, vintage brown tone effect</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-red-600">Hue</h4>
                <p className="text-sm text-muted-foreground">Shifts all colors around the color wheel</p>
              </div>
              <div>
                <h4 className="font-medium text-indigo-600">Blur</h4>
                <p className="text-sm text-muted-foreground">Applies gaussian blur for soft focus effect</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Grayscale</h4>
                <p className="text-sm text-muted-foreground">Converts image to black and white</p>
              </div>
              <div>
                <h4 className="font-medium text-pink-600">Vignette</h4>
                <p className="text-sm text-muted-foreground">Darkens edges to focus attention on center</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}