'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from '@pulso/ui';

const PATH_LABELS: Record<string, string> = {
  '/': 'Resumen',
  '/usuarios': 'Usuarios',
  '/profesionales': 'Profesionales',
  '/instituciones': 'Instituciones',
  '/accesos-emergencia': 'Accesos QR de emergencia',
  '/auditoria': 'Auditoría',
  '/connect': 'Connect FHIR R4',
};

export function Topbar() {
  const pathname = usePathname() ?? '/';
  const currentLabel = PATH_LABELS[pathname] ?? 'Pulso Admin';
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-pulso-azul-medianoche/80 px-8 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-pulso-niebla">
            <Sparkles size={12} className="text-pulso-turquesa" />
            Pulso
          </span>
          {!isHome ? (
            <>
              <ChevronRight size={12} className="text-pulso-niebla/50" />
              <span className="font-semibold text-pulso-blanco-calido">{currentLabel}</span>
            </>
          ) : (
            <>
              <ChevronRight size={12} className="text-pulso-niebla/50" />
              <span className="font-semibold text-pulso-cobre">Resumen institucional</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-md flex-1 lg:w-96">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pulso-niebla"
            />
            <input
              type="search"
              placeholder="Buscar paciente, profesional, institución…"
              className="h-10 w-full rounded-md border border-white/5 bg-pulso-azul-noche/40 pl-9 pr-16 text-sm text-pulso-blanco-calido placeholder:text-pulso-niebla/60 transition-colors focus:border-pulso-turquesa focus:outline-none"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-2xs text-pulso-niebla">
              ⌘K
            </kbd>
          </div>

          <Badge variant="success" className="hidden lg:inline-flex">
            <ShieldCheck size={12} />
            Hash chain íntegro
          </Badge>

          <button
            type="button"
            aria-label="Notificaciones"
            className="press group relative flex h-10 w-10 items-center justify-center rounded-md border border-white/5 text-pulso-niebla transition-all hover:border-pulso-cobre/40 hover:bg-pulso-cobre/10 hover:text-pulso-cobre hover:shadow-glow-cobre"
          >
            <Bell size={16} className="icon-wobble" />
            <span className="pulse-dot absolute right-2 top-2 h-2 w-2 rounded-full bg-pulso-cobre" />
          </button>
        </div>
      </div>
    </header>
  );
}
