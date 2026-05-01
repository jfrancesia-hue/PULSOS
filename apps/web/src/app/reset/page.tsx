import Link from 'next/link';
import { Logo } from '@pulso/ui';
import { ResetForm } from './ResetForm';

export const metadata = { title: 'Resetear contraseña · Pulso' };

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href="/" className="mb-12">
        <Logo variant="full" size="lg" className="text-pulso-blanco-calido" />
      </Link>
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold tracking-tight">Nueva contraseña</h1>
        <p className="mt-2 text-sm text-pulso-niebla">
          Elegí una contraseña nueva (mínimo 12 caracteres, con mayúsculas, minúsculas y dígitos).
        </p>
        {token ? (
          <div className="mt-8">
            <ResetForm token={token} />
          </div>
        ) : (
          <div className="mt-8 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            Falta el token. Pediste un nuevo enlace en /recuperar-contrasena.
          </div>
        )}
      </div>
    </main>
  );
}
