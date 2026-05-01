import Link from 'next/link';
import { Logo, Button } from '@pulso/ui';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo variant="full" size="lg" className="mb-12 text-pulso-blanco-calido" />
      <h1 className="font-display text-3xl font-bold">QR no encontrado o expirado</h1>
      <p className="mt-4 max-w-md text-pulso-niebla">
        Este código de emergencia no es válido. Puede haber sido revocado por el ciudadano o haber
        expirado por TTL.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="outline">Volver al inicio</Button>
      </Link>
    </main>
  );
}
