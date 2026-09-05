import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import './Button.css';

export type ButtonSize = 'S' | 'M' | 'L';
export type ButtonVariant = 'filled' | 'outlined' | 'text';
export type ButtonIntent = 'primary' | 'secondary' | 'success' | 'destructive';

export const buttonClasses = {
  group: {
    filled: 'ds-button--filled',
    outlined: 'ds-button--outlined',
    text: 'ds-button--text',
  },
  variant: {
    primary: 'ds-button--primary',
    secondary: 'ds-button--secondary',
    success: 'ds-button--success',
    destructive: 'ds-button--destructive',
  },
  size: {
    S: 'ds-button--s',
    M: 'ds-button--m',
    L: 'ds-button--l',
  },
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  intent?: ButtonIntent;
}

export const Button = forwardRef(function Button(
  {
    children,
    className = '',
    disabled = false,
    intent = 'primary',
    loading = false,
    size = 'M',
    type = 'button',
    variant = 'filled',
    ...buttonProps
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const classes = ['ds-button', buttonClasses.size[size], buttonClasses.group[variant], buttonClasses.variant[intent], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      aria-busy={loading || undefined}
      className={classes}
      disabled={loading || disabled}
      type={type}
      {...buttonProps}
    >
      {loading && <span className="ds-button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';