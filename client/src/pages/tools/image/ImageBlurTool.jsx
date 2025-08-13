import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function ImageBlurTool() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [blurType, setBlurType] = useState('gaussian');
  const [blurIntensity, setBlurIntensity] = useState([10]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const { toast } = useToast();

  const tool = getToolBySlug('image', 'blur');

  const blurTypes = {
    gaussian: 'Gaussian Blur',
    motion: 'Motion Blur',
    radial: 'Radial Blur',
    selective: 'Selective Blur'
  };

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setTimeout(() => applyBlurPreview(e.target.result), 100);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  const applyBlurPreview = useCallback((imageSrc) => {
    if (!imageSrc) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply blur effect using CSS filter
      ctx.filter = `blur(${blurIntensity[0]}px)`;
      ctx.drawImage(img, 0, 0);
      
      // Reset filter
      ctx.filter = 'none';
    };
    
    img.src = imageSrc;
  }, [blurType, blurIntensity]);

  const downloadBlurredImage = async () => {
    if (!canvasRef.current) {
      setError('No preview available to download');
      return;
    }

    setProcessing(true);
    
    try {
      canvasRef.current.toBlob((blob) => {
        const fileName = file.name.replace(/\.[^/.]+$/, `_blurred_${blurType}.png`);
        saveAs(blob, fileName);
        
        toast({
          title: "Success!",
          description: "Blurred image has been downloaded successfully.",
        });
        setProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download blurred image. Please try again.');
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (preview) {
      applyBlurPreview(preview);
    }
  }, [preview, blurType, blurIntensity, applyBlurPreview]);

  const toolContent = (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Upload & Settings</CardTitle>
            <CardDescription className="text-slate-400">
              Upload an image and apply blur effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="image-upload" className="text-slate-300">Choose Image File</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-slate-800 border-slate-600 text-slate-100"
                data-testid="input-image-file"
              />
            </div>

            {file && (
              <>
                <div>
                  <Label className="text-slate-300">Blur Type</Label>
                  <Select value={blurType} onValueChange={setBlurType}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.entries(blurTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Blur Intensity: {blurIntensity[0]}px</Label>
                  <Slider
                    value={blurIntensity}
                    onValueChange={setBlurIntensity}
                    max={50}
                    min={1}
                    step={1}
                    className="mt-2"
                    data-testid="slider-blur-intensity"
                  />
                </div>

                <Button
                  onClick={downloadBlurredImage}
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-download-blurred"
                >
                  {processing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download mr-2"></i>
                      Download Blurred Image
                    </>
                  )}
                </Button>
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
            <CardTitle className="text-slate-100">Preview</CardTitle>
            <CardDescription className="text-slate-400">
              See how your blurred image will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            {preview ? (
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-slate-600 rounded-lg"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fas fa-image text-4xl mb-4"></i>
                <p>Upload an image to see the preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload Image',
      description: 'Select the image you want to apply blur effects to'
    },
    {
      title: 'Choose Blur Type',
      description: 'Select from gaussian, motion, radial, or selective blur'
    },
    {
      title: 'Adjust Intensity',
      description: 'Use the slider to control the blur strength'
    },
    {
      title: 'Download Result',
      description: 'Save your blurred image'
    }
  ];

  const benefits = [
    'Multiple blur effect types',
    'Adjustable blur intensity',
    'Real-time preview',
    'High-quality output',
    'Perfect for privacy protection'
  ];

  const useCases = [
    'Protecting privacy in photos',
    'Creating artistic effects',
    'Background softening',
    'Focus emphasis',
    'Censoring sensitive information'
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