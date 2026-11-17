import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application Error:', error, info);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#1c2541] text-slate-100">
          <div className="max-w-md w-full bg-[#273259] border border-indigo-200/20 rounded-3xl p-6 text-center shadow-xl">
            <h1 className="font-display text-2xl font-extrabold text-slate-50 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-300 mb-5">
              A temporary error interrupted the mission. Reload to continue practicing irregular verbs.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-sm cursor-pointer"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
