import React, { Component } from "react";
import { Link } from "react-router-dom";

/**
 * ErrorBoundary catches JS errors in its child component tree,
 * logs them, and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      return (
        <div
          className="error-boundary"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "4rem 2rem",
            backgroundColor: "#fff0f6",
            color: "#d32029",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
            😵 Oops! Something went wrong.
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              marginBottom: "2rem",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            {error?.message ||
              "An unexpected error occurred. Please try again later."}
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "2.5rem",
            }}
          >
            <button
              onClick={this.handleReload}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#d32029",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🔄 Reload Page
            </button>

            <Link
              to="/"
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#000",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
              }}
            >
              🏠 Go Home
            </Link>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details
              open
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                color: "#000",
                backgroundColor: "#fff",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                maxWidth: "800px",
                overflowX: "auto",
                textAlign: "left",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                🔍 Developer Stack Trace
              </summary>
              <div style={{ marginTop: "1rem" }}>
                {error?.stack || errorInfo?.componentStack}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
