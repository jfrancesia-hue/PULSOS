import Link from 'next/link';
import { Logo } from '@pulso/ui';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Ingresar · Pulso' };

export default function IngresarPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-pulso-gradient" />
        <div className="pulso-topo absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/">
            <Logo variant="full" size="lg" className="text-pulso-blanco-calido" />
          </Link>
          <div>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight">
              Tu salud.
              <br />
              <span className="bg-gradient-to-r from-pulso-turquesa to-pulso-turquesa-glow bg-clip-text text-transparent">
                Conectada. Segura.
              </span>
            </h1>
            <p className="mt-6 max-w-sm text-pulso-niebla">
              Una plataforma de Nativos Consultora Digital para conectar personas, profesionales e
              instituciones del sistema de salud argentino.
            </p>
          </div>
          <div className="text-xs text-pulso-niebla">
            © {new Date().getFullYear()} Nativos Consultora Digital
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden">
            <Logo variant="full" size="md" className="mb-12 text-pulso-blanco-calido" />
          </Link>
          <h2 className="font-display text-3xl font-bold tracking-tight">Ingresar</h2>
          <p className="mt-2 text-sm text-pulso-niebla">
            Accedé a tu Pulso ID con tu email institucional o personal.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="mt-8 rounded-md border border-white/5 bg-white/[0.02] p-4 text-xs text-pulso-niebla">
            <div className="font-semibold text-pulso-blanco-calido">Cuentas demo</div>
            <ul className="mt-2 space-y-0.5 font-mono">
              <li>ana.martini@pulso.demo · CIUDADANO</li>
              <li>martin.gonzalez@pulso.demo · PROFESIONAL</li>
              <li>admin@pulso.demo · SUPERADMIN</li>
            </ul>
            <div className="mt-2">Contraseña común: <span className="font-mono">Pulso2026!</span></div>
          </div>

          <p className="mt-6 text-center text-xs text-pulso-niebla">
            ¿No tenés cuenta?{' '}
            <Link href="/registro" className="text-pulso-turquesa hover:underline">
              Crear Pulso ID
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
