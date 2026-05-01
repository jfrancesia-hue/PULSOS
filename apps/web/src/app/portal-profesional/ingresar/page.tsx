import Link from 'next/link';
import { Logo } from '@pulso/ui';
import { Stethoscope } from 'lucide-react';
import { LoginForm } from '../../ingresar/LoginForm';

export const metadata = { title: 'Portal profesional · Pulso' };

export default function IngresarPro() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-pulso-gradient" />
        <div className="pulso-topo absolute inset-0 opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/">
            <Logo variant="full" size="lg" className="text-pulso-blanco-calido" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-pulso-cobre/30 bg-pulso-cobre/10 px-3 py-1 text-xs font-semibold text-pulso-cobre">
              <Stethoscope size={12} />
              Portal Profesional
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight">
              Atendé,
              <br />
              no busques datos.
            </h1>
            <p className="mt-6 max-w-sm text-pulso-niebla">
              Acceso clínico controlado a perfiles autorizados. Búsqueda por DNI, timeline real,
              evolución cargada en segundos. Todo con consentimiento del paciente y registro de
              auditoría.
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
            Accedé con tus credenciales profesionales.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="mt-8 rounded-md border border-white/5 bg-white/[0.02] p-4 text-xs text-pulso-niebla">
            <div className="font-semibold text-pulso-blanco-calido">Cuentas profesionales demo</div>
            <ul className="mt-2 space-y-0.5 font-mono">
              <li>martin.gonzalez@pulso.demo · M.N. 123.456</li>
              <li>lucia.fernandez@pulso.demo · M.N. 234.567</li>
            </ul>
            <div className="mt-2">
              Contraseña: <span className="font-mono">Pulso2026!</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
