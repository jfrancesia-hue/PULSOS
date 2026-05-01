import Link from 'next/link';
import { Logo, Button } from '@pulso/ui';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo variant="full" size="lg" className="mb-12 text-pulso-blanco-calido" />
      <div className="font-display text-7xl font-bold text-pulso-turquesa/40">404</div>
      <h1 className="mt-6 font-display text-3xl font-bold">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-pulso-niebla">
        Lo sentimos, la página que buscás no existe o fue movida.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </main>
  );
}
