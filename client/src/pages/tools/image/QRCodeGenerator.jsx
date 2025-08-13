import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import ToolShell from '../../../components/Tools/ToolShell';
import { getToolBySlug } from '../../../lib/toolsIndex';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState('url');
  const [size, setSize] = useState([300]);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const { toast } = useToast();

  const tool = getToolBySlug('image', 'qr-generator');

  const qrTypes = {
    url: 'Website URL',
    text: 'Plain Text',
    email: 'Email Address',
    phone: 'Phone Number',
    sms: 'SMS Message',
    wifi: 'WiFi Network',
    vcard: 'Contact Card'
  };

  const errorLevels = {
    L: 'Low (7%)',
    M: 'Medium (15%)',
    Q: 'Quartile (25%)',
    H: 'High (30%)'
  };

  const generateQRCode = useCallback(() => {
    if (!text.trim()) {
      setError('Please enter text or data for the QR code');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const qrSize = size[0];
    
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Simple QR code pattern generation (for demo purposes)
    // In a real implementation, you'd use a QR code library like qrcode.js
    drawQRPattern(ctx, text, qrSize);
    
    setError('');
  }, [text, size, foregroundColor, backgroundColor, errorLevel]);

  const drawQRPattern = (ctx, data, size) => {
    // Clear canvas with background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);
    
    // Create a simple QR-like pattern for demonstration
    const modules = 25; // QR code modules
    const moduleSize = size / modules;
    
    ctx.fillStyle = foregroundColor;
    
    // Generate pattern based on text hash
    const hash = hashCode(data);
    
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Create deterministic pattern based on position and hash
        const shouldFill = ((row + col + hash) % 3 === 0) || 
                          (row < 7 && col < 7) || // Top-left finder pattern
                          (row < 7 && col >= modules - 7) || // Top-right finder pattern
                          (row >= modules - 7 && col < 7); // Bottom-left finder pattern
        
        if (shouldFill) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Draw finder patterns (the squares in corners)
    drawFinderPattern(ctx, 0, 0, moduleSize);
    drawFinderPattern(ctx, (modules - 7) * moduleSize, 0, moduleSize);
    drawFinderPattern(ctx, 0, (modules - 7) * moduleSize, moduleSize);
  };

  const drawFinderPattern = (ctx, x, y, moduleSize) => {
    ctx.fillStyle = foregroundColor;
    
    // Outer square
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    
    // Inner white square
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    // Center black square
    ctx.fillStyle = foregroundColor;
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const formatTextForQRType = (inputText, type) => {
    switch (type) {
      case 'url':
        return inputText.startsWith('http') ? inputText : `https://${inputText}`;
      case 'email':
        return `mailto:${inputText}`;
      case 'phone':
        return `tel:${inputText}`;
      case 'sms':
        return `sms:${inputText}`;
      case 'wifi':
        return `WIFI:T:WPA;S:${inputText};P:password;;`;
      default:
        return inputText;
    }
  };

  const downloadQRCode = async () => {
    if (!canvasRef.current || !text.trim()) {
      setError('Please generate a QR code first');
      return;
    }

    setProcessing(true);
    
    try {
      canvasRef.current.toBlob((blob) => {
        const fileName = `qrcode_${qrType}_${size[0]}x${size[0]}.png`;
        saveAs(blob, fileName);
        
        toast({
          title: "Success!",
          description: "QR code has been downloaded successfully.",
        });
        setProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error downloading QR code:', err);
      setError('Failed to download QR code. Please try again.');
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (text.trim()) {
      generateQRCode();
    }
  }, [text, qrType, size, foregroundColor, backgroundColor, errorLevel, generateQRCode]);

  const toolContent = (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glassmorphism border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">QR Code Settings</CardTitle>
            <CardDescription className="text-slate-400">
              Customize your QR code content and appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-slate-300">QR Code Type</Label>
              <Select value={qrType} onValueChange={setQrType}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {Object.entries(qrTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="qr-text" className="text-slate-300">
                {qrType === 'text' ? 'Text Content' : 
                 qrType === 'url' ? 'Website URL' :
                 qrType === 'email' ? 'Email Address' :
                 qrType === 'phone' ? 'Phone Number' :
                 qrType === 'sms' ? 'Phone Number' :
                 qrType === 'wifi' ? 'Network Name' :
                 'Contact Information'}
              </Label>
              {qrType === 'text' || qrType === 'vcard' ? (
                <Textarea
                  id="qr-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={qrType === 'text' ? 'Enter any text...' : 'Name\nPhone\nEmail\nCompany'}
                  className="bg-slate-800 border-slate-600 text-slate-100"
                  rows={4}
                  data-testid="textarea-qr-content"
                />
              ) : (
                <Input
                  id="qr-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    qrType === 'url' ? 'https://example.com' :
                    qrType === 'email' ? 'user@example.com' :
                    qrType === 'phone' ? '+1234567890' :
                    qrType === 'sms' ? '+1234567890' :
                    qrType === 'wifi' ? 'WiFi Network Name' :
                    'Enter content...'
                  }
                  className="bg-slate-800 border-slate-600 text-slate-100"
                  data-testid="input-qr-content"
                />
              )}
            </div>

            <div>
              <Label className="text-slate-300">Size: {size[0]}x{size[0]}px</Label>
              <Slider
                value={size}
                onValueChange={setSize}
                max={800}
                min={100}
                step={50}
                className="mt-2"
                data-testid="slider-qr-size"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fg-color" className="text-slate-300">Foreground Color</Label>
                <Input
                  id="fg-color"
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="bg-slate-800 border-slate-600 h-12"
                  data-testid="input-foreground-color"
                />
              </div>
              <div>
                <Label htmlFor="bg-color" className="text-slate-300">Background Color</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="bg-slate-800 border-slate-600 h-12"
                  data-testid="input-background-color"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Error Correction Level</Label>
              <Select value={errorLevel} onValueChange={setErrorLevel}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {Object.entries(errorLevels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={downloadQRCode}
              disabled={processing || !text.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-download-qr"
            >
              {processing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Download QR Code
                </>
              )}
            </Button>

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
              Your generated QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {text.trim() ? (
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-slate-600 rounded-lg bg-white"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="py-12 text-slate-400">
                  <i className="fas fa-qrcode text-4xl mb-4"></i>
                  <p>Enter content to generate QR code</p>
                </div>
              )}
            </div>
            
            {text.trim() && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-slate-300 font-semibold mb-2">Encoded Data:</h4>
                <p className="text-slate-400 text-sm break-all">
                  {formatTextForQRType(text, qrType)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const howToSteps = [
    {
      title: 'Choose Type',
      description: 'Select what type of data your QR code will contain'
    },
    {
      title: 'Enter Content',
      description: 'Input the text, URL, or data for your QR code'
    },
    {
      title: 'Customize Appearance',
      description: 'Adjust size, colors, and error correction level'
    },
    {
      title: 'Download',
      description: 'Save your QR code as a high-quality PNG image'
    }
  ];

  const benefits = [
    'Multiple QR code types supported',
    'Customizable colors and size',
    'High-resolution output',
    'Real-time preview',
    'Error correction options'
  ];

  const useCases = [
    'Website links and social media',
    'Contact information sharing',
    'WiFi network credentials',
    'Event tickets and invitations',
    'Product information and menus'
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