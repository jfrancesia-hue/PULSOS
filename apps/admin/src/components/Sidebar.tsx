import Link from 'next/link';
import { Logo } from '@pulso/ui';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  QrCode,
  ShieldCheck,
  Network,
  LogOut,
} from 'lucide-react';
import { logoutAction } from '../app/(panel)/actions';

const NAV = [
  { href: '/', label: 'Resumen', icon: LayoutDashboard },
  { href: '/usuarios', label: 'Usuarios', icon: Users },
  { href: '/profesionales', label: 'Profesionales', icon: Stethoscope },
  { href: '/instituciones', label: 'Instituciones', icon: Building2 },
  { href: '/accesos-emergencia', label: 'Accesos QR', icon: QrCode },
  { href: '/auditoria', label: 'Auditoría', icon: ShieldCheck },
  { href: '/connect', label: 'Connect', icon: Network },
];

export function Sidebar({ email }: { email?: string }) {
  const initials = (email ?? 'AD').slice(0, 2).toUpperCase();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-white/5 bg-pulso-azul-medianoche/95 backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-white/5 px-6 py-6">
        <Logo variant="full" size="md" className="text-pulso-blanco-calido" />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6">
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
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 rounded-md bg-white/[0.02] px-3 py-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pulso-cobre/20 text-xs font-semibold text-pulso-cobre">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">Pulso Admin</div>
            <div className="truncate text-xs text-pulso-niebla">{email ?? '—'}</div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Cerrar sesión"
              className="rounded-md p-1.5 text-pulso-niebla hover:bg-white/[0.05] hover:text-danger"
            >
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
