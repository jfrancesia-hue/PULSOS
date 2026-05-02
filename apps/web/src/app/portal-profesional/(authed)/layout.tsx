import Link from 'next/link';
import { Logo, Badge } from '@pulso/ui';
import { LayoutDashboard, Search, History, ShieldCheck, LogOut, Stethoscope } from 'lucide-react';
import { requireRole } from '@/lib/session';
import { logoutAction } from '@/app/panel/actions';

const NAV = [
  { href: '/portal-profesional/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal-profesional/buscar', label: 'Buscar paciente', icon: Search },
  { href: '/portal-profesional/auditoria', label: 'Mi auditoría', icon: History },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(['PROFESIONAL'], '/portal-profesional/ingresar');
  const display = user.professionalProfile
    ? `Dr/a. ${user.professionalProfile.nombre} ${user.professionalProfile.apellido}`
    : user.email;
  const matricula = user.professionalProfile?.matriculaNacional ?? '—';
  const initials = user.professionalProfile
    ? `${user.professionalProfile.nombre[0] ?? ''}${user.professionalProfile.apellido[0] ?? ''}`
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-pulso-azul-medianoche">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-pulso-azul-medianoche/95">
        <div className="border-b border-white/5 px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Logo variant="full" size="md" className="text-pulso-blanco-calido" />
          </Link>
          <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-pulso-cobre/30 bg-pulso-cobre/5 px-2 py-1 text-2xs font-semibold text-pulso-cobre">
            <Stethoscope size={10} />
            Portal profesional
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-pulso-niebla transition-colors hover:bg-white/[0.03] hover:text-pulso-blanco-calido"
              >
                <Icon size={16} strokeWidth={1.6} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 rounded-md bg-white/[0.02] px-3 py-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-pulso-cobre/20 text-xs font-semibold text-pulso-cobre">
              {initials.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{display}</div>
              <div className="truncate text-xs text-pulso-niebla">{matricula}</div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md p-1.5 text-pulso-niebla hover:bg-white/[0.05] hover:text-danger"
                aria-label="Cerrar sesión"
              >
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="ml-64 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-pulso-azul-medianoche/80 px-8 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm text-pulso-niebla">
            <ShieldCheck size={14} className="text-pulso-turquesa" />
            Cada acceso a un perfil clínico queda registrado.
          </div>
          <Badge variant="cobre">Profesional verificado</Badge>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
