import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-xs px-2.5 py-1 text-xs font-medium tracking-wide whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-white/5 text-pulso-niebla border border-white/10',
        turquesa: 'bg-pulso-turquesa/10 text-pulso-turquesa border border-pulso-turquesa/30',
        cobre: 'bg-pulso-cobre/10 text-pulso-cobre border border-pulso-cobre/30',
        success: 'bg-success/10 text-success border border-success/30',
        warning: 'bg-warning/10 text-warning border border-warning/30',
        danger: 'bg-danger/10 text-danger border border-danger/30',
        info: 'bg-info/10 text-info border border-info/30',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';
