'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@pulso/ui';
import { ShieldCheck } from 'lucide-react';
import { resetAction } from './actions';

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    const newPassword = String(formData.get('newPassword') ?? '');
    const confirm = String(formData.get('confirm') ?? '');
    if (newPassword !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    startTransition(async () => {
      const res = await resetAction(token, newPassword);
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      setDone(true);
      setTimeout(() => router.push('/ingresar'), 2000);
    });
  }

  if (done) {
    return (
      <div className="rounded-md border border-success/30 bg-success/10 p-4 text-sm text-success">
        Contraseña actualizada. Te llevamos al login…
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Nueva contraseña</span>
        <Input type="password" name="newPassword" required minLength={12} autoComplete="new-password" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Confirmar contraseña</span>
        <Input type="password" name="confirm" required minLength={12} autoComplete="new-password" />
      </label>
      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        <ShieldCheck size={16} />
        {pending ? 'Guardando…' : 'Cambiar contraseña'}
      </Button>
    </form>
  );
}
