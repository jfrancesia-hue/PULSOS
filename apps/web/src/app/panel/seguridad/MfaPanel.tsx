'use client';

import { useState, useTransition, useEffect } from 'react';
import QRCodeLib from 'qrcode';
import { Button, Input } from '@pulso/ui';
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
        {error ? <Alert variant="error">{error}</Alert> : null}
        {success ? <Alert variant="success">{success}</Alert> : null}
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
          1. Escaneá este código con tu app de autenticación (Google Authenticator, Authy,
          1Password, Microsoft Authenticator).
        </p>
        <div className="rounded-md border border-white/5 bg-pulso-blanco-calido p-4">
          <LocalQr value={enroll.otpauthUrl} />
        </div>
        <details className="text-xs text-pulso-niebla">
          <summary className="cursor-pointer">¿Tu app no escanea? Ingresá el secret manual</summary>
          <div className="mt-2 break-all rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 font-mono text-2xs text-pulso-niebla">
            {enroll.secret}
          </div>
        </details>
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
        {error ? <Alert variant="error">{error}</Alert> : null}
        <Button variant="primary" size="md" onClick={activate} disabled={pending || code.length !== 6}>
          <ShieldCheck size={14} />
          Activar MFA
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {success ? <Alert variant="success">{success}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}
      <Button variant="primary" size="md" onClick={startEnroll} disabled={pending}>
        <QrCode size={14} />
        Activar MFA
      </Button>
    </div>
  );
}

function LocalQr({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    QRCodeLib.toDataURL(value, { width: 220, margin: 1, errorCorrectionLevel: 'M' })
      .then(setDataUrl)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No pudimos generar el QR'));
  }, [value]);

  if (error) {
    return <div className="text-center text-xs text-danger">{error}</div>;
  }
  if (!dataUrl) {
    return (
      <div className="mx-auto h-[220px] w-[220px] animate-pulse rounded-md bg-pulso-niebla/20" />
    );
  }
  return (
    <img
      src={dataUrl}
      alt="Código QR para configurar MFA"
      className="mx-auto h-[220px] w-[220px]"
      width={220}
      height={220}
    />
  );
}

function Alert({ variant, children }: { variant: 'success' | 'error'; children: React.ReactNode }) {
  return (
    <div
      className={
        variant === 'success'
          ? 'rounded-md border border-success/30 bg-success/10 p-2 text-xs text-success'
          : 'rounded-md border border-danger/30 bg-danger/10 p-2 text-xs text-danger'
      }
    >
      {children}
    </div>
  );
}
