import Link from 'next/link';
import { Logo } from '@pulso/ui';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  QrCode,
  Sparkles,
  ShieldCheck,
  FileText,
  Settings,
  Activity,
  Network,
} from 'lucide-react';

const NAV = [
  { href: '/', label: 'Resumen', icon: LayoutDashboard, active: true },
  { href: '/pacientes', label: 'Pacientes', icon: Users },
  { href: '/profesionales', label: 'Profesionales', icon: Stethoscope },
  { href: '/instituciones', label: 'Instituciones', icon: Building2 },
  { href: '/emergencia', label: 'Emergencia', icon: QrCode },
  { href: '/mica', label: 'Mica IA', icon: Sparkles },
  { href: '/auditoria', label: 'Auditoría', icon: ShieldCheck },
  { href: '/documentos', label: 'Documentos', icon: FileText },
  { href: '/connect', label: 'Connect', icon: Network },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
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
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? 'bg-pulso-turquesa/10 text-pulso-turquesa'
                  : 'text-pulso-niebla hover:bg-white/[0.03] hover:text-pulso-blanco-calido'
              }`}
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
            MS
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">Min. Salud</div>
            <div className="truncate text-xs text-pulso-niebla">superadmin@pulso.gob.ar</div>
          </div>
          <Activity size={14} className="text-success" />
        </div>
      </div>
    </aside>
  );
}
