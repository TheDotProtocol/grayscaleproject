"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class WorkspaceErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card flex flex-col items-center gap-4 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-400" />
          <div>
            <p className="font-semibold text-white">{this.props.fallbackTitle ?? "Something went wrong"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{this.state.message}</p>
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-foreground/80 hover:border-white/20"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
