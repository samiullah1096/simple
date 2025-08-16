import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout Components
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import CookieBanner from "./components/Layout/CookieBanner";
import ScrollToTop from "./components/Layout/ScrollToTop";
import PageTransition from "./components/Layout/PageTransition";
import AutoAdsScript from "./components/Ads/AutoAdsScript";

// Pages
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ToolPage from "./pages/ToolPage";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/not-found";

// Tool Pages
import PDFMerger from "./pages/tools/pdf/PDFMerger";
import WordCounter from "./pages/tools/text/WordCounter";
import BackgroundRemover from "./pages/tools/image/BackgroundRemover";
import EMICalculator from "./pages/tools/finance/EMICalculator";

// Hooks
import { useTheme } from "./hooks/useTheme";
import { useScrollToTop } from "./hooks/useScrollToTop";

function Router() {
  return (
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />
      
      {/* Category Pages */}
      <Route path="/pdf" component={() => <CategoryPage category="pdf" />} />
      <Route path="/image" component={() => <CategoryPage category="image" />} />
      <Route path="/audio" component={() => <CategoryPage category="audio" />} />
      <Route path="/text" component={() => <CategoryPage category="text" />} />
      <Route path="/productivity" component={() => <CategoryPage category="productivity" />} />
      <Route path="/finance" component={() => <CategoryPage category="finance" />} />
      
      {/* Individual Tool Pages */}
      <Route path="/pdf/merge" component={PDFMerger} />
      <Route path="/text/word-counter" component={WordCounter} />
      <Route path="/image/remove-background" component={BackgroundRemover} />
      <Route path="/finance/emi-calculator" component={EMICalculator} />
      
      {/* Dynamic tool routes */}
      <Route path="/:category/:tool" component={ToolPage} />
      
      {/* Legal Pages */}
      <Route path="/legal/privacy" component={() => <LegalPage type="privacy" />} />
      <Route path="/legal/terms" component={() => <LegalPage type="terms" />} />
      <Route path="/legal/disclaimer" component={() => <LegalPage type="disclaimer" />} />
      <Route path="/about" component={() => <LegalPage type="about" />} />
      <Route path="/contact" component={() => <LegalPage type="contact" />} />
      
      {/* Support Pages - Redirect to relevant sections */}
      <Route path="/help" component={() => <LegalPage type="about" />} />
      <Route path="/guide" component={() => <LegalPage type="about" />} />
      <Route path="/faq" component={() => <LegalPage type="about" />} />
      <Route path="/report" component={() => <LegalPage type="contact" />} />
      <Route path="/request" component={() => <LegalPage type="contact" />} />
      <Route path="/updates" component={() => <LegalPage type="about" />} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useTheme(); // Initialize dark theme
  useScrollToTop(); // Auto scroll to top on route changes

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
          <AutoAdsScript />
          
          {/* Skip to main content for accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg font-medium z-50">
            Skip to main content
          </a>
          
          <Header />
          
          <main id="main-content">
            <PageTransition>
              <Router />
            </PageTransition>
          </main>
          
          <Footer />
          <CookieBanner />
          <ScrollToTop />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
