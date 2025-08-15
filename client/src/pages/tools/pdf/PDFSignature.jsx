import { useState, useRef, useCallback } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';
import { PDFDocument, rgb } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function PDFSignature() {
  const tool = TOOLS.pdf.find(t => t.slug === 'signature');
  const [file, setFile] = useState(null);
  const [signatureType, setSignatureType] = useState('draw');
  const [drawnSignature, setDrawnSignature] = useState(null);
  const [textSignature, setTextSignature] = useState('');
  const [signatureImage, setSignatureImage] = useState(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
    }
  }, []);

  const handleImageUpload = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignatureImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please select a valid image file for signature');
    }
  }, []);

  // Drawing functions
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      setDrawnSignature(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSignature(null);
  };

  const addSignatureToPDF = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    let signatureData = null;
    
    if (signatureType === 'draw' && drawnSignature) {
      signatureData = drawnSignature;
    } else if (signatureType === 'image' && signatureImage) {
      signatureData = signatureImage;
    } else if (signatureType === 'text' && textSignature.trim()) {
      // Create signature from text
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'black';
      ctx.font = '36px cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textSignature, canvas.width / 2, canvas.height / 2);
      
      signatureData = canvas.toDataURL();
    } else {
      setError('Please create a signature first');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Convert signature to image
      const signatureImageBytes = await fetch(signatureData).then(res => res.arrayBuffer());
      const signatureImg = await pdfDoc.embedPng(signatureImageBytes);
      
      // Get the first page (you can modify this to select specific pages)
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      // Calculate signature dimensions
      const signatureWidth = 150;
      const signatureHeight = (signatureImg.height / signatureImg.width) * signatureWidth;
      
      // Add signature to page
      firstPage.drawImage(signatureImg, {
        x: position.x,
        y: firstPage.getHeight() - position.y - signatureHeight,
        width: signatureWidth,
        height: signatureHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      const fileName = file.name.replace('.pdf', '_signed.pdf');
      saveAs(blob, fileName);
      
      toast({
        title: "Success!",
        description: "PDF has been signed successfully.",
      });
    } catch (err) {
      console.error('Error adding signature:', err);
      setError('Failed to add signature to PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const faqs = [
    {
      question: 'How do I sign PDF documents online for free?',
      answer: 'Upload your PDF file, create your signature by drawing, typing, or uploading an image, position it where needed, and download your signed document. All processing happens securely in your browser.'
    },
    {
      question: 'What signature methods are available?',
      answer: 'You can draw your signature with a mouse or touch device, type your name in a signature font, or upload an image of your handwritten signature. All methods create legally acceptable digital signatures.'
    },
    {
      question: 'Is my signature secure when signing online?',
      answer: 'Yes, completely secure. All signature creation and PDF signing happens locally in your browser. Your signature and documents never leave your device or get uploaded to any servers.'
    },
    {
      question: 'Can I position my signature exactly where I want?',
      answer: 'Absolutely! You can specify exact X and Y coordinates for signature placement, or use the default position and adjust as needed. This ensures your signature appears exactly where required.'
    },
    {
      question: 'Are digitally signed PDFs legally valid?',
      answer: 'Digital signatures created with our tool are widely accepted for most business and personal documents. However, some specialized legal or government documents may require specific certification methods.'
    }
  ];

  const howToSteps = [
    { title: 'Upload PDF Document', description: 'Select the PDF file you need to sign' },
    { title: 'Create Your Signature', description: 'Draw, type, or upload your signature using the preferred method' },
    { title: 'Position Signature', description: 'Set the exact coordinates where your signature should appear' },
    { title: 'Sign & Download', description: 'Apply your signature to the PDF and download the signed document' }
  ];

  const benefits = [
    'Multiple signature creation methods',
    'Precise signature positioning',
    'Draw signatures with mouse or touch',
    'Type signatures in professional fonts',
    'Upload signature images',
    'Completely offline processing'
  ];

  const useCases = [
    'Sign contracts and agreements',
    'Authorize business documents',
    'Complete legal forms',
    'Sign employment documents',
    'Approve financial paperwork',
    'Sign personal correspondence'
  ];

  return (
    <ToolShell 
      tool={tool} 
      faqs={faqs}
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">
              <i className="fas fa-signature text-red-400 mr-3"></i>
              PDF Digital Signature
            </h1>
            <p className="text-xl text-slate-400">
              Add digital signatures to PDF documents securely
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Upload */}
            <Card className="glassmorphism border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Upload PDF</CardTitle>
                <CardDescription className="text-slate-400">
                  Select the PDF file you want to sign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pdf-upload" className="text-slate-300">Choose PDF File</Label>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    data-testid="input-pdf-file"
                  />
                </div>

                {file && (
                  <div className="text-sm text-slate-300">
                    <i className="fas fa-file-pdf mr-2 text-red-400"></i>
                    {file.name}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position-x" className="text-slate-300">X Position</Label>
                    <Input
                      id="position-x"
                      type="number"
                      value={position.x}
                      onChange={(e) => setPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                      className="bg-slate-800 border-slate-600 text-slate-100"
                      data-testid="input-x-position"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-y" className="text-slate-300">Y Position</Label>
                    <Input
                      id="position-y"
                      type="number"
                      value={position.y}
                      onChange={(e) => setPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                      className="bg-slate-800 border-slate-600 text-slate-100"
                      data-testid="input-y-position"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signature Creation */}
            <Card className="glassmorphism border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Create Signature</CardTitle>
                <CardDescription className="text-slate-400">
                  Draw, type, or upload your signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={signatureType} onValueChange={setSignatureType}>
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                    <TabsTrigger value="draw" className="data-[state=active]:bg-red-600">Draw</TabsTrigger>
                    <TabsTrigger value="text" className="data-[state=active]:bg-red-600">Type</TabsTrigger>
                    <TabsTrigger value="image" className="data-[state=active]:bg-red-600">Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="draw" className="space-y-4">
                    <div className="border border-slate-600 rounded-lg p-4 bg-white">
                      <canvas
                        ref={canvasRef}
                        width={350}
                        height={150}
                        className="border border-gray-300 cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        data-testid="canvas-signature"
                      />
                    </div>
                    <Button
                      onClick={clearCanvas}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="button-clear-canvas"
                    >
                      <i className="fas fa-eraser mr-2"></i>
                      Clear
                    </Button>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="signature-text" className="text-slate-300">Your Signature Text</Label>
                      <Input
                        id="signature-text"
                        value={textSignature}
                        onChange={(e) => setTextSignature(e.target.value)}
                        placeholder="Enter your name"
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        data-testid="input-signature-text"
                      />
                    </div>
                    {textSignature && (
                      <div className="p-4 bg-white rounded-lg border border-slate-600">
                        <div style={{ fontFamily: 'cursive', fontSize: '24px', textAlign: 'center' }}>
                          {textSignature}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div>
                      <Label htmlFor="signature-image" className="text-slate-300">Upload Signature Image</Label>
                      <Input
                        id="signature-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        data-testid="input-signature-image"
                      />
                    </div>
                    {signatureImage && (
                      <div className="p-4 bg-white rounded-lg border border-slate-600">
                        <img
                          src={signatureImage}
                          alt="Signature"
                          className="max-w-full h-auto max-h-32 mx-auto"
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert className="border-red-500 bg-red-500/10 mt-6">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center mt-8">
            <Button
              onClick={addSignatureToPDF}
              disabled={processing || !file}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
              data-testid="button-sign-pdf"
            >
              {processing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing PDF...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Sign and Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      </div>
    </ToolShell>
  );
}