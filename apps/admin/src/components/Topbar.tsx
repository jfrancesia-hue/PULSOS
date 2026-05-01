import { Bell, Search, ShieldCheck } from 'lucide-react';
import { Badge } from '@pulso/ui';

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-pulso-azul-medianoche/80 px-8 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pulso-niebla"
          />
          <input
            type="search"
            placeholder="Buscar paciente, profesional, institución…"
            className="h-10 w-full rounded-md border border-white/5 bg-pulso-azul-noche/40 pl-9 pr-4 text-sm text-pulso-blanco-calido placeholder:text-pulso-niebla/60 focus:border-pulso-turquesa focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">
            <ShieldCheck size={12} />
            Hash chain íntegro
          </Badge>
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-md border border-white/5 text-pulso-niebla hover:border-pulso-turquesa/30 hover:text-pulso-blanco-calido"
          >
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-pulso-cobre" />
          </button>
        </div>
      </div>
    </header>
  );
}
