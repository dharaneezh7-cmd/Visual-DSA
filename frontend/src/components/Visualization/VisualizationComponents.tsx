import type { ReactNode } from 'react';
import './VisualizationComponents.css';

interface VisualizationPanelProps {
  title: string;
  children: ReactNode;
}

export function VisualizationPanel({ title, children }: VisualizationPanelProps) {
  return (
    <div className="viz-panel">
      <h2 className="viz-title">{title}</h2>
      <div className="viz-content">{children}</div>
    </div>
  );
}

interface ControlPanelProps {
  children: ReactNode;
}

export function ControlPanel({ children }: ControlPanelProps) {
  return <div className="control-panel">{children}</div>;
}

interface AnimationAreaProps {
  children: ReactNode;
  className?: string;
}

export function AnimationArea({ children, className = '' }: AnimationAreaProps) {
  return <div className={`animation-area ${className}`}>{children}</div>;
}

interface StatusMessageProps {
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export function StatusMessage({ type, message }: StatusMessageProps) {
  if (!message) return null;
  return <div className={`status-message status-${type}`}>{message}</div>;
}
