import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';


export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-slate-800',
  secondary: 'bg-secondary text-white hover:bg-blue-600',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
  success: 'bg-green-600 text-white hover:bg-green-500',
  danger: 'bg-red-600 text-white hover:bg-red-500',
};

// eslint-disable-next-line react-refresh/only-export-components
export function buttonClasses(variant: ButtonVariant = 'primary'): string {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  children: ReactNode;
}


export default function Button({
  variant = 'primary',
  icon: Icon,
  children,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={`${buttonClasses(variant)} ${className}`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}