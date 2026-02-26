import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 rounded-xl font-medium 
   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
   focus:ring-offset-cyber-black disabled:opacity-50 disabled:cursor-not-allowed
   disabled:pointer-events-none active:scale-[0.98]`,
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-cyber-cyan to-cyber-cyan-dark
          text-cyber-black hover:from-cyber-cyan hover:to-cyber-cyan
          shadow-neon-cyan focus:ring-cyber-cyan
        `,
        secondary: `
          bg-gradient-to-r from-cyber-purple to-cyber-purple-dark
          text-white hover:from-cyber-purple hover:to-cyber-purple
          shadow-neon-purple focus:ring-cyber-purple
        `,
        accent: `
          bg-gradient-to-r from-cyber-pink to-cyber-pink-dark
          text-white hover:from-cyber-pink hover:to-cyber-pink
          shadow-neon-pink focus:ring-cyber-pink
        `,
        success: `
          bg-gradient-to-r from-cyber-green to-cyber-green-dark
          text-cyber-black hover:from-cyber-green hover:to-cyber-green
          shadow-neon-green focus:ring-cyber-green
        `,
        outline: `
          border-2 border-cyber-cyan/50 bg-transparent
          text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan
          focus:ring-cyber-cyan
        `,
        ghost: `
          bg-transparent text-cyber-cyan
          hover:bg-cyber-cyan/10 focus:ring-cyber-cyan
        `,
        glass: `
          glass-card text-white
          hover:bg-white/10 focus:ring-cyber-cyan
        `,
        danger: `
          bg-gradient-to-r from-cyber-red to-cyber-red-dark
          text-white hover:from-cyber-red hover:to-cyber-red
          focus:ring-cyber-red
        `,
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
