import React, { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-card">
            <div className="error-icon-wrapper">
              <AlertCircle size={40} className="error-icon" />
            </div>
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-text">
              We encountered an unexpected UI crash. Click the button below to refresh the page and restore your progress.
            </p>
            {this.state.error && (
              <pre className="error-details">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button onClick={this.handleReset} className="theme-toggle-btn btn-primary error-btn">
              <RefreshCw size={16} />
              <span>Refresh App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
