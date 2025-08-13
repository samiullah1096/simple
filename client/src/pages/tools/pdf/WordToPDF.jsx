import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';

export default function WordToPDF() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [conversionMethod, setConversionMethod] = useState('file');
  const [manualText, setManualText] = useState('');
  const [pageSize, setPageSize] = useState('A4');
  const [fontSize, setFontSize] = useState('12');
  const { toast } = useToast();

  const pageSizes = {
    'A4': { width: 595, height: 842 },
    'A3': { width: 842, height: 1191 },
    'A5': { width: 420, height: 595 },
    'Letter': { width: 612, height: 792 },
    'Legal': { width: 612, height: 1008 }
  };

  const handleFileUpload = useCallback(async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    const fileType = uploadedFile.type;
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain', // .txt
      'text/rtf', // .rtf
      'application/rtf'
    ];

    if (!validTypes.includes(fileType) && !uploadedFile.name.match(/\.(docx|doc|txt|rtf)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please select a Word document (.docx, .doc), text file (.txt), or RTF file.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    await extractTextFromFile(uploadedFile);
  }, [toast]);

  const extractTextFromFile = async (file) => {
    try {
      if (file.name.endsWith('.docx')) {
        // Extract text from DOCX using mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setTextContent(result.value);
      } else if (file.name.endsWith('.txt') || file.type === 'text/plain') {
        // Read plain text file
        const text = await file.text();
        setTextContent(text);
      } else if (file.name.endsWith('.rtf') || file.type.includes('rtf')) {
        // Basic RTF text extraction (removes RTF codes)
        const text = await file.text();
        const plainText = text.replace(/\\[a-z0-9]+\s?/gi, '').replace(/[{}]/g, '').trim();
        setTextContent(plainText);
      } else {
        // Fallback: try to read as text
        const text = await file.text();
        setTextContent(text);
      }

      toast({
        title: "File loaded successfully",
        description: "Text content extracted and ready for PDF conversion.",
      });
    } catch (error) {
      console.error('Text extraction error:', error);
      toast({
        title: "Extraction failed",
        description: "Failed to extract text from the file. Please try a different file or use manual text input.",
        variant: "destructive",
      });
    }
  };

  const wrapText = (text, maxWidth, fontSize, font) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  const createPDF = async () => {
    const textToConvert = conversionMethod === 'file' ? textContent : manualText;
    
    if (!textToConvert.trim()) {
      toast({
        title: "No content to convert",
        description: "Please provide text content to convert to PDF.",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      const { width: pageWidth, height: pageHeight } = pageSizes[pageSize];
      const margin = 72; // 1 inch margin
      const maxWidth = pageWidth - (margin * 2);
      const fontSizeNum = parseInt(fontSize);
      const lineHeight = fontSizeNum * 1.2;
      
      let yPosition = pageHeight - margin;
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      
      // Split text into paragraphs
      const paragraphs = textToConvert.split(/\n\s*\n/);
      
      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) continue;
        
        // Check if this looks like a heading (short line, all caps, or starts with number)
        const isHeading = paragraph.length < 50 && 
          (paragraph === paragraph.toUpperCase() || /^\d+\.?\s/.test(paragraph));
        
        const currentFont = isHeading ? fontBold : font;
        const currentFontSize = isHeading ? fontSizeNum + 2 : fontSizeNum;
        
        // Wrap text to fit page width
        const lines = wrapText(paragraph.trim(), maxWidth, currentFontSize, currentFont);
        
        for (const line of lines) {
          // Check if we need a new page
          if (yPosition < margin + lineHeight) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
          }
          
          currentPage.drawText(line, {
            x: margin,
            y: yPosition,
            size: currentFontSize,
            font: currentFont,
            color: rgb(0, 0, 0),
          });
          
          yPosition -= lineHeight;
        }
        
        // Add extra space after paragraph
        yPosition -= lineHeight * 0.5;
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      let filename;
      if (conversionMethod === 'file' && file) {
        filename = file.name.replace(/\.[^/.]+$/, '.pdf');
      } else {
        filename = 'document.pdf';
      }
      
      saveAs(blob, filename);
      
      toast({
        title: "PDF created successfully!",
        description: `Document converted to PDF: ${filename}`,
      });
      
    } catch (error) {
      console.error('PDF creation error:', error);
      toast({
        title: "Conversion failed",
        description: "An error occurred while creating the PDF.",
        variant: "destructive",
      });
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Conversion Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-file-pdf text-red-400"></i>
            Word to PDF Converter
          </CardTitle>
          <CardDescription>
            Convert Word documents or text to PDF format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Conversion Method</Label>
              <Select value={conversionMethod} onValueChange={setConversionMethod}>
                <SelectTrigger data-testid="select-conversion-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">Upload File</SelectItem>
                  <SelectItem value="text">Type/Paste Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      {conversionMethod === 'file' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Select a Word document, text file, or RTF file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Choose Document</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".docx,.doc,.txt,.rtf"
                  onChange={handleFileUpload}
                  className="mt-1"
                  data-testid="input-file-upload"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supports: .docx, .doc, .txt, .rtf files
                </p>
              </div>
              
              {textContent && (
                <Alert>
                  <i className="fas fa-check-circle h-4 w-4"></i>
                  <AlertDescription>
                    Text extracted successfully! {textContent.length.toLocaleString()} characters ready for conversion.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Text Input */}
      {conversionMethod === 'text' && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Text Content</CardTitle>
            <CardDescription>
              Type or paste your text content below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-text">Document Content</Label>
                <Textarea
                  id="manual-text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Type or paste your document content here..."
                  className="mt-1 min-h-64"
                  data-testid="textarea-manual-text"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {manualText.length.toLocaleString()} characters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PDF Settings */}
      {((conversionMethod === 'file' && textContent) || (conversionMethod === 'text' && manualText)) && (
        <Card>
          <CardHeader>
            <CardTitle>PDF Settings</CardTitle>
            <CardDescription>
              Customize your PDF output preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger data-testid="select-font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10pt</SelectItem>
                    <SelectItem value="11">11pt</SelectItem>
                    <SelectItem value="12">12pt</SelectItem>
                    <SelectItem value="14">14pt</SelectItem>
                    <SelectItem value="16">16pt</SelectItem>
                    <SelectItem value="18">18pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Preview */}
      {((conversionMethod === 'file' && textContent) || (conversionMethod === 'text' && manualText)) && (
        <Card>
          <CardHeader>
            <CardTitle>Content Preview</CardTitle>
            <CardDescription>
              Preview of the text that will be converted to PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-48 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <pre className="text-sm whitespace-pre-wrap">
                {(conversionMethod === 'file' ? textContent : manualText).substring(0, 1000)}
                {(conversionMethod === 'file' ? textContent : manualText).length > 1000 && '...\n\n[Text truncated in preview]'}
              </pre>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Characters: {(conversionMethod === 'file' ? textContent : manualText).length.toLocaleString()}</p>
              <p>Estimated pages: ~{Math.ceil((conversionMethod === 'file' ? textContent : manualText).length / 2000)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convert Button */}
      {((conversionMethod === 'file' && textContent) || (conversionMethod === 'text' && manualText)) && (
        <div className="flex justify-center">
          <Button
            onClick={createPDF}
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
                Convert to PDF
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Convert to PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Input Method</h4>
                <p className="text-sm text-muted-foreground">Upload a document file or type/paste text directly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Customize Settings</h4>
                <p className="text-sm text-muted-foreground">Select page size, font size, and other formatting options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Preview Content</h4>
                <p className="text-sm text-muted-foreground">Review the text content before conversion</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Download PDF</h4>
                <p className="text-sm text-muted-foreground">Click convert to generate and download your PDF</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}