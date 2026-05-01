import { Card, CardHeader, CardTitle, CardDescription } from '@pulso/ui';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';
import { ProfileForm } from './ProfileForm';

interface CitizenProfile {
  id: string;
  dni: string;
  cuil: string | null;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  provincia: string;
  localidad: string | null;
  telefono: string | null;
  grupoSanguineo: string;
  contactoEmergencia: { nombre: string; telefono: string; relacion: string } | null;
  cobertura: { tipo: string; obraSocial?: string; numeroAfiliado?: string; prepaga?: string } | null;
  alergias: Array<{ sustancia: string; severidad: string; notas?: string }>;
  medicacionHabitual: Array<{ nombre: string; presentacion?: string; posologia?: string; motivo?: string }>;
  condicionesCriticas: Array<{ codigo?: string; nombre: string; notas?: string }>;
}

export default async function PerfilPage() {
  await requireUser();
  const res = await apiFetchAuthed<CitizenProfile>('/pulso-id/me');
  const profile = res.ok ? res.data : null;

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Mi perfil
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Pulso ID</h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Estos son tus datos. Tu Pulso ID es la fuente de verdad sanitaria que viaja con vos a
          cualquier institución del país.
        </p>
      </header>

      {profile ? (
        <ProfileForm profile={profile} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tu Pulso ID está pendiente</CardTitle>
            <CardDescription>
              Para completar tu perfil ciudadano, contactá al equipo de Nativos en{' '}
              <a
                href="mailto:hola@nativos.consulting"
                className="text-pulso-turquesa hover:underline"
              >
                hola@nativos.consulting
              </a>
              . Codex agregará el flujo de creación on-boarding como parte de la P0.3.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
