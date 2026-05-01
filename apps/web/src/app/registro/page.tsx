import Link from 'next/link';
import { Logo } from '@pulso/ui';
import { Heart } from 'lucide-react';
import { SignupForm } from './SignupForm';

export const metadata = { title: 'Crear Pulso ID' };

export default function RegistroPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-pulso-gradient" />
        <div className="pulso-topo absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/">
            <Logo variant="full" size="lg" className="text-pulso-blanco-calido" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-pulso-turquesa/30 bg-pulso-turquesa/10 px-3 py-1 text-xs font-semibold text-pulso-turquesa">
              <Heart size={12} />
              Tu identidad sanitaria
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight">
              Crear tu Pulso ID
              <br />
              <span className="bg-gradient-to-r from-pulso-turquesa to-pulso-turquesa-glow bg-clip-text text-transparent">
                lleva 3 minutos.
              </span>
            </h1>
            <p className="mt-6 max-w-sm text-pulso-niebla">
              Tu identidad sanitaria viaja con vos. Cuando cambies de obra social, ciudad o
              profesional, tus datos siguen siendo tuyos.
            </p>
          </div>
          <div className="text-xs text-pulso-niebla">
            © {new Date().getFullYear()} Nativos Consultora Digital
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden">
            <Logo variant="full" size="md" className="mb-12 text-pulso-blanco-calido" />
          </Link>
          <h2 className="font-display text-3xl font-bold tracking-tight">Crear cuenta</h2>
          <p className="mt-2 text-sm text-pulso-niebla">
            Vamos a crear tu Pulso ID con datos básicos. Después podés completar tu perfil clínico
            (alergias, medicación, condiciones) en tu panel.
          </p>

          <div className="mt-8">
            <SignupForm />
          </div>

          <p className="mt-6 text-center text-xs text-pulso-niebla">
            ¿Ya tenés cuenta?{' '}
            <Link href="/ingresar" className="text-pulso-turquesa hover:underline">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
