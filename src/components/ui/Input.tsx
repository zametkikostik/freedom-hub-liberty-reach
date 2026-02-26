import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';

    return (
      <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-cyber-cyan">
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center rounded-xl border bg-cyber-gray/50',
            'transition-all duration-200',
            error
              ? 'border-cyber-red focus-within:border-cyber-red focus-within:ring-2 focus-within:ring-cyber-red/20'
              : 'border-white/10 focus-within:border-cyber-cyan focus-within:ring-2 focus-within:ring-cyber-cyan/20',
            fullWidth && 'w-full',
            className
          )}
        >
          {leftIcon && (
            <div className="pl-3 text-gray-400">{leftIcon}</div>
          )}
          <input
            type={isPassword && showPassword ? 'text' : type}
            className={cn(
              'w-full bg-transparent px-3 py-3 text-white placeholder-gray-500',
              'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-2',
              (rightIcon || isPassword) && 'pr-10',
              !leftIcon && !rightIcon && !isPassword && 'px-3'
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-cyber-cyan transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="pr-3 text-gray-400">{rightIcon}</div>
          )}
        </div>
        {error && (
          <p className="text-sm text-cyber-red">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
