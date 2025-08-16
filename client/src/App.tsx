import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy, useEffect } from "react";

// Layout Components
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import CookieBanner from "./components/Layout/CookieBanner";
import ScrollToTop from "./components/Layout/ScrollToTop";
import PageTransition from "./components/Layout/PageTransition";
import AutoAdsScript from "./components/Ads/AutoAdsScript";
import { AppErrorBoundary } from "./components/Layout/ErrorBoundary";

// Pages
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ToolPage from "./pages/ToolPage";
import LegalPage from "./pages/LegalPage";
import SupportPage from "./pages/SupportPage";
import ReportPage from "./pages/ReportPage";
import FeatureRequestPage from "./pages/FeatureRequestPage";
import NotFound from "./pages/not-found";

// Tool Pages
import PDFMerger from "./pages/tools/pdf/PDFMerger";
import WordCounter from "./pages/tools/text/WordCounter";
import BackgroundRemover from "./pages/tools/image/BackgroundRemover";
import EMICalculator from "./pages/tools/finance/EMICalculator";

// Hooks
import { useTheme } from "./hooks/useTheme";
import { useScrollToTop } from "./hooks/useScrollToTop";

// Performance Utils
import { initializePerformanceOptimizations } from "./utils/performance";

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
      
      {/* Legal Pages - Must come before dynamic routes */}
      <Route path="/legal/privacy" component={() => <LegalPage type="privacy" />} />
      <Route path="/legal/terms" component={() => <LegalPage type="terms" />} />
      <Route path="/legal/cookies" component={() => <LegalPage type="cookies" />} />
      <Route path="/legal/disclaimer" component={() => <LegalPage type="disclaimer" />} />
      <Route path="/about" component={() => <LegalPage type="about" />} />
      <Route path="/contact" component={() => <LegalPage type="contact" />} />
      
      {/* Individual Tool Pages */}
      <Route path="/pdf/merge" component={PDFMerger} />
      <Route path="/text/word-counter" component={WordCounter} />
      <Route path="/image/remove-background" component={BackgroundRemover} />
      <Route path="/finance/emi-calculator" component={EMICalculator} />
      
      {/* Dynamic tool routes - Must come after specific routes */}
      <Route path="/:category/:tool" component={ToolPage} />
      
      {/* Support Pages */}
      <Route path="/help" component={() => <SupportPage type="help" />} />
      <Route path="/guide" component={() => <SupportPage type="guide" />} />
      <Route path="/faq" component={() => <SupportPage type="faq" />} />
      <Route path="/report" component={ReportPage} />
      <Route path="/request" component={FeatureRequestPage} />
      <Route path="/updates" component={() => <SupportPage type="help" />} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Loading component for suspense
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
      <p className="text-slate-300 text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  useTheme(); // Initialize dark theme
  useScrollToTop(); // Auto scroll to top on route changes

  // Initialize performance optimizations
  useEffect(() => {
    const cleanup = initializePerformanceOptimizations();
    
    // Performance monitoring for high traffic
    const monitorPerformance = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round((memory as any).usedJSHeapSize / 1048576);
        const limitMB = Math.round((memory as any).jsHeapSizeLimit / 1048576);
        
        if (usedMB > limitMB * 0.8) {
          console.warn(`High memory usage: ${usedMB}MB / ${limitMB}MB`);
        }
      }
    };

    const performanceInterval = setInterval(monitorPerformance, 30000);
    
    return () => {
      if (cleanup && typeof cleanup.cleanup === 'function') {
        cleanup.cleanup();
      }
      clearInterval(performanceInterval);
    };
  }, []);

  return (
    <AppErrorBoundary>
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
              <Suspense fallback={<LoadingSpinner />}>
                <PageTransition>
                  <Router />
                </PageTransition>
              </Suspense>
            </main>
            
            <Footer />
            <CookieBanner />
            <ScrollToTop />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
