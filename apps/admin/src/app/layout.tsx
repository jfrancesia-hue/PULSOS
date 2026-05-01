import type { Metadata, Viewport } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Pulso Admin',
  description: 'Panel administrativo institucional de Pulso · Nativos Consultora Digital',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#050B14' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-pulso-azul-medianoche text-pulso-blanco-calido antialiased">
        {children}
      </body>
    </html>
  );
}
