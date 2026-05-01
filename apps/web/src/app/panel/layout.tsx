import Link from 'next/link';
import { Logo, Badge } from '@pulso/ui';
import {
  IdCard,
  QrCode,
  History,
  FileText,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Bell,
  Pill,
  AlarmClock,
  Lock,
} from 'lucide-react';
import { requireUser } from '@/lib/session';
import { logoutAction } from './actions';

const NAV = [
  { href: '/panel', label: 'Inicio', icon: LayoutDashboard },
  { href: '/panel/perfil', label: 'Mi perfil', icon: IdCard },
  { href: '/panel/qr', label: 'QR emergencia', icon: QrCode },
  { href: '/panel/recetas', label: 'Recetas', icon: Pill },
  { href: '/panel/recordatorios', label: 'Recordatorios', icon: AlarmClock },
  { href: '/panel/historial', label: 'Historial', icon: History },
  { href: '/panel/documentos', label: 'Documentos', icon: FileText },
  { href: '/panel/consentimientos', label: 'Consentimientos', icon: ShieldCheck },
  { href: '/panel/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/panel/mica', label: 'Mica', icon: Sparkles },
  { href: '/panel/seguridad', label: 'Seguridad', icon: Lock },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  const display = user.citizenProfile
    ? `${user.citizenProfile.nombre} ${user.citizenProfile.apellido}`
    : user.email;
  const initials = user.citizenProfile
    ? `${user.citizenProfile.nombre[0] ?? ''}${user.citizenProfile.apellido[0] ?? ''}`
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-pulso-azul-medianoche">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-pulso-azul-medianoche/95">
        <div className="border-b border-white/5 px-5 py-5">
          <Link href="/">
            <Logo variant="full" size="md" className="text-pulso-blanco-calido" />
          </Link>
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
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-pulso-turquesa/20 text-xs font-semibold text-pulso-turquesa">
              {initials.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{display}</div>
              <div className="truncate text-xs text-pulso-niebla">{user.role.toLowerCase()}</div>
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
          <div className="text-sm text-pulso-niebla">
            Sesión iniciada — los accesos a tus datos quedan registrados.
          </div>
          <Badge variant="success">Pulso activo</Badge>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
