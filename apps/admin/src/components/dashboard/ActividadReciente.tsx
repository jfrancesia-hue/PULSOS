import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { ShieldCheck, Sparkles, FileText, QrCode, UserPlus } from 'lucide-react';

const ACTIVIDAD = [
  {
    icon: QrCode,
    accent: 'cobre',
    titulo: 'Acceso QR de emergencia',
    descripcion: 'Hospital Italiano · Buenos Aires',
    paciente: 'Ana M. Martini',
    cuando: 'hace 4 minutos',
    badge: { label: 'Emergencia', variant: 'cobre' as const },
  },
  {
    icon: Sparkles,
    accent: 'turquesa',
    titulo: 'Conversación con Mica',
    descripcion: 'Triage: CONSULTA_NO_URGENTE',
    paciente: 'Pablo Díaz',
    cuando: 'hace 12 minutos',
    badge: { label: 'IA', variant: 'turquesa' as const },
  },
  {
    icon: FileText,
    accent: 'turquesa',
    titulo: 'Evolución cargada',
    descripcion: 'Dr. González · Clínica Médica',
    paciente: 'Ana M. Martini',
    cuando: 'hace 48 minutos',
    badge: { label: 'Clínico', variant: 'info' as const },
  },
  {
    icon: ShieldCheck,
    accent: 'turquesa',
    titulo: 'Consentimiento otorgado',
    descripcion: 'Scope: PERFIL_COMPLETO · 90 días',
    paciente: 'Sofía López',
    cuando: 'hace 1 hora',
    badge: { label: 'Consent', variant: 'success' as const },
  },
  {
    icon: UserPlus,
    accent: 'turquesa',
    titulo: 'Profesional verificado',
    descripcion: 'M.N. 234567 · Pediatría',
    paciente: 'Dra. L. Fernández',
    cuando: 'hace 2 horas',
    badge: { label: 'Onboarding', variant: 'neutral' as const },
  },
];

export function ActividadReciente() {
  return (
    <Card variant="default" className="h-full">
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
        <CardDescription>Últimos eventos relevantes en la plataforma</CardDescription>
      </CardHeader>
      <ul className="space-y-3">
        {ACTIVIDAD.map((a, i) => {
          const Icon = a.icon;
          const isCobre = a.accent === 'cobre';
          return (
            <li
              key={i}
              className="flex items-start gap-3 rounded-md border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-pulso-turquesa/20"
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
                  isCobre ? 'bg-pulso-cobre/15 text-pulso-cobre' : 'bg-pulso-turquesa/15 text-pulso-turquesa'
                }`}
              >
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-medium text-pulso-blanco-calido">
                    {a.titulo}
                  </div>
                  <Badge variant={a.badge.variant}>{a.badge.label}</Badge>
                </div>
                <div className="mt-0.5 truncate text-xs text-pulso-niebla">{a.descripcion}</div>
                <div className="mt-1 flex items-center gap-2 text-2xs text-pulso-niebla">
                  <span>{a.paciente}</span>
                  <span>·</span>
                  <span>{a.cuando}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
