import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="sp-container h-full">
          <h3 className="sp-title">Error</h3>
          <div className="p-4 text-center block" style={{ height: 'calc(100% - 30px)', overflow: 'visible' }}>
            <div className="bg-red-900/30 border border-red-700 rounded-md p-4 text-red-400 mb-4">
              <h4 className="text-lg font-bold mb-2">Something went wrong</h4>

              {this.state.error && (
                <div className="mt-4 text-sm overflow-auto max-h-48 text-left bg-[#0d1117] p-3 rounded">
                  <p>{this.state.error.toString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
