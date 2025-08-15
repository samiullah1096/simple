import { useState, useCallback } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';
import { TOOLS } from '../../../lib/toolsIndex';
import { PDFDocument, PDFForm } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

export default function PDFFormFiller() {
  const tool = TOOLS.pdf.find(t => t.slug === 'form-filler');
  const [file, setFile] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleFileChange = useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setFormFields([]);
      setFieldValues({});
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        if (fields.length === 0) {
          setError('This PDF does not contain any fillable form fields.');
          return;
        }
        
        const formFieldsData = fields.map((field, index) => {
          const fieldName = field.getName();
          const fieldType = field.constructor.name;
          
          let fieldInfo = {
            id: index,
            name: fieldName,
            type: fieldType,
            required: false,
            value: ''
          };
          
          // Get current value if exists
          try {
            if (fieldType === 'PDFTextField') {
              fieldInfo.value = field.getText() || '';
            } else if (fieldType === 'PDFCheckBox') {
              fieldInfo.value = field.isChecked();
            } else if (fieldType === 'PDFRadioGroup') {
              fieldInfo.value = field.getSelected() || '';
              fieldInfo.options = field.getOptions();
            } else if (fieldType === 'PDFDropdown') {
              fieldInfo.value = field.getSelected() || '';
              fieldInfo.options = field.getOptions();
            }
          } catch (err) {
            console.warn('Error reading field value:', err);
          }
          
          return fieldInfo;
        });
        
        setFormFields(formFieldsData);
        
        // Initialize field values
        const initialValues = {};
        formFieldsData.forEach(field => {
          initialValues[field.name] = field.value;
        });
        setFieldValues(initialValues);
        
      } catch (err) {
        console.error('Error processing PDF form:', err);
        setError('Failed to process PDF form. The file might be corrupted or password-protected.');
      }
    } else {
      setError('Please select a valid PDF file');
    }
  }, []);

  const handleFieldValueChange = (fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const fillForm = async () => {
    if (!file || formFields.length === 0) {
      setError('Please select a PDF file with form fields first');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      // Fill form fields
      formFields.forEach(fieldInfo => {
        try {
          const field = form.getField(fieldInfo.name);
          const value = fieldValues[fieldInfo.name];
          
          if (fieldInfo.type === 'PDFTextField' && value) {
            field.setText(String(value));
          } else if (fieldInfo.type === 'PDFCheckBox') {
            if (value) {
              field.check();
            } else {
              field.uncheck();
            }
          } else if (fieldInfo.type === 'PDFRadioGroup' && value) {
            field.select(value);
          } else if (fieldInfo.type === 'PDFDropdown' && value) {
            field.select(value);
          }
        } catch (err) {
          console.warn(`Error filling field ${fieldInfo.name}:`, err);
        }
      });

      // Flatten the form to make it non-editable (optional)
      // form.flatten();

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      const fileName = file.name.replace('.pdf', '_filled.pdf');
      saveAs(blob, fileName);
      
      toast({
        title: "Success!",
        description: "PDF form has been filled successfully.",
      });
    } catch (err) {
      console.error('Error filling form:', err);
      setError('Failed to fill PDF form. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const clearForm = () => {
    const clearedValues = {};
    formFields.forEach(field => {
      clearedValues[field.name] = field.type === 'PDFCheckBox' ? false : '';
    });
    setFieldValues(clearedValues);
  };

  const renderFormField = (field) => {
    const value = fieldValues[field.name] || '';
    
    switch (field.type) {
      case 'PDFTextField':
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
            className="bg-slate-800 border-slate-600 text-slate-100"
            placeholder={`Enter ${field.name}`}
            data-testid={`input-${field.name}`}
          />
        );
      
      case 'PDFCheckBox':
        return (
          <Checkbox
            checked={value}
            onCheckedChange={(checked) => handleFieldValueChange(field.name, checked)}
            className="border-slate-600"
            data-testid={`checkbox-${field.name}`}
          />
        );
      
      case 'PDFRadioGroup':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}-${index}`}
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                  className="text-red-600"
                  data-testid={`radio-${field.name}-${index}`}
                />
                <label htmlFor={`${field.name}-${index}`} className="text-slate-300">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'PDFDropdown':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-slate-100 rounded-md px-3 py-2"
            data-testid={`select-${field.name}`}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <div className="text-slate-400 italic">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  const faqs = [
    {
      question: 'How do I fill PDF forms online for free?',
      answer: 'Upload your PDF form, and our tool will detect all fillable fields. Enter text, check boxes, or select options, then download your completed form. All processing happens in your browser.'
    },
    {
      question: 'What types of form fields are supported?',
      answer: 'We support text fields, checkboxes, radio buttons, and dropdown menus. Our tool automatically detects and displays all fillable form elements in your PDF.'
    },
    {
      question: 'Is it safe to fill forms online?',
      answer: 'Yes, completely safe. All form filling happens locally in your browser using client-side JavaScript. Your data never leaves your device or gets uploaded to any servers.'
    },
    {
      question: 'Can I save partially filled forms?',
      answer: 'You can clear all fields and start over using the "Clear All" button, or fill out all fields and download the completed form. The tool preserves your entered data during the session.'
    },
    {
      question: 'What if my PDF has no fillable fields?',
      answer: 'If your PDF contains no fillable form fields, our tool will notify you. You may need to use a different PDF that was created with form fields, or convert your document to a fillable form first.'
    }
  ];

  const howToSteps = [
    { title: 'Upload PDF Form', description: 'Select a PDF file containing fillable form fields' },
    { title: 'Fill Out Fields', description: 'Enter text, check boxes, and select options in detected form fields' },
    { title: 'Review Data', description: 'Check all filled information for accuracy and completeness' },
    { title: 'Download Completed Form', description: 'Get your filled PDF form ready for submission' }
  ];

  const benefits = [
    'Fill PDF forms without printing',
    'Support for all common field types',
    'Automatically detect form fields',
    'Clear and restart functionality',
    'Completely offline processing',
    'Professional form completion'
  ];

  const useCases = [
    'Complete job application forms',
    'Fill out tax and government forms',
    'Submit insurance claim forms',
    'Complete registration and enrollment forms',
    'Fill contract and agreement forms',
    'Process survey and feedback forms'
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
              <i className="fas fa-edit text-red-400 mr-3"></i>
              PDF Form Filler
            </h1>
            <p className="text-xl text-slate-400">
              Fill PDF forms digitally with text, checkboxes, and selections
            </p>
          </div>

          <Card className="glassmorphism border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Upload PDF Form</CardTitle>
              <CardDescription className="text-slate-400">
                Select a PDF file with fillable form fields
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

              {formFields.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-100">
                      Form Fields ({formFields.length})
                    </h3>
                    <Button
                      onClick={clearForm}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="button-clear-form"
                    >
                      <i className="fas fa-eraser mr-2"></i>
                      Clear All
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label className="text-slate-300 flex items-center gap-2">
                          {field.name}
                          <span className="text-xs text-slate-500">({field.type.replace('PDF', '')})</span>
                        </Label>
                        {renderFormField(field)}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={fillForm}
                      disabled={processing}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      data-testid="button-fill-form"
                    >
                      {processing ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Filling Form...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-download mr-2"></i>
                          Download Filled PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </ToolShell>
  );
}