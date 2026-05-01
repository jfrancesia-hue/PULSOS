import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

export const buttonVariants = cva(
  'press ripple inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-md transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary:
          'bg-pulso-turquesa text-pulso-azul-medianoche hover:bg-pulso-turquesa-glow hover:shadow-glow-turquesa hover:-translate-y-0.5',
        secondary:
          'bg-pulso-azul-noche text-pulso-blanco-calido border border-pulso-turquesa/30 hover:border-pulso-turquesa hover:bg-pulso-azul-noche/80 hover:-translate-y-0.5',
        outline:
          'border border-pulso-blanco-calido/20 text-pulso-blanco-calido hover:border-pulso-turquesa hover:text-pulso-turquesa bg-transparent hover:-translate-y-0.5 hover:shadow-glow-turquesa',
        ghost:
          'text-pulso-blanco-calido hover:bg-pulso-azul-noche/60',
        danger:
          'bg-danger text-white hover:bg-danger/90 shadow-pulso-md hover:-translate-y-0.5 hover:shadow-pulso-lg',
        cobre:
          'bg-pulso-cobre text-pulso-azul-medianoche hover:bg-pulso-cobre-deep hover:text-pulso-blanco-calido hover:-translate-y-0.5 hover:shadow-glow-cobre',
        'cobre-pulse':
          'glow-pulse-cobre bg-pulso-cobre text-pulso-azul-medianoche hover:bg-pulso-cobre-deep hover:text-pulso-blanco-calido hover:-translate-y-0.5',
        'turquesa-pulse':
          'glow-pulse-turquesa bg-pulso-turquesa text-pulso-azul-medianoche hover:bg-pulso-turquesa-glow hover:-translate-y-0.5',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <svg
          className="h-3.5 w-3.5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path
            d="M12 2a10 10 0 0110 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
