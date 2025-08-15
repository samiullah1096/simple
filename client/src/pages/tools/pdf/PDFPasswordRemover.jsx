import React, { useState, useCallback } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PDFPasswordRemover() {
  const tool = TOOLS.pdf.find(t => t.slug === 'remove-password');
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
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
    setPassword('');
    await checkPasswordProtection(uploadedFile);
  }, [toast]);

  const checkPasswordProtection = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      try {
        // Try to load without password
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setIsPasswordProtected(false);
        setFileInfo({
          name: pdfFile.name,
          size: (pdfFile.size / (1024 * 1024)).toFixed(2),
          pages: pdf.numPages,
          passwordProtected: false
        });
        
        toast({
          title: "PDF loaded successfully",
          description: "This PDF is not password protected.",
        });
      } catch (error) {
        if (error.name === 'PasswordException') {
          setIsPasswordProtected(true);
          setFileInfo({
            name: pdfFile.name,
            size: (pdfFile.size / (1024 * 1024)).toFixed(2),
            pages: 'Unknown',
            passwordProtected: true
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error checking PDF:', error);
      toast({
        title: "Error loading PDF",
        description: "Failed to load the PDF file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removePassword = async () => {
    if (!file) return;

    if (isPasswordProtected && !password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter the password to unlock the PDF.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // First, verify password and load with PDF.js
      let pdf;
      try {
        pdf = await pdfjsLib.getDocument({ 
          data: arrayBuffer, 
          password: isPasswordProtected ? password : undefined 
        }).promise;
      } catch (error) {
        if (error.name === 'PasswordException') {
          toast({
            title: "Incorrect password",
            description: "The password you entered is incorrect.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Now create a new PDF without password using pdf-lib
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        password: isPasswordProtected ? password : undefined 
      });
      
      // Save without password protection
      const pdfBytes = await pdfDoc.save();
      
      // Create blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const filename = file.name.replace(/\.pdf$/i, '_unlocked.pdf');
      saveAs(blob, filename);

      toast({
        title: "Password removed successfully!",
        description: `PDF has been unlocked and saved as "${filename}".`,
      });

      // Update file info
      setFileInfo(prev => ({
        ...prev,
        pages: pdf.numPages,
        passwordProtected: false
      }));
      setIsPasswordProtected(false);
      setPassword('');

    } catch (error) {
      console.error('Error removing password:', error);
      
      let errorMessage = "An error occurred while removing the password.";
      if (error.message.includes('password')) {
        errorMessage = "Incorrect password. Please check and try again.";
      } else if (error.message.includes('encrypted')) {
        errorMessage = "This PDF uses encryption that cannot be removed.";
      }
      
      toast({
        title: "Failed to remove password",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const faqs = [
    {
      question: 'How do I remove password from PDF online for free?',
      answer: 'Upload your password-protected PDF file, enter the current password if prompted, then click "Remove Password" to download an unlocked version. All processing happens in your browser.'
    },
    {
      question: 'Is it safe to remove PDF passwords online?',
      answer: 'Yes, completely safe. All PDF processing happens locally in your browser using client-side JavaScript. Your files and passwords never leave your device or get uploaded to any servers.'
    },
    {
      question: 'Can I remove password from any encrypted PDF?',
      answer: 'You can remove passwords from PDFs where you know the current password. Some enterprise-level encryption may not be removable due to advanced security measures.'
    },
    {
      question: 'Do I need to know the current password?',
      answer: 'Yes, you need the current password to unlock and remove protection from a PDF. This tool cannot crack or guess passwords - it requires legitimate access.'
    },
    {
      question: 'Will the PDF content be changed after removing password?',
      answer: 'No, only the password protection is removed. All content, formatting, images, and metadata remain exactly the same as the original PDF.'
    }
  ];

  const howToSteps = [
    { title: 'Upload PDF File', description: 'Select your password-protected PDF document' },
    { title: 'Enter Password', description: 'If required, enter the current password to unlock the PDF' },
    { title: 'Remove Protection', description: 'Click to remove password protection from the PDF' },
    { title: 'Download Unlocked PDF', description: 'Get your PDF file without password protection' }
  ];

  const benefits = [
    'Remove password protection instantly',
    'Maintain original PDF quality',
    'Process files completely offline',
    'Support for various encryption types',
    'No file size limits',
    'Preserve all content and metadata'
  ];

  const useCases = [
    'Remove passwords from old archived PDFs',
    'Unlock PDFs for easier sharing',
    'Prepare PDFs for automated processing',
    'Remove restrictions for editing or printing',
    'Unlock PDFs for digital signatures',
    'Simplify document workflows'
  ];

  return (
    <ToolShell 
      tool={tool} 
      faqs={faqs}
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-unlock text-red-400"></i>
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a password-protected PDF file to remove its password
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
            
            <Alert>
              <i className="fas fa-shield-alt h-4 w-4"></i>
              <AlertDescription>
                Your PDF files are processed locally in your browser. No files are uploaded to any server, ensuring complete privacy and security.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* File Information */}
      {fileInfo && (
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Filename:</span>
                  <span className="text-sm text-muted-foreground">{fileInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">File Size:</span>
                  <span className="text-sm text-muted-foreground">{fileInfo.size} MB</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pages:</span>
                  <span className="text-sm text-muted-foreground">{fileInfo.pages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Password Protected:</span>
                  <span className={`text-sm ${fileInfo.passwordProtected ? 'text-red-500' : 'text-green-500'}`}>
                    {fileInfo.passwordProtected ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Input */}
      {isPasswordProtected && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Password</CardTitle>
            <CardDescription>
              Please enter the password to unlock this PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pdf-password">PDF Password</Label>
                <Input
                  id="pdf-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password"
                  className="mt-1"
                  data-testid="input-password"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remove Password Button */}
      {file && (
        <div className="flex justify-center">
          <Button
            onClick={removePassword}
            disabled={processing || (isPasswordProtected && !password.trim())}
            size="lg"
            className="px-8"
            data-testid="button-remove-password"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Removing Password...
              </>
            ) : (
              <>
                <i className="fas fa-unlock mr-2"></i>
                {isPasswordProtected ? 'Remove Password' : 'Download Unlocked PDF'}
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Remove PDF Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload PDF File</h4>
                <p className="text-sm text-muted-foreground">Select your password-protected PDF document</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Enter Password</h4>
                <p className="text-sm text-muted-foreground">If required, enter the current password to unlock the PDF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Remove Protection</h4>
                <p className="text-sm text-muted-foreground">Click to remove password protection from the PDF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Unlocked PDF</h4>
                <p className="text-sm text-muted-foreground">Get your PDF file without password protection</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <i className="fas fa-exclamation-triangle"></i>
            Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Privacy:</strong> All PDF processing happens locally in your browser. Your files and passwords never leave your device.
          </p>
          <p>
            <strong>Legal Use:</strong> Only remove passwords from PDFs you own or have permission to modify. Respect copyright and legal restrictions.
          </p>
          <p>
            <strong>File Security:</strong> The unlocked PDF will be downloadable without any password protection. Store it securely if needed.
          </p>
        </CardContent>
      </Card>
      </div>
    </ToolShell>
  );
}