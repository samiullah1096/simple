import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PDFToWord() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState('docx');
  const [extractedText, setExtractedText] = useState('');
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
    setExtractedText('');
  }, [toast]);

  const extractTextFromPDF = async () => {
    if (!file) return;

    setConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        textContent.items.forEach((item) => {
          pageText += item.str + ' ';
        });
        
        fullText += `Page ${pageNum}:\n${pageText.trim()}\n\n`;
      }

      setExtractedText(fullText);
      
      toast({
        title: "Text extracted successfully!",
        description: `Extracted text from ${pdf.numPages} page(s).`,
      });

    } catch (error) {
      console.error('Text extraction error:', error);
      toast({
        title: "Extraction failed",
        description: "Failed to extract text from PDF. The PDF might be password-protected or contain only images.",
        variant: "destructive",
      });
    } finally {
      setConverting(false);
    }
  };

  const downloadAsWord = () => {
    if (!extractedText) return;

    // Create a simple HTML document that Word can open
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PDF to Word Conversion</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 1in; line-height: 1.5; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .page-break { page-break-before: always; }
        .page-header { font-weight: bold; color: #666; margin-top: 20px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>PDF to Word Conversion</h1>
    <p><strong>Original File:</strong> ${file.name}</p>
    <p><strong>Conversion Date:</strong> ${new Date().toLocaleDateString()}</p>
    <hr>
    <div>
        ${extractedText.split('\n\n').map(paragraph => {
          if (paragraph.startsWith('Page ')) {
            return `<div class="page-header">${paragraph.split(':')[0]}</div><p>${paragraph.split(':').slice(1).join(':').trim()}</p>`;
          }
          return `<p>${paragraph}</p>`;
        }).join('\n')}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const filename = file.name.replace(/\.pdf$/i, '.doc');
    saveAs(blob, filename);

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const downloadAsText = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const filename = file.name.replace(/\.pdf$/i, '.txt');
    saveAs(blob, filename);

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const copyToClipboard = async () => {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-file-word text-red-400"></i>
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to convert to Word document format
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
              <i className="fas fa-info-circle h-4 w-4"></i>
              <AlertDescription>
                This tool extracts text from PDF files. PDFs with images, complex layouts, or password protection may have limited conversion quality.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Options</CardTitle>
            <CardDescription>
              Choose your preferred output format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger data-testid="select-output-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">Word Document (.doc)</SelectItem>
                  <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={extractTextFromPDF}
                disabled={converting}
                size="lg"
                className="px-8"
                data-testid="button-extract"
              >
                {converting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Extracting Text...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-export mr-2"></i>
                    Extract Text from PDF
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text Preview */}
      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Text Preview</CardTitle>
            <CardDescription>
              Preview the extracted text before downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {extractedText.substring(0, 1000)}
                  {extractedText.length > 1000 && '...\n\n[Text truncated in preview]'}
                </pre>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Total characters: {extractedText.length.toLocaleString()}</p>
                <p>Total words: {extractedText.split(/\s+/).filter(word => word.length > 0).length.toLocaleString()}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {outputFormat === 'docx' ? (
                  <Button
                    onClick={downloadAsWord}
                    className="flex-1 min-w-[200px]"
                    data-testid="button-download-word"
                  >
                    <i className="fas fa-file-word mr-2"></i>
                    Download as Word Document
                  </Button>
                ) : (
                  <Button
                    onClick={downloadAsText}
                    className="flex-1 min-w-[200px]"
                    data-testid="button-download-text"
                  >
                    <i className="fas fa-file-alt mr-2"></i>
                    Download as Text File
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-1 min-w-[200px]"
                  data-testid="button-copy"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Convert PDF to Word</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload PDF File</h4>
                <p className="text-sm text-muted-foreground">Select the PDF document you want to convert</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Output Format</h4>
                <p className="text-sm text-muted-foreground">Select between Word document or plain text format</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Extract Text</h4>
                <p className="text-sm text-muted-foreground">Click to extract all text content from the PDF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download Result</h4>
                <p className="text-sm text-muted-foreground">Preview and download your converted document</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limitations and Tips */}
      <Card className="border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <i className="fas fa-exclamation-triangle"></i>
            Conversion Limitations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Text-based PDFs:</strong> Works best with PDFs that contain selectable text.
          </p>
          <p>
            <strong>Image-based PDFs:</strong> Scanned documents or PDFs with text as images may not convert well without OCR.
          </p>
          <p>
            <strong>Complex Layouts:</strong> Tables, columns, and complex formatting may not be preserved perfectly.
          </p>
          <p>
            <strong>Fonts and Styling:</strong> Original fonts and detailed formatting will be simplified in the Word output.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}