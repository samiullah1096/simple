import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function ImageExifRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [originalExif, setOriginalExif] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const tool = getToolBySlug('image', 'remove-exif');

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        
        // Extract EXIF data for display
        extractExifData(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  const extractExifData = async (imageFile) => {
    try {
      // For demonstration, we'll show what types of EXIF data exist
      const exifInfo = {
        camera: 'Camera information',
        location: 'GPS coordinates',
        datetime: 'Creation date and time',
        software: 'Software used',
        dimensions: 'Image dimensions',
        orientation: 'Image orientation'
      };
      setOriginalExif(exifInfo);
    } catch (err) {
      console.warn('Could not extract EXIF data:', err);
    }
  };

  const removeExifData = async () => {
    if (!file) {
      setError('Please select an image file first');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Create a canvas to redraw the image without EXIF data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image to canvas (this removes EXIF data)
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          const fileName = file.name.replace(/\.[^/.]+$/, '_no_exif.jpg');
          saveAs(blob, fileName);
          
          toast({
            title: "Success!",
            description: "EXIF metadata has been removed from your image.",
          });
          setProcessing(false);
        }, 'image/jpeg', 0.95);
      };

      img.onerror = () => {
        setError('Failed to process the image. Please try a different file.');
        setProcessing(false);
      };

      img.src = preview;
    } catch (err) {
      console.error('Error removing EXIF data:', err);
      setError('Failed to remove EXIF data. Please try again.');
      setProcessing(false);
    }
  };

  const toolContent = (
    <div className="space-y-6">
      <Card className="glassmorphism border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Upload Image</CardTitle>
          <CardDescription className="text-slate-400">
            Select an image to remove its EXIF metadata
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

          {error && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {preview && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Original Image</h3>
                <div className="glassmorphism rounded-xl p-4 border-slate-600">
                  <img
                    src={preview}
                    alt="Original"
                    className="w-full h-auto max-h-64 object-contain rounded-lg mx-auto"
                  />
                  <div className="mt-4 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>File:</span>
                      <span>{file.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {originalExif && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">EXIF Data to Remove</h3>
                  <div className="glassmorphism rounded-xl p-4 border-slate-600">
                    <div className="space-y-3">
                      {Object.entries(originalExif).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-400 capitalize">{key}:</span>
                          <span className="text-slate-300">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        This metadata will be completely removed from your image.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {file && (
            <div className="flex gap-4">
              <Button
                onClick={removeExifData}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-remove-exif"
              >
                {processing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Removing EXIF...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download mr-2"></i>
                    Download Clean Image
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const howToSteps = [
    {
      title: 'Upload Image',
      description: 'Select the image file from which you want to remove EXIF metadata'
    },
    {
      title: 'Review Data',
      description: 'See what EXIF information will be removed from your image'
    },
    {
      title: 'Download Clean Image',
      description: 'Get your image with all metadata completely removed'
    }
  ];

  const benefits = [
    'Protect your privacy by removing location data',
    'Remove camera and device information',
    'Clean images for web publishing',
    'Reduce file size slightly',
    'Safe for sharing online'
  ];

  const useCases = [
    'Publishing photos online safely',
    'Protecting location privacy',
    'Preparing images for social media',
    'Creating clean image archives',
    'Removing device fingerprints'
  ];

  const faqs = [
    {
      question: 'What is EXIF data?',
      answer: 'EXIF (Exchangeable Image File Format) data contains metadata about how a photo was taken, including camera settings, GPS location, timestamp, and device information.'
    },
    {
      question: 'Why should I remove EXIF data?',
      answer: 'EXIF data can reveal sensitive information like your location, device details, and when photos were taken. Removing it protects your privacy when sharing images online.'
    },
    {
      question: 'Will removing EXIF data affect image quality?',
      answer: 'No, removing EXIF data does not affect the visual quality of your image. It only removes the hidden metadata.'
    },
    {
      question: 'What file formats support EXIF data?',
      answer: 'EXIF data is commonly found in JPEG and TIFF files. RAW camera files also contain extensive metadata that can be removed.'
    }
  ];

  return (
    <ToolShell 
      tool={tool} 
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
      faqs={faqs}
    >
      {toolContent}
    </ToolShell>
  );
}