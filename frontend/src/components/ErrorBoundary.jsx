import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="max-w-xl w-full bg-white rounded-lg shadow-xl p-8 border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                        <p className="text-slate-600 mb-4">
                            The application encountered a critical error.
                        </p>
                        <div className="bg-slate-100 p-4 rounded text-xs font-mono overflow-auto max-h-64 mb-6">
                            <p className="font-bold text-slate-800">{this.state.error && this.state.error.toString()}</p>
                            <pre className="mt-2 text-slate-500">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </div>
                        <button
                            onClick={() => {
                                sessionStorage.clear();
                                window.location.href = '/login';
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                            Clear Session & Back to Login
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
