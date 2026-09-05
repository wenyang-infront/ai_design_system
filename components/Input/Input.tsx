import type { InputHTMLAttributes } from 'react';
import './Input.css';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label: string; hint?: string; error?: string; }
export function Input({ error, hint, id, label, ...props }: InputProps) {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  return <label className="ds-field" htmlFor={inputId}><span className="ds-field__label">{label}</span><input {...props} aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined} aria-invalid={error ? true : undefined} className="ds-field__control" id={inputId} />{hint && !error && <span className="ds-field__hint" id={hintId}>{hint}</span>}{error && <span className="ds-field__error" id={errorId}>{error}</span>}</label>;
}