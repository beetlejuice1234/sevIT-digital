import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Mail } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      const errorDetails = `Error: ${this.state.error?.message}\n\nStack Trace:\n${this.state.errorInfo?.componentStack}`;
      const mailtoLink = `mailto:sevit@sevitdigital.com?subject=sevIT%20Ops%20Report:%20Application%20Crash&body=Please%20describe%20what%20you%20were%20doing%20before%20the%20crash:%0A%0A%0A%0A---%20Error%20Details%20For%20Devs%20---%0A${encodeURIComponent(errorDetails)}`;

      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4 text-center z-[100] relative">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Application Error</h1>
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            The UI encountered an unexpected crash. Don't worry, your data is safe. Please report this to our engineering team so we can fix it immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 min-h-[44px] rounded-full bg-foreground text-background font-medium hover:scale-105 active:scale-95 transition-all shadow-lg"
              aria-label="Reload the current page"
            >
              Reload Page
            </button>
            <a
              href={mailtoLink}
              className="flex items-center justify-center gap-2 px-8 py-3 min-h-[44px] rounded-full border border-border text-foreground font-medium hover:bg-surface hover:border-foreground/20 transition-colors"
              aria-label="Send crash report via email"
            >
              <Mail className="w-5 h-5 text-accent" aria-hidden="true" />
              Report to sevIT Ops
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
