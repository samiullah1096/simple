import { useParams } from 'wouter';
import { getToolBySlug } from '../lib/toolsIndex';
import NotFound from './not-found';

// PDF Tools
import PDFMerger from './tools/pdf/PDFMerger';
import PDFSplitter from './tools/pdf/PDFSplitter';
import PDFCompressor from './tools/pdf/PDFCompressor';
import PDFToWord from './tools/pdf/PDFToWord';
import WordToPDF from './tools/pdf/WordToPDF';
import PDFToJPG from './tools/pdf/PDFToJPG';
import JPGToPDF from './tools/pdf/JPGToPDF';
import PDFPasswordRemover from './tools/pdf/PDFPasswordRemover';
import PDFPasswordProtector from './tools/pdf/PDFPasswordProtector';
import PDFWatermark from './tools/pdf/PDFWatermark';
import PDFPageOrganizer from './tools/pdf/PDFPageOrganizer';
import PDFTextExtractor from './tools/pdf/PDFTextExtractor';
import PDFMetadataEditor from './tools/pdf/PDFMetadataEditor';
import PDFFormFiller from './tools/pdf/PDFFormFiller';
import PDFSignature from './tools/pdf/PDFSignature';

// Image Tools
import BackgroundRemover from './tools/image/BackgroundRemover';
import ImageResizer from './tools/image/ImageResizer';
import ImageCompressor from './tools/image/ImageCompressor';
import ImageConverter from './tools/image/ImageConverter';
import ImageCropper from './tools/image/ImageCropper';
import ImageFilters from './tools/image/ImageFilters';
import ImageWatermark from './tools/image/ImageWatermark';
import ImageUpscaler from './tools/image/ImageUpscaler';
import PhotoFrameStudio from './tools/image/PhotoFrameStudio';
import ImageExifRemover from './tools/image/ImageExifRemover';
import ImageBlurTool from './tools/image/ImageBlurTool';
import ImageCollageMaker from './tools/image/ImageCollageMaker';
import QRCodeGenerator from './tools/image/QRCodeGenerator';
import BatchImageProcessor from './tools/image/BatchImageProcessor';

// Text Tools
import WordCounter from './tools/text/WordCounter';
import CaseConverter from './tools/text/CaseConverter';

// Audio Tools
import AudioConverter from './tools/audio/AudioConverter';

// Finance Tools
import EMICalculator from './tools/finance/EMICalculator';

// Tool component mapping
const TOOL_COMPONENTS = {
  // PDF Tools
  'pdf/merge': PDFMerger,
  'pdf/split': PDFSplitter,
  'pdf/compress': PDFCompressor,
  'pdf/to-word': PDFToWord,
  'pdf/word-to-pdf': WordToPDF,
  'pdf/to-jpg': PDFToJPG,
  'pdf/jpg-to-pdf': JPGToPDF,
  'pdf/remove-password': PDFPasswordRemover,
  'pdf/add-password': PDFPasswordProtector,
  'pdf/watermark': PDFWatermark,
  'pdf/organize': PDFPageOrganizer,
  'pdf/extract-text': PDFTextExtractor,
  'pdf/metadata': PDFMetadataEditor,
  'pdf/form-filler': PDFFormFiller,
  'pdf/signature': PDFSignature,
  
  // Image Tools
  'image/remove-background': BackgroundRemover,
  'image/resize': ImageResizer,
  'image/compress': ImageCompressor,
  'image/convert': ImageConverter,
  'image/crop': ImageCropper,
  'image/filters': ImageFilters,
  'image/watermark': ImageWatermark,
  'image/upscale': ImageUpscaler,
  'image/frames': PhotoFrameStudio,
  'image/remove-exif': ImageExifRemover,
  'image/blur': ImageBlurTool,
  'image/collage': ImageCollageMaker,
  'image/qr-generator': QRCodeGenerator,
  'image/batch-process': BatchImageProcessor,
  
  // Text Tools
  'text/word-counter': WordCounter,
  'text/case-converter': CaseConverter,
  
  // Audio Tools
  'audio/convert': AudioConverter,
  
  // Finance Tools
  'finance/emi-calculator': EMICalculator,
};

export default function ToolPage() {
  const params = useParams();
  const { category, tool: toolSlug } = params;
  
  const tool = getToolBySlug(category, toolSlug);
  
  if (!tool) {
    return <NotFound />;
  }

  const toolKey = `${category}/${toolSlug}`;
  const ToolComponent = TOOL_COMPONENTS[toolKey];
  
  if (!ToolComponent) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="glassmorphism rounded-2xl p-12 text-center max-w-2xl mx-4">
          <i className="fas fa-tools text-6xl text-slate-400 mb-6"></i>
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Tool Under Development</h1>
          <p className="text-slate-400 mb-8">
            The <strong>{tool.name}</strong> tool is currently being developed and will be available soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl transition-colors"
              data-testid="button-go-back"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Go Back
            </button>
            <a 
              href={`/${category}`}
              className="glassmorphism hover:bg-slate-700/50 text-slate-100 px-6 py-3 rounded-xl transition-colors inline-flex items-center"
              data-testid="link-category"
            >
              <i className="fas fa-th-large mr-2"></i>
              View All {category.charAt(0).toUpperCase() + category.slice(1)} Tools
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return <ToolComponent />;
}
