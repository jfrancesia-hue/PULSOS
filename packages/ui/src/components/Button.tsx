import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-md transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-pulso-turquesa text-pulso-azul-medianoche hover:bg-pulso-turquesa-glow shadow-pulso-md hover:shadow-glow-turquesa',
        secondary:
          'bg-pulso-azul-noche text-pulso-blanco-calido border border-pulso-turquesa/30 hover:border-pulso-turquesa hover:bg-pulso-azul-noche/80',
        outline:
          'border border-pulso-blanco-calido/20 text-pulso-blanco-calido hover:border-pulso-turquesa hover:text-pulso-turquesa bg-transparent',
        ghost: 'text-pulso-blanco-calido hover:bg-pulso-azul-noche/60',
        danger: 'bg-danger text-white hover:bg-danger/90 shadow-pulso-md',
        cobre:
          'bg-pulso-cobre text-pulso-azul-medianoche hover:bg-pulso-cobre-deep hover:text-pulso-blanco-calido shadow-pulso-md',
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
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
