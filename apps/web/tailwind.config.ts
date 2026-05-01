import type { Config } from 'tailwindcss';
import preset from '@pulso/ui/tailwind-preset';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [preset as Config],
  plugins: [],
};

export default config;
