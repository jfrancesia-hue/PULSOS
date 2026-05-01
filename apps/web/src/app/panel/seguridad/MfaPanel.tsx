'use client';

import { useState, useTransition } from 'react';
import { Button, Input, Badge } from '@pulso/ui';
import { ShieldCheck, ShieldOff, QrCode } from 'lucide-react';
import { mfaEnrollAction, mfaActivateAction, mfaDisableAction } from './actions';

interface EnrollData {
  secret: string;
  otpauthUrl: string;
}

export function MfaPanel({ mfaEnabled }: { mfaEnabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [enroll, setEnroll] = useState<EnrollData | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function startEnroll() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await mfaEnrollAction();
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      setEnroll(res.data);
    });
  }

  function activate() {
    setError(null);
    startTransition(async () => {
      const res = await mfaActivateAction(code);
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      setSuccess('MFA activado. La próxima vez que ingreses te vamos a pedir el código.');
      setEnroll(null);
      setCode('');
    });
  }

  function disable() {
    if (!confirm('¿Seguro? Vas a perder la protección extra de MFA.')) return;
    setError(null);
    startTransition(async () => {
      const res = await mfaDisableAction(code);
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      setSuccess('MFA desactivado.');
      setCode('');
    });
  }

  if (mfaEnabled && !enroll) {
    return (
      <div className="space-y-3">
        <div className="rounded-md border border-success/30 bg-success/5 p-3 text-xs text-success">
          <ShieldCheck size={14} className="inline" /> Tu cuenta está protegida con MFA.
        </div>
        <p className="text-xs text-pulso-niebla">Para desactivar, ingresá tu código actual:</p>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de 6 dígitos"
          inputMode="numeric"
          maxLength={6}
        />
        {error ? (
          <div className="rounded-md border border-danger/30 bg-danger/10 p-2 text-xs text-danger">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-md border border-success/30 bg-success/10 p-2 text-xs text-success">{success}</div>
        ) : null}
        <Button variant="danger" size="sm" onClick={disable} disabled={pending || code.length !== 6}>
          <ShieldOff size={12} />
          Desactivar MFA
        </Button>
      </div>
    );
  }

  if (enroll) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-pulso-blanco-calido">
          1. Escaneá este código con tu app de autenticación o ingresá el secret manualmente.
        </p>
        <div className="rounded-md border border-white/5 bg-pulso-blanco-calido p-4 text-center">
          <QRCode otpauthUrl={enroll.otpauthUrl} />
        </div>
        <div className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 font-mono text-2xs text-pulso-niebla">
          {enroll.secret}
        </div>
        <p className="text-sm text-pulso-blanco-calido">
          2. Ingresá el código de 6 dígitos que aparece en la app:
        </p>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          inputMode="numeric"
          maxLength={6}
        />
        {error ? (
          <div className="rounded-md border border-danger/30 bg-danger/10 p-2 text-xs text-danger">{error}</div>
        ) : null}
        <Button variant="primary" size="md" onClick={activate} disabled={pending || code.length !== 6}>
          <ShieldCheck size={14} />
          Activar MFA
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {success ? (
        <div className="rounded-md border border-success/30 bg-success/10 p-2 text-xs text-success">{success}</div>
      ) : null}
      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-2 text-xs text-danger">{error}</div>
      ) : null}
      <Button variant="primary" size="md" onClick={startEnroll} disabled={pending}>
        <QrCode size={14} />
        Activar MFA
      </Button>
    </div>
  );
}

function QRCode({ otpauthUrl }: { otpauthUrl: string }) {
  // Generamos un QR vía servicio público de QR (qr-server.com no requiere key).
  // En producción, usar librería local para no depender de tercero.
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpauthUrl)}`;
  return (
    <img
      src={url}
      alt="Código QR para configurar MFA"
      className="mx-auto h-44 w-44"
      width={180}
      height={180}
    />
  );
}
