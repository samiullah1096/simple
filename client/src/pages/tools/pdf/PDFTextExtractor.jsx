import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PDFTextExtractor() {
  const tool = TOOLS.pdf.find(t => t.slug === 'extract-text');
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [extractionFormat, setExtractionFormat] = useState('plain');
  const [pageRange, setPageRange] = useState('all');
  const [customRange, setCustomRange] = useState('');
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
    setExtractedText('');
    await getFileInfo(uploadedFile);
  }, [toast]);

  const getFileInfo = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setFileInfo({
        name: pdfFile.name,
        size: (pdfFile.size / (1024 * 1024)).toFixed(2),
        pages: pdf.numPages
      });
    } catch (error) {
      console.error('Error reading PDF info:', error);
    }
  };

  const parsePageRange = (range, totalPages) => {
    if (!range.trim()) return [];
    
    const pages = new Set();
    const parts = range.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= end && start >= 1 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            pages.add(i);
          }
        }
      } else {
        const pageNum = parseInt(trimmed);
        if (pageNum >= 1 && pageNum <= totalPages) {
          pages.add(pageNum);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const extractText = async () => {
    if (!file) return;

    setExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let pagesToExtract = [];
      if (pageRange === 'all') {
        pagesToExtract = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
      } else if (pageRange === 'custom') {
        pagesToExtract = parsePageRange(customRange, pdf.numPages);
        if (pagesToExtract.length === 0) {
          toast({
            title: "Invalid page range",
            description: "Please enter a valid page range (e.g., 1-3, 5, 7-10).",
            variant: "destructive",
          });
          return;
        }
      }

      let fullText = '';
      let wordCount = 0;
      let charCount = 0;

      for (const pageNum of pagesToExtract) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        textContent.items.forEach((item) => {
          pageText += item.str + ' ';
        });
        
        if (extractionFormat === 'structured') {
          fullText += `=== PAGE ${pageNum} ===\n`;
          fullText += pageText.trim() + '\n\n';
        } else if (extractionFormat === 'lines') {
          const lines = pageText.trim().split('\n');
          lines.forEach((line, index) => {
            if (line.trim()) {
              fullText += `Line ${index + 1}: ${line.trim()}\n`;
            }
          });
          fullText += '\n';
        } else {
          fullText += pageText.trim() + '\n\n';
        }
        
        // Count words and characters
        const words = pageText.trim().split(/\s+/).filter(word => word.length > 0);
        wordCount += words.length;
        charCount += pageText.length;
      }

      setExtractedText(fullText.trim());
      
      toast({
        title: "Text extracted successfully!",
        description: `Extracted ${wordCount.toLocaleString()} words from ${pagesToExtract.length} page(s).`,
      });

    } catch (error) {
      console.error('Text extraction error:', error);
      toast({
        title: "Extraction failed",
        description: "Failed to extract text from PDF. The PDF might be password-protected or contain only images.",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  const downloadAsText = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain; charset=utf-8' });
    const filename = file.name.replace(/\.pdf$/i, '_extracted.txt');
    saveAs(blob, filename);

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const downloadAsJSON = () => {
    if (!extractedText) return;

    const jsonData = {
      source: file.name,
      extractedAt: new Date().toISOString(),
      extractionFormat: extractionFormat,
      pageRange: pageRange === 'all' ? 'all pages' : customRange,
      content: extractedText,
      statistics: {
        characterCount: extractedText.length,
        wordCount: extractedText.split(/\s+/).filter(word => word.length > 0).length,
        lineCount: extractedText.split('\n').length
      }
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const filename = file.name.replace(/\.pdf$/i, '_extracted.json');
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

  const clearText = () => {
    setExtractedText('');
  };

  const getTextStatistics = () => {
    if (!extractedText) return null;

    const words = extractedText.split(/\s+/).filter(word => word.length > 0);
    const sentences = extractedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = extractedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    return {
      characters: extractedText.length,
      charactersNoSpaces: extractedText.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      averageWordsPerSentence: words.length / sentences.length || 0
    };
  };

  const stats = getTextStatistics();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-file-alt text-red-400"></i>
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to extract text content with OCR support
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
                This tool extracts text from PDF files. Works best with text-based PDFs. Scanned documents may have limited extraction quality.
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

      {/* Extraction Settings */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Extraction Settings</CardTitle>
            <CardDescription>
              Configure how text should be extracted from the PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Extraction Format</Label>
                <Select value={extractionFormat} onValueChange={setExtractionFormat}>
                  <SelectTrigger data-testid="select-extraction-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain Text</SelectItem>
                    <SelectItem value="structured">Structured (with page headers)</SelectItem>
                    <SelectItem value="lines">Line by Line</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Page Range</Label>
                <Select value={pageRange} onValueChange={setPageRange}>
                  <SelectTrigger data-testid="select-page-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {pageRange === 'custom' && (
              <div>
                <Label htmlFor="custom-range">Custom Page Range</Label>
                <Input
                  id="custom-range"
                  value={customRange}
                  onChange={(e) => setCustomRange(e.target.value)}
                  placeholder="e.g., 1-3, 5, 7-10"
                  className="mt-1"
                  data-testid="input-custom-range"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use comma-separated values and ranges (e.g., 1-3, 5, 7-10)
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={extractText}
                disabled={extracting || (pageRange === 'custom' && !customRange.trim())}
                size="lg"
                className="px-8"
                data-testid="button-extract"
              >
                {extracting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Extracting Text...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-export mr-2"></i>
                    Extract Text
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Text Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.characters.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.words.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.sentences.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Sentences</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.paragraphs.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Paragraphs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.charactersNoSpaces.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Chars (no spaces)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">{Math.round(stats.averageWordsPerSentence)}</div>
                <div className="text-sm text-muted-foreground">Avg Words/Sentence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text */}
      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Text</CardTitle>
            <CardDescription>
              Preview and download the extracted text content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="min-h-80 resize-none border-none bg-transparent p-0 focus:ring-0"
                  placeholder="Extracted text will appear here..."
                  data-testid="textarea-extracted-text"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={downloadAsText}
                  className="flex-1 min-w-[150px]"
                  data-testid="button-download-txt"
                >
                  <i className="fas fa-file-alt mr-2"></i>
                  Download as TXT
                </Button>
                
                <Button
                  onClick={downloadAsJSON}
                  variant="outline"
                  className="flex-1 min-w-[150px]"
                  data-testid="button-download-json"
                >
                  <i className="fas fa-code mr-2"></i>
                  Download as JSON
                </Button>
                
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 min-w-[150px]"
                  data-testid="button-copy"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy to Clipboard
                </Button>
                
                <Button
                  onClick={clearText}
                  variant="outline"
                  className="flex-1 min-w-[150px]"
                  data-testid="button-clear"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear Text
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Extract PDF Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload PDF File</h4>
                <p className="text-sm text-muted-foreground">Select the PDF document containing text you want to extract</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Configure Settings</h4>
                <p className="text-sm text-muted-foreground">Choose extraction format and specify which pages to process</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Extract Text</h4>
                <p className="text-sm text-muted-foreground">Click extract to process the PDF and retrieve all text content</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Use Extracted Text</h4>
                <p className="text-sm text-muted-foreground">Edit, copy, or download the text in various formats</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips and Limitations */}
      <Card className="border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <i className="fas fa-lightbulb"></i>
            Tips for Better Extraction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Text-based PDFs:</strong> Works best with PDFs that contain selectable text rather than scanned images.
          </p>
          <p>
            <strong>Complex Layouts:</strong> Tables and multi-column layouts may not preserve their structure in extracted text.
          </p>
          <p>
            <strong>Fonts and Encoding:</strong> Some special characters or unusual fonts may not extract correctly.
          </p>
          <p>
            <strong>Page Range:</strong> Extract specific pages to focus on relevant content and reduce processing time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}