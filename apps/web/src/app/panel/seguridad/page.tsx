import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { KeyRound, Smartphone, Clock } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { ChangePasswordForm } from './ChangePasswordForm';
import { MfaPanel } from './MfaPanel';
import { SessionsList } from './SessionsList';

export default async function SeguridadPage() {
  const user = await requireUser();

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Mi cuenta
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Seguridad</h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Tu Pulso ID protege datos clínicos sensibles. Activá MFA para sumar una capa extra de
          seguridad en tu cuenta.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <KeyRound size={16} className="text-pulso-turquesa" />
                Contraseña
              </CardTitle>
              <Badge variant="success">Activa</Badge>
            </div>
            <CardDescription>
              Cambiá tu contraseña. Al guardarla se cierran todas tus sesiones activas.
            </CardDescription>
          </CardHeader>
          <ChangePasswordForm />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Smartphone size={16} className="text-pulso-turquesa" />
                Autenticación de dos factores (MFA)
              </CardTitle>
              <Badge variant={user.mfaEnabled ? 'success' : 'warning'}>
                {user.mfaEnabled ? 'Activada' : 'Inactiva'}
              </Badge>
            </div>
            <CardDescription>
              Configurá una app de autenticación (Google Authenticator, Authy, 1Password) para
              proteger tu cuenta con un código TOTP de 6 dígitos.
            </CardDescription>
          </CardHeader>
          <MfaPanel mfaEnabled={user.mfaEnabled} />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={16} className="text-pulso-turquesa" />
            Sesiones activas
          </CardTitle>
          <CardDescription>
            Dispositivos donde está abierta tu sesión. Cambiar tu contraseña cierra todas.
          </CardDescription>
        </CardHeader>
        <SessionsList />
      </Card>
    </div>
  );
}
