"use client";

import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(_) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-600 mb-4">
              We&apos;re sorry for the inconvenience. Please try refreshing the
              page or contact support if the problem persists.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-[var(--color)] hover:bg-[var(--hover)] text-white font-bold py-2 px-4 rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
