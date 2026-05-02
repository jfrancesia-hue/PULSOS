import type { Config } from 'tailwindcss';
import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { radii } from './tokens/spacing';
import { shadows } from './tokens/shadows';

export const pulsoPreset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pulso: {
          'azul-profundo': colors.brand.azulProfundo,
          'azul-noche': colors.brand.azulNoche,
          'azul-medianoche': colors.brand.azulMedianoche,
          turquesa: colors.brand.turquesa,
          'turquesa-glow': colors.brand.turquesaGlow,
          'turquesa-deep': colors.brand.turquesaDeep,
          cobre: colors.brand.cobre,
          'cobre-deep': colors.brand.cobreDeep,
          'blanco-calido': colors.brand.blancoCalido,
          niebla: colors.brand.niebla,
        },
        success: colors.state.success,
        warning: colors.state.warning,
        danger: colors.state.danger,
        info: colors.state.info,
        neutral: colors.neutral,
      },
      fontFamily: {
        display: typography.fontFamily.display.split(','),
        sans: typography.fontFamily.body.split(','),
        mono: typography.fontFamily.mono.split(','),
      },
      fontSize: typography.fontSize as unknown as Record<string, [string, { lineHeight: string }]>,
      borderRadius: radii,
      boxShadow: {
        'pulso-sm': shadows.sm,
        'pulso-md': shadows.md,
        'pulso-lg': shadows.lg,
        'pulso-xl': shadows.xl,
        'glow-turquesa': shadows.glowTurquesa,
        'glow-cobre': shadows.glowCobre,
      },
      backgroundImage: {
        'pulso-gradient':
          'radial-gradient(ellipse at top, rgba(43,212,201,0.15), transparent 70%), linear-gradient(to bottom, #0A1628 0%, #050B14 100%)',
        'pulso-mesh':
          'radial-gradient(at 0% 0%, rgba(43,212,201,0.18) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(217,120,71,0.10) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(43,212,201,0.08) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: shadows.glowTurquesa, opacity: '1' },
          '50%': { boxShadow: '0 0 48px rgba(43,212,201,0.45)', opacity: '0.92' },
        },
      },
    },
  },
};

export default pulsoPreset;
