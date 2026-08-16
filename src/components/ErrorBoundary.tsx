import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Meezan Platform:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080C1C] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold mb-3">حدث خطأ غير متوقع في المنصة</h1>
          <p className="text-gray-400 max-w-md mb-6 text-sm leading-relaxed">
            حدث أخطاء غير متوقعة أثناء تحميل الصفحة. يرجى محاولة إعادة التحميل أو مسح البيانات المؤقتة.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              إعادة تحميل الصفحة
            </button>
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-colors cursor-pointer"
            >
              إعادة ضبط البيانات المؤقتة
            </button>
          </div>
          {this.state.error && (
            <details className="mt-8 text-left text-xs text-gray-500 bg-gray-900/60 p-4 rounded-lg max-w-xl overflow-auto border border-gray-800 dir-ltr">
              <summary className="cursor-pointer mb-2 font-mono">Error Details</summary>
              <pre className="whitespace-pre-wrap font-mono text-red-400">{this.state.error.toString()}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
