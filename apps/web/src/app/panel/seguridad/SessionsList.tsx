import { Badge } from '@pulso/ui';
import { Monitor, Smartphone } from 'lucide-react';
import { apiFetchAuthed } from '@/lib/api';
import { RevokeSessionButton, RevokeAllButton } from './SessionsActions';

interface Session {
  id: string;
  ip: string | null;
  userAgent: string | null;
  label: string;
  createdAt: string;
  expiresAt: string;
}

export async function SessionsList() {
  const res = await apiFetchAuthed<Session[]>('/auth/sessions');
  const sessions = res.ok ? res.data : [];

  if (sessions.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-xs text-pulso-niebla">
        No hay sesiones activas registradas. Esto puede pasar si recién cambiaste tu contraseña.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {sessions.map((s) => {
          const isMobile = (s.userAgent ?? '').toLowerCase().match(/iphone|android|ipad/);
          const Icon = isMobile ? Smartphone : Monitor;
          return (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-md border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-pulso-turquesa/10 text-pulso-turquesa">
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-pulso-blanco-calido">{s.label}</span>
                  <Badge variant="success">Activa</Badge>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-2xs text-pulso-niebla">
                  {s.ip ? <span className="font-mono">{s.ip}</span> : null}
                  {s.ip ? <span>·</span> : null}
                  <span>Inició {new Date(s.createdAt).toLocaleString('es-AR')}</span>
                </div>
              </div>
              <RevokeSessionButton id={s.id} />
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end pt-2">
        <RevokeAllButton />
      </div>
    </div>
  );
}
