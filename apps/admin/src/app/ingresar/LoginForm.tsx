'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@pulso/ui';
import { LogIn } from 'lucide-react';
import { adminLoginAction } from './actions';

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await adminLoginAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push('/');
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <Input type="email" name="email" required autoComplete="email" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Contraseña</span>
        <Input type="password" name="password" required autoComplete="current-password" />
      </label>
      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        <LogIn size={16} />
        {pending ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  );
}
