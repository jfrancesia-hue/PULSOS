import Link from 'next/link';
import { Logo } from '@pulso/ui';
import { ForgotForm } from './ForgotForm';

export const metadata = { title: 'Recuperar contraseña · Pulso' };

export default function ForgotPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href="/" className="mb-12">
        <Logo variant="full" size="lg" className="text-pulso-blanco-calido" />
      </Link>
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold tracking-tight">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-pulso-niebla">
          Ingresá tu email y te mandamos un enlace para resetear tu contraseña. El enlace expira
          en 1 hora.
        </p>
        <div className="mt-8">
          <ForgotForm />
        </div>
        <p className="mt-6 text-center text-xs text-pulso-niebla">
          <Link href="/ingresar" className="text-pulso-turquesa hover:underline">
            Volver a ingresar
          </Link>
        </p>
      </div>
    </main>
  );
}
