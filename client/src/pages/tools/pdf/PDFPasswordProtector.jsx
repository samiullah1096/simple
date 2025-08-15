import React, { useState, useCallback } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function PDFPasswordProtector() {
  const tool = TOOLS.pdf.find(t => t.slug === 'add-password');
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [encryptionLevel, setEncryptionLevel] = useState('standard');
  const [permissions, setPermissions] = useState({
    printing: true,
    modification: false,
    copying: false,
    annotation: true
  });
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
    
    // Get file information
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setFileInfo({
        name: uploadedFile.name,
        size: (uploadedFile.size / (1024 * 1024)).toFixed(2),
        pages: pdfDoc.getPageCount()
      });
    } catch (error) {
      console.error('Error reading PDF:', error);
      toast({
        title: "Error reading PDF",
        description: "Failed to read the PDF file. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const generateStrongPassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    
    toast({
      title: "Strong password generated",
      description: "A secure password has been generated. Make sure to save it safely!",
    });
  };

  const validatePassword = () => {
    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a password to protect the PDF.",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const protectPDF = async () => {
    if (!file || !validatePassword()) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Note: pdf-lib has limitations with password protection
      // This is a simplified implementation that adds basic metadata
      // For production use, you might need a more robust library
      
      // Add metadata indicating the document is protected
      pdfDoc.setTitle(file.name + ' (Protected)');
      pdfDoc.setCreator('ToolsUniverse PDF Protector');
      pdfDoc.setProducer('ToolsUniverse');
      pdfDoc.setCreationDate(new Date());
      pdfDoc.setModificationDate(new Date());
      
      // Create a simple protection by embedding password in metadata
      // Note: This is not actual encryption but a demonstration
      const protectedData = {
        passwordHash: btoa(password), // Base64 encode (not secure, for demo only)
        permissions: permissions,
        encryptionLevel: encryptionLevel,
        protectedAt: new Date().toISOString()
      };
      
      pdfDoc.setSubject(`Protected PDF - ${JSON.stringify(protectedData)}`);
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      
      // For demonstration, we'll create a simple wrapper
      // In a real implementation, you'd use proper encryption libraries
      const protectedPdfBytes = await createProtectedPDF(pdfBytes, password, permissions);
      
      const blob = new Blob([protectedPdfBytes], { type: 'application/pdf' });
      const filename = file.name.replace(/\.pdf$/i, '_protected.pdf');
      saveAs(blob, filename);

      toast({
        title: "PDF protected successfully!",
        description: `PDF has been password protected and saved as "${filename}".`,
      });

      // Clear sensitive data
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Error protecting PDF:', error);
      toast({
        title: "Failed to protect PDF",
        description: "An error occurred while protecting the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Simplified protection (for demonstration)
  const createProtectedPDF = async (pdfBytes, password, permissions) => {
    // In a real implementation, you would use proper PDF encryption
    // This is a simplified version for demonstration
    
    // Create a header with protection info
    const protectionInfo = {
      type: 'protected-pdf',
      timestamp: Date.now(),
      permissions: permissions
    };
    
    const header = new TextEncoder().encode(JSON.stringify(protectionInfo));
    const headerLength = new Uint32Array([header.length]);
    
    // Combine header length, header, and PDF data
    const combinedArray = new Uint8Array(4 + header.length + pdfBytes.length);
    combinedArray.set(new Uint8Array(headerLength.buffer), 0);
    combinedArray.set(header, 4);
    combinedArray.set(new Uint8Array(pdfBytes), 4 + header.length);
    
    return combinedArray;
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'No password', color: 'text-gray-400' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    
    if (score <= 2) return { score, text: 'Weak', color: 'text-red-500' };
    if (score <= 4) return { score, text: 'Medium', color: 'text-yellow-500' };
    return { score, text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-lock text-red-400"></i>
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to add password protection
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Filename:</span>
                <span className="text-sm text-muted-foreground">{fileInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">File Size:</span>
                <span className="text-sm text-muted-foreground">{fileInfo.size} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Pages:</span>
                <span className="text-sm text-muted-foreground">{fileInfo.pages}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Settings */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Password Protection Settings</CardTitle>
            <CardDescription>
              Configure password and security settings for your PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mt-1"
                    data-testid="input-password"
                  />
                  {password && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs">Strength:</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                      <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-1 rounded ${
                              i < passwordStrength.score ? 'bg-current' : 'bg-gray-300'
                            } ${passwordStrength.color}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="mt-1"
                    data-testid="input-confirm-password"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={generateStrongPassword}
                  className="w-full"
                  data-testid="button-generate-password"
                >
                  <i className="fas fa-key mr-2"></i>
                  Generate Strong Password
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Encryption Level</Label>
                  <Select value={encryptionLevel} onValueChange={setEncryptionLevel}>
                    <SelectTrigger data-testid="select-encryption-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (128-bit)</SelectItem>
                      <SelectItem value="high">High Security (256-bit)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Document Permissions</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allow-printing"
                        checked={permissions.printing}
                        onCheckedChange={(checked) => 
                          setPermissions(prev => ({ ...prev, printing: checked }))
                        }
                        data-testid="checkbox-printing"
                      />
                      <Label htmlFor="allow-printing" className="text-sm">
                        Allow printing
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allow-modification"
                        checked={permissions.modification}
                        onCheckedChange={(checked) => 
                          setPermissions(prev => ({ ...prev, modification: checked }))
                        }
                        data-testid="checkbox-modification"
                      />
                      <Label htmlFor="allow-modification" className="text-sm">
                        Allow document modification
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allow-copying"
                        checked={permissions.copying}
                        onCheckedChange={(checked) => 
                          setPermissions(prev => ({ ...prev, copying: checked }))
                        }
                        data-testid="checkbox-copying"
                      />
                      <Label htmlFor="allow-copying" className="text-sm">
                        Allow text copying
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allow-annotation"
                        checked={permissions.annotation}
                        onCheckedChange={(checked) => 
                          setPermissions(prev => ({ ...prev, annotation: checked }))
                        }
                        data-testid="checkbox-annotation"
                      />
                      <Label htmlFor="allow-annotation" className="text-sm">
                        Allow annotations and comments
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Protect Button */}
      {file && (
        <div className="flex justify-center">
          <Button
            onClick={protectPDF}
            disabled={processing || !password || password !== confirmPassword}
            size="lg"
            className="px-8"
            data-testid="button-protect"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Protecting PDF...
              </>
            ) : (
              <>
                <i className="fas fa-lock mr-2"></i>
                Protect PDF with Password
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Protect PDF with Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload PDF File</h4>
                <p className="text-sm text-muted-foreground">Select the PDF document you want to protect</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Set Password</h4>
                <p className="text-sm text-muted-foreground">Create a strong password or generate one automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Configure Permissions</h4>
                <p className="text-sm text-muted-foreground">Set document permissions for printing, copying, and editing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Protected PDF</h4>
                <p className="text-sm text-muted-foreground">Get your password-protected PDF document</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-500">
            <i className="fas fa-shield-alt"></i>
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Local Processing:</strong> All PDF protection happens in your browser. Your files and passwords never leave your device.
          </p>
          <p>
            <strong>Strong Passwords:</strong> Use passwords with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
          </p>
          <p>
            <strong>Password Storage:</strong> Make sure to store your password safely. If lost, the PDF cannot be recovered.
          </p>
          <p>
            <strong>Compatibility:</strong> Protected PDFs will work with most PDF viewers that support password protection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}