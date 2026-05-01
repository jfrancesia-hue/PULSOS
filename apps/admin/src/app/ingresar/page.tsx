import Link from 'next/link';
import { Logo } from '@pulso/ui';
import { ShieldCheck } from 'lucide-react';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Ingresar · Pulso Admin' };

export default function AdminLogin() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-pulso-gradient" />
        <div className="pulso-topo absolute inset-0 opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo variant="full" size="lg" className="text-pulso-blanco-calido" />
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-pulso-turquesa/30 bg-pulso-turquesa/10 px-3 py-1 text-xs font-semibold text-pulso-turquesa">
              <ShieldCheck size={12} />
              Acceso restringido
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">
              Panel administrativo institucional
            </h1>
            <p className="mt-4 max-w-sm text-pulso-niebla">
              MFA obligatorio para roles ADMIN y SUPERADMIN. Cada acción queda en el log de
              auditoría.
            </p>
          </div>
          <div className="text-xs text-pulso-niebla">© {new Date().getFullYear()} Nativos Consultora Digital</div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden">
            <Logo variant="full" size="md" className="mb-12 text-pulso-blanco-calido" />
          </Link>
          <h2 className="font-display text-3xl font-bold tracking-tight">Pulso Admin</h2>
          <p className="mt-2 text-sm text-pulso-niebla">
            Solo personal autorizado de Nativos e instituciones aliadas.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <div className="mt-8 rounded-md border border-white/5 bg-white/[0.02] p-4 text-xs text-pulso-niebla">
            <div className="font-semibold text-pulso-blanco-calido">Cuenta SUPERADMIN demo</div>
            <div className="mt-1 font-mono">admin@pulso.demo</div>
            <div className="mt-1">Contraseña: <span className="font-mono">Pulso2026!</span></div>
            <div className="mt-2 text-2xs">
              Nota: el seed crea el usuario con MFA habilitado pero sin secret real. En producción
              se forzará TOTP en el login.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
