import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlassButton } from './GlassButton';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-full flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-display text-[var(--text-main)] mb-1">
              Something went wrong
            </h3>
            <p className="text-[10px] font-tech text-[var(--text-muted)] uppercase tracking-widest mb-4">
              {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={this.handleReset}
            className="gap-2"
          >
            <RefreshCw size={14} />
            Try Again
          </GlassButton>
        </div>
      );
    }

    return this.props.children;
  }
}
