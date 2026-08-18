import type { ReactNode } from 'react';

interface Props {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}

export default function Field({ label, htmlFor, children, hint }: Props) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}