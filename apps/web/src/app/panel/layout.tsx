import Link from 'next/link';
import { Logo, Badge } from '@pulso/ui';
import { requireUser } from '@/lib/session';
import { PanelNav } from './PanelNav';
import { LogoutButton } from './LogoutButton';

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
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-pulso-azul-medianoche/95 backdrop-blur-xl">
        <div className="border-b border-white/5 px-5 py-5">
          <Link href="/" className="block">
            <Logo variant="full" size="md" className="text-pulso-blanco-calido" />
          </Link>
          <div className="mt-3 flex items-center gap-2 text-2xs uppercase tracking-[0.18em] text-pulso-niebla">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-pulso-turquesa" />
            <span>Panel ciudadano</span>
          </div>
        </div>

        <PanelNav />

        <div className="border-t border-white/5 p-3">
          <div className="group flex items-center gap-3 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2.5 transition-all hover:border-pulso-turquesa/30 hover:bg-white/[0.04]">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pulso-turquesa/30 to-pulso-cobre/20 text-xs font-semibold text-pulso-turquesa shadow-[inset_0_0_0_1px_rgba(43,212,201,0.25)]">
              {initials.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{display}</div>
              <div className="truncate text-xs text-pulso-niebla">{user.role.toLowerCase()}</div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="ml-64 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-pulso-azul-medianoche/80 px-8 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-sm text-pulso-niebla">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-pulso-turquesa" />
            Sesión iniciada — los accesos a tus datos quedan registrados.
          </div>
          <Badge variant="success">Pulso activo</Badge>
        </header>
        <main className="page-transition-in px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
