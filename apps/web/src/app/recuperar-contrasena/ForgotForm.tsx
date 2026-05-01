'use client';

import { useState, useTransition } from 'react';
import { Button, Input } from '@pulso/ui';
import { Mail } from 'lucide-react';
import { forgotAction } from './actions';

export function ForgotForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await forgotAction(formData);
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="rounded-md border border-success/30 bg-success/10 p-4 text-sm text-success">
        Si el email existe, te enviamos un enlace para resetear tu contraseña. Revisá tu casilla
        (incluyendo spam) en los próximos minutos.
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <Input type="email" name="email" required autoComplete="email" placeholder="vos@pulso.demo" />
      </label>
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        <Mail size={16} />
        {pending ? 'Enviando…' : 'Enviarme un enlace'}
      </Button>
    </form>
  );
}
