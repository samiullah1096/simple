import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion } from 'framer-motion';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 text-center"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-slate-300 mb-6">
          Don't worry - this issue has been logged and our team will fix it soon.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </button>
          
          <a
            href="/"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <i className="fas fa-home mr-2"></i>
            Go Home
          </a>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-slate-400 text-sm cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-400 bg-slate-900 p-3 rounded overflow-auto max-h-32">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </motion.div>
    </div>
  );
}

export function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to monitoring service in production
        console.error('Application Error:', error, errorInfo);
        
        // In production, you would send this to your error tracking service
        // like Sentry, LogRocket, etc.
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
      onReset={() => {
        // Clear any cached data that might be causing issues
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;