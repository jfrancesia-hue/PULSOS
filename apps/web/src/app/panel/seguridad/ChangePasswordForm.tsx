'use client';

import { useState, useTransition } from 'react';
import { Button, Input } from '@pulso/ui';
import { Save } from 'lucide-react';
import { changePasswordAction } from './actions';

export function ChangePasswordForm() {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);
    const fd = new FormData(e.currentTarget);
    const current = String(fd.get('current') ?? '');
    const nueva = String(fd.get('nueva') ?? '');
    const confirm = String(fd.get('confirm') ?? '');
    if (nueva !== confirm) {
      setFeedback({ ok: false, msg: 'Las contraseñas no coinciden.' });
      return;
    }
    startTransition(async () => {
      const res = await changePasswordAction(current, nueva);
      if (!res.ok) {
        setFeedback({ ok: false, msg: res.error.message });
        return;
      }
      setFeedback({ ok: true, msg: 'Contraseña actualizada. Te vamos a desloguear de los otros dispositivos.' });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input name="current" type="password" placeholder="Contraseña actual" required autoComplete="current-password" />
      <Input name="nueva" type="password" placeholder="Nueva contraseña" required minLength={12} autoComplete="new-password" />
      <Input name="confirm" type="password" placeholder="Confirmar nueva" required minLength={12} autoComplete="new-password" />
      {feedback ? (
        <div
          className={`rounded-md border p-3 text-sm ${
            feedback.ok
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
        >
          {feedback.msg}
        </div>
      ) : null}
      <Button type="submit" variant="primary" size="md" disabled={pending}>
        <Save size={14} />
        {pending ? 'Guardando…' : 'Cambiar contraseña'}
      </Button>
    </form>
  );
}
