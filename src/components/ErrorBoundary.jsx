import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
              <p className="text-gray-400">
                We encountered an unexpected error. This might be a temporary issue.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleReload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-gray-800 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Error Details (Development)</h3>
                <pre className="text-xs text-gray-300 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;