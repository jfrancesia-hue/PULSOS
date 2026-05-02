import type { Metadata, Viewport } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { CursorOrb } from '@/components/premium/CursorOrb';
import { NavigationProgress } from '@/components/premium/NavigationProgress';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pulso · Plataforma de salud digital argentina',
  description:
    'Tu salud, conectada. Segura. Siempre. Identidad sanitaria, perfil clínico unificado, QR de emergencia y asistente IA — para ciudadanos, profesionales, instituciones, farmacias y gobiernos.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Pulso · Plataforma de salud digital argentina',
    description:
      'Una plataforma que conecta personas, profesionales e instituciones con datos sanitarios verificados y trazables.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Pulso',
  },
  twitter: { card: 'summary_large_image' },
  authors: [{ name: 'Nativos Consultora Digital', url: 'https://nativos.consulting' }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-pulso-azul-profundo text-pulso-blanco-calido antialiased">
        <NavigationProgress />
        <CursorOrb />
        {children}
      </body>
    </html>
  );
}
