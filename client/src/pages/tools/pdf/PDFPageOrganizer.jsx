import React, { useState, useCallback, useRef } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PDFPageOrganizer() {
  const tool = TOOLS.pdf.find(t => t.slug === 'organize');
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const canvasRefs = useRef({});
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
    await loadPDFPages(uploadedFile);
  }, [toast]);

  const loadPDFPages = async (pdfFile) => {
    setLoading(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      
      const pageList = [];
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        
        // Create canvas for thumbnail
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        pageList.push({
          pageNumber: i,
          originalIndex: i - 1,
          rotation: 0,
          thumbnail: canvas.toDataURL(),
          selected: true,
          width: viewport.width,
          height: viewport.height
        });
      }
      
      setPages(pageList);
      toast({
        title: "PDF loaded successfully",
        description: `Loaded ${pageCount} page(s) for organization.`,
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Error loading PDF",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];
    
    // Remove dragged item
    newPages.splice(draggedIndex, 1);
    
    // Insert at new position
    newPages.splice(dropIndex, 0, draggedPage);
    
    setPages(newPages);
    setDraggedIndex(null);
  };

  const rotatePage = (index, direction) => {
    setPages(prev => prev.map((page, i) => {
      if (i === index) {
        const newRotation = direction === 'left' 
          ? (page.rotation - 90 + 360) % 360 
          : (page.rotation + 90) % 360;
        return { ...page, rotation: newRotation };
      }
      return page;
    }));
  };

  const deletePage = (index) => {
    setPages(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Page deleted",
      description: "Page has been removed from the document.",
    });
  };

  const duplicatePage = (index) => {
    const pageToDuplicate = pages[index];
    const duplicatedPage = {
      ...pageToDuplicate,
      pageNumber: pageToDuplicate.pageNumber + 0.1 // Unique identifier
    };
    
    setPages(prev => {
      const newPages = [...prev];
      newPages.splice(index + 1, 0, duplicatedPage);
      return newPages;
    });
    
    toast({
      title: "Page duplicated",
      description: "Page has been duplicated successfully.",
    });
  };

  const movePage = (fromIndex, direction) => {
    if (
      (direction === 'up' && fromIndex === 0) ||
      (direction === 'down' && fromIndex === pages.length - 1)
    ) {
      return;
    }

    const newPages = [...pages];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    [newPages[fromIndex], newPages[toIndex]] = [newPages[toIndex], newPages[fromIndex]];
    setPages(newPages);
  };

  const selectAllPages = () => {
    setPages(prev => prev.map(page => ({ ...page, selected: true })));
  };

  const deselectAllPages = () => {
    setPages(prev => prev.map(page => ({ ...page, selected: false })));
  };

  const togglePageSelection = (index) => {
    setPages(prev => prev.map((page, i) => 
      i === index ? { ...page, selected: !page.selected } : page
    ));
  };

  const deleteSelectedPages = () => {
    const selectedCount = pages.filter(page => page.selected).length;
    if (selectedCount === pages.length) {
      toast({
        title: "Cannot delete all pages",
        description: "At least one page must remain in the document.",
        variant: "destructive",
      });
      return;
    }

    setPages(prev => prev.filter(page => !page.selected));
    toast({
      title: "Selected pages deleted",
      description: `${selectedCount} page(s) have been removed.`,
    });
  };

  const saveOrganizedPDF = async () => {
    if (pages.length === 0) {
      toast({
        title: "No pages to save",
        description: "Please add at least one page to the document.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const page of pages) {
        // Copy the page from original PDF
        const [copiedPage] = await newPdf.copyPages(originalPdf, [page.originalIndex]);
        
        // Apply rotation if any
        if (page.rotation !== 0) {
          copiedPage.setRotation(degrees(page.rotation));
        }
        
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const filename = file.name.replace(/\.pdf$/i, '_organized.pdf');
      saveAs(blob, filename);

      toast({
        title: "PDF organized successfully!",
        description: `Saved organized PDF with ${pages.length} page(s) as "${filename}".`,
      });

    } catch (error) {
      console.error('Error saving organized PDF:', error);
      toast({
        title: "Failed to save PDF",
        description: "An error occurred while saving the organized PDF.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const faqs = [
    {
      question: 'How do I reorder PDF pages online for free?',
      answer: 'Upload your PDF file, use drag-and-drop to reorder pages in the visual preview, select/deselect pages as needed, then save your organized PDF with the new page order.'
    },
    {
      question: 'Can I rotate pages while organizing them?',
      answer: 'Yes! Each page has rotation controls allowing you to rotate them 90°, 180°, or 270° clockwise while organizing your PDF.'
    },
    {
      question: 'Can I delete unwanted pages from my PDF?',
      answer: 'Absolutely! Select the pages you want to keep or delete unwanted pages individually. Use "Select All" or "Deselect All" for bulk operations.'
    },
    {
      question: 'Will the page quality be affected after reorganizing?',
      answer: 'No, page reorganization maintains the original quality. Only the page order is changed - all content, images, and formatting remain exactly the same.'
    },
    {
      question: 'Can I duplicate pages while organizing?',
      answer: 'Yes, you can duplicate pages by using the duplicate button on each page. This is useful for creating copies of important pages or templates.'
    }
  ];

  const howToSteps = [
    { title: 'Upload PDF File', description: 'Select the PDF document you want to reorganize' },
    { title: 'Organize Pages', description: 'Drag and drop to reorder, rotate, duplicate, or delete pages' },
    { title: 'Select and Manage', description: 'Use selection tools for bulk operations on multiple pages' },
    { title: 'Save Result', description: 'Download your organized PDF with the new page order' }
  ];

  const benefits = [
    'Reorder pages with drag-and-drop interface',
    'Rotate pages to correct orientation',
    'Delete unwanted or blank pages',
    'Duplicate important pages',
    'Visual page thumbnails for easy management',
    'Completely offline processing'
  ];

  const useCases = [
    'Reorder presentation slides',
    'Remove blank or unwanted pages',
    'Correct page orientation in scanned documents',
    'Reorganize report sections',
    'Create custom page sequences',
    'Duplicate pages for forms or templates'
  ];

  return (
    <ToolShell 
      tool={tool} 
      faqs={faqs}
      howToSteps={howToSteps}
      benefits={benefits}
      useCases={useCases}
    >
      <div className="max-w-6xl mx-auto space-y-8">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-sort text-red-400"></i>
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to organize, reorder, and manage pages
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
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center space-x-2">
              <i className="fas fa-spinner fa-spin text-blue-500"></i>
              <span>Loading PDF pages...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Management Tools */}
      {pages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Page Management</CardTitle>
            <CardDescription>
              Organize your PDF pages with drag-and-drop, rotation, and selection tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllPages}
                data-testid="button-select-all"
              >
                <i className="fas fa-check-square mr-2"></i>
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAllPages}
                data-testid="button-deselect-all"
              >
                <i className="fas fa-square mr-2"></i>
                Deselect All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteSelectedPages}
                disabled={pages.filter(p => p.selected).length === 0 || pages.filter(p => p.selected).length === pages.length}
                data-testid="button-delete-selected"
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Selected
              </Button>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              <p>Drag and drop pages to reorder them. Use the controls below each page for rotation and other actions.</p>
              <p>Total pages: {pages.length} | Selected: {pages.filter(p => p.selected).length}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Grid */}
      {pages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Page Organization</CardTitle>
            <CardDescription>
              Drag pages to reorder, rotate them, or delete unwanted pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((page, index) => (
                <div
                  key={`${page.pageNumber}-${index}`}
                  className={`relative border-2 rounded-lg p-2 cursor-move transition-all ${
                    page.selected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  data-testid={`page-${index}`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-1 left-1 z-10">
                    <button
                      onClick={() => togglePageSelection(index)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        page.selected 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                      data-testid={`checkbox-${index}`}
                    >
                      {page.selected && <i className="fas fa-check text-xs"></i>}
                    </button>
                  </div>

                  {/* Page Number */}
                  <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>

                  {/* Page Thumbnail */}
                  <div 
                    className="mb-2 flex items-center justify-center bg-white rounded border"
                    style={{ 
                      transform: `rotate(${page.rotation}deg)`,
                      minHeight: '120px'
                    }}
                  >
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.pageNumber}`}
                      className="max-w-full max-h-28 object-contain"
                    />
                  </div>

                  {/* Page Controls */}
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 px-1 py-1 h-6 text-xs"
                        onClick={() => rotatePage(index, 'left')}
                        data-testid={`rotate-left-${index}`}
                      >
                        <i className="fas fa-undo text-xs"></i>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 px-1 py-1 h-6 text-xs"
                        onClick={() => rotatePage(index, 'right')}
                        data-testid={`rotate-right-${index}`}
                      >
                        <i className="fas fa-redo text-xs"></i>
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 px-1 py-1 h-6 text-xs"
                        onClick={() => duplicatePage(index)}
                        data-testid={`duplicate-${index}`}
                      >
                        <i className="fas fa-copy text-xs"></i>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 px-1 py-1 h-6 text-xs"
                        onClick={() => deletePage(index)}
                        disabled={pages.length === 1}
                        data-testid={`delete-${index}`}
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </Button>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 px-1 py-1 h-6 text-xs"
                        onClick={() => movePage(index, 'up')}
                        disabled={index === 0}
                        data-testid={`move-up-${index}`}
                      >
                        <i className="fas fa-chevron-up text-xs"></i>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 px-1 py-1 h-6 text-xs"
                        onClick={() => movePage(index, 'down')}
                        disabled={index === pages.length - 1}
                        data-testid={`move-down-${index}`}
                      >
                        <i className="fas fa-chevron-down text-xs"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {pages.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={saveOrganizedPDF}
            disabled={processing}
            size="lg"
            className="px-8"
            data-testid="button-save"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Saving PDF...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Organized PDF ({pages.length} pages)
              </>
            )}
          </Button>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How to Organize PDF Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Upload PDF</h4>
                <p className="text-sm text-muted-foreground">Select your PDF file to load all pages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Organize Pages</h4>
                <p className="text-sm text-muted-foreground">Drag and drop to reorder, rotate, duplicate, or delete pages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Select and Manage</h4>
                <p className="text-sm text-muted-foreground">Use selection tools for bulk operations on multiple pages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <div>
                <h4 className="font-medium">Save Result</h4>
                <p className="text-sm text-muted-foreground">Download your organized PDF with the new page order</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </ToolShell>
  );
}