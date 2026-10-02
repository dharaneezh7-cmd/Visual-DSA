import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
}
