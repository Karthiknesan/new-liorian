import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error boundary caught an error:', error, errorInfo);
    console.error('🔍 Error stack:', error.stack);
    console.error('🔍 Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold flex items-center justify-center px-4">
          <div className="max-w-md w-full glass-effect p-8 rounded-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-bold text-premium-dark mb-4">
              Something went wrong
            </h1>
            <p className="text-premium-dark/80 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="premium-gradient text-premium-dark px-6 py-3 rounded-full font-bold transition-all duration-300 premium-hover"
            >
              Refresh Page
            </button>
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-premium-gold hover:text-premium-bronze transition-colors text-sm"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
