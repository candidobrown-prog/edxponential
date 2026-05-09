import React from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Error Boundary Component
 * Catches React errors and displays graceful fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    if (window.__SENTRY__) {
      window.__SENTRY__.captureException(error, { contexts: { react: errorInfo } });
    }
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <h1 className="text-2xl font-black text-black mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-8 text-sm">
              We've logged this error and our team is looking into it. In the meantime, try refreshing the page or returning home.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>

              <Link to="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </Link>
            </div>

            {/* eslint-disable-next-line no-undef */}
            {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
              <details className="mt-6 text-left bg-muted p-4 rounded-lg">
                <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="text-[10px] text-destructive mt-3 overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;