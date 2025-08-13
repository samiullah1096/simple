import { useParams } from 'wouter';
import { getToolBySlug } from '../lib/toolsIndex';
import PDFMerger from './tools/pdf/PDFMerger';
import WordCounter from './tools/text/WordCounter';
import BackgroundRemover from './tools/image/BackgroundRemover';
import EMICalculator from './tools/finance/EMICalculator';
import NotFound from './not-found';

// Tool component mapping
const TOOL_COMPONENTS = {
  'pdf/merge': PDFMerger,
  'pdf/split': () => <div>PDF Splitter - Coming Soon</div>,
  'pdf/compress': () => <div>PDF Compressor - Coming Soon</div>,
  'text/word-counter': WordCounter,
  'text/case-converter': () => <div>Case Converter - Coming Soon</div>,
  'image/remove-background': BackgroundRemover,
  'image/resize': () => <div>Image Resizer - Coming Soon</div>,
  'finance/emi-calculator': EMICalculator,
  'finance/sip-calculator': () => <div>SIP Calculator - Coming Soon</div>,
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
