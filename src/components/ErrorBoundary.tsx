import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;

  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Portal continuity catch:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('intellect_bank_user_email');
    } catch {
      // safe fallback
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="card bg-white border border-slate-200 shadow-sm rounded-xl p-8 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Portal Continuity Notice
            </h2>
            <p className="text-sm text-slate-600">
              An unexpected render event occurred. You can safely reload the banking session or return to the sign-in screen.
            </p>
            {this.state.error && (
              <div className="text-[11px] font-mono bg-slate-50 p-2.5 rounded text-slate-600 text-left overflow-x-auto border border-slate-200">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
