export const colors = {
  brand: {
    azulProfundo: '#0A1628',
    azulNoche: '#0F1F3D',
    azulMedianoche: '#050B14',
    turquesa: '#2BD4C9',
    turquesaGlow: '#5EE7DE',
    turquesaDeep: '#14807A',
    cobre: '#D97847',
    cobreDeep: '#A85829',
    blancoCalido: '#F5F1EA',
    niebla: '#C7CDD9',
  },
  state: {
    success: '#2BD49A',
    warning: '#F5B647',
    danger: '#E55A4C',
    info: '#4FA3F0',
  },
  neutral: {
    50: '#F5F1EA',
    100: '#DDE2EB',
    200: '#BBC4D2',
    300: '#94A0B5',
    400: '#6B7A93',
    500: '#475873',
    600: '#2A3F5F',
    700: '#1A2D4F',
    800: '#0F1F3D',
    900: '#0A1628',
    950: '#050B14',
  },
} as const;

export type ColorToken = typeof colors;
