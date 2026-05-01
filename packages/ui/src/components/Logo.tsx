import * as React from 'react';
import { cn } from '../utils/cn';

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP: Record<NonNullable<LogoProps['size']>, { full: string; mark: string }> = {
  sm: { full: 'h-6', mark: 'h-5 w-5' },
  md: { full: 'h-8', mark: 'h-7 w-7' },
  lg: { full: 'h-12', mark: 'h-10 w-10' },
};

export function Logo({ variant = 'full', size = 'md', className, ...props }: LogoProps) {
  const sizes = SIZE_MAP[size];

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizes.mark, className)}
        aria-label="Pulso"
        {...props}
      >
        <path
          d="M3 16 L9 16 L11 10 L14 22 L17 13 L20 18 L23 16 L29 16"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 132 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes.full, className)}
      aria-label="Pulso · Plataforma de salud digital argentina"
      {...props}
    >
      <path
        d="M3 16 L8 16 L10 10 L13 22 L16 12 L19 19 L22 16 L28 16"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-pulso-turquesa"
      />
      <text
        x="38"
        y="22"
        fontFamily="Manrope, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="0.04em"
        fill="currentColor"
      >
        PULSO
      </text>
    </svg>
  );
}
