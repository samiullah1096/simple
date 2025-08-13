import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function PDFMetadataEditor() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
    creationDate: '',
    modificationDate: ''
  });
  const [originalMetadata, setOriginalMetadata] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleFileChange = useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Extract existing metadata
        const title = pdfDoc.getTitle() || '';
        const author = pdfDoc.getAuthor() || '';
        const subject = pdfDoc.getSubject() || '';
        const keywords = pdfDoc.getKeywords() || '';
        const creator = pdfDoc.getCreator() || '';
        const producer = pdfDoc.getProducer() || '';
        const creationDate = pdfDoc.getCreationDate()?.toISOString().split('T')[0] || '';
        const modificationDate = pdfDoc.getModificationDate()?.toISOString().split('T')[0] || '';
        
        const extractedMetadata = {
          title,
          author,
          subject,
          keywords,
          creator,
          producer,
          creationDate,
          modificationDate
        };
        
        setOriginalMetadata(extractedMetadata);
        setMetadata(extractedMetadata);
      } catch (err) {
        console.error('Error extracting metadata:', err);
        setError('Failed to extract PDF metadata. The file might be corrupted.');
      }
    } else {
      setError('Please select a valid PDF file');
    }
  }, []);

  const handleMetadataChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMetadata = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Update metadata
      if (metadata.title) pdfDoc.setTitle(metadata.title);
      if (metadata.author) pdfDoc.setAuthor(metadata.author);
      if (metadata.subject) pdfDoc.setSubject(metadata.subject);
      if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords);
      if (metadata.creator) pdfDoc.setCreator(metadata.creator);
      if (metadata.producer) pdfDoc.setProducer(metadata.producer);
      
      if (metadata.creationDate) {
        pdfDoc.setCreationDate(new Date(metadata.creationDate));
      }
      
      if (metadata.modificationDate) {
        pdfDoc.setModificationDate(new Date(metadata.modificationDate));
      } else {
        pdfDoc.setModificationDate(new Date());
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      const fileName = file.name.replace('.pdf', '_metadata_updated.pdf');
      saveAs(blob, fileName);
      
      toast({
        title: "Success!",
        description: "PDF metadata has been updated successfully.",
      });
    } catch (err) {
      console.error('Error updating metadata:', err);
      setError('Failed to update PDF metadata. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const resetMetadata = () => {
    if (originalMetadata) {
      setMetadata(originalMetadata);
    }
  };

  const clearMetadata = () => {
    setMetadata({
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: '',
      creationDate: '',
      modificationDate: ''
    });
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">
              <i className="fas fa-info-circle text-red-400 mr-3"></i>
              PDF Metadata Editor
            </h1>
            <p className="text-xl text-slate-400">
              Edit PDF metadata including title, author, and document properties
            </p>
          </div>

          <Card className="glassmorphism border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Upload PDF File</CardTitle>
              <CardDescription className="text-slate-400">
                Select a PDF file to view and edit its metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {file && originalMetadata && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="text-slate-300">Title</Label>
                      <Input
                        id="title"
                        value={metadata.title}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Document title"
                        data-testid="input-title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="author" className="text-slate-300">Author</Label>
                      <Input
                        id="author"
                        value={metadata.author}
                        onChange={(e) => handleMetadataChange('author', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Document author"
                        data-testid="input-author"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                      <Input
                        id="subject"
                        value={metadata.subject}
                        onChange={(e) => handleMetadataChange('subject', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Document subject"
                        data-testid="input-subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="creator" className="text-slate-300">Creator</Label>
                      <Input
                        id="creator"
                        value={metadata.creator}
                        onChange={(e) => handleMetadataChange('creator', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Application that created the document"
                        data-testid="input-creator"
                      />
                    </div>

                    <div>
                      <Label htmlFor="producer" className="text-slate-300">Producer</Label>
                      <Input
                        id="producer"
                        value={metadata.producer}
                        onChange={(e) => handleMetadataChange('producer', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        placeholder="Application that produced the PDF"
                        data-testid="input-producer"
                      />
                    </div>

                    <div>
                      <Label htmlFor="creationDate" className="text-slate-300">Creation Date</Label>
                      <Input
                        id="creationDate"
                        type="date"
                        value={metadata.creationDate}
                        onChange={(e) => handleMetadataChange('creationDate', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        data-testid="input-creation-date"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-slate-300">Keywords</Label>
                    <Textarea
                      id="keywords"
                      value={metadata.keywords}
                      onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-slate-100"
                      placeholder="Comma-separated keywords"
                      rows={3}
                      data-testid="input-keywords"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={updateMetadata}
                      disabled={processing}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      data-testid="button-update-metadata"
                    >
                      {processing ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Update Metadata
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={resetMetadata}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="button-reset-metadata"
                    >
                      <i className="fas fa-undo mr-2"></i>
                      Reset to Original
                    </Button>

                    <Button
                      onClick={clearMetadata}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="button-clear-metadata"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {originalMetadata && (
            <Card className="glassmorphism border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-slate-100">Original Metadata</CardTitle>
                <CardDescription className="text-slate-400">
                  The metadata that was extracted from the uploaded PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Title:</span>
                    <p className="text-slate-100">{originalMetadata.title || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Author:</span>
                    <p className="text-slate-100">{originalMetadata.author || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Subject:</span>
                    <p className="text-slate-100">{originalMetadata.subject || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Creator:</span>
                    <p className="text-slate-100">{originalMetadata.creator || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Producer:</span>
                    <p className="text-slate-100">{originalMetadata.producer || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Creation Date:</span>
                    <p className="text-slate-100">{originalMetadata.creationDate || 'Not set'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400">Keywords:</span>
                    <p className="text-slate-100">{originalMetadata.keywords || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}