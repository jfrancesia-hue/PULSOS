'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@pulso/ui';
import { UserPlus } from 'lucide-react';
import { signupAction } from './actions';

const PROVINCIAS = [
  'CABA', 'BUENOS_AIRES', 'CATAMARCA', 'CHACO', 'CHUBUT', 'CORDOBA', 'CORRIENTES',
  'ENTRE_RIOS', 'FORMOSA', 'JUJUY', 'LA_PAMPA', 'LA_RIOJA', 'MENDOZA', 'MISIONES',
  'NEUQUEN', 'RIO_NEGRO', 'SALTA', 'SAN_JUAN', 'SAN_LUIS', 'SANTA_CRUZ', 'SANTA_FE',
  'SANTIAGO_DEL_ESTERO', 'TIERRA_DEL_FUEGO', 'TUCUMAN',
];

export function SignupForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signupAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push('/panel');
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre">
          <Input name="nombre" required minLength={1} maxLength={120} placeholder="Ana" />
        </Field>
        <Field label="Apellido">
          <Input name="apellido" required minLength={1} maxLength={120} placeholder="Martini" />
        </Field>
      </div>

      <Field label="DNI (sin puntos)">
        <Input name="dni" required pattern="\d{7,9}" inputMode="numeric" placeholder="32145678" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha de nacimiento">
          <Input name="fechaNacimiento" type="date" required />
        </Field>
        <Field label="Sexo biológico">
          <select
            name="sexoBiologico"
            required
            defaultValue=""
            className="h-11 w-full rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 text-sm text-pulso-blanco-calido focus:border-pulso-turquesa focus:outline-none"
          >
            <option value="" disabled>Seleccioná</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="INTERSEXUAL">Intersexual</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Provincia">
          <select
            name="provincia"
            required
            defaultValue=""
            className="h-11 w-full rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 text-sm text-pulso-blanco-calido focus:border-pulso-turquesa focus:outline-none"
          >
            <option value="" disabled>Seleccioná</option>
            {PROVINCIAS.map((p) => (
              <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </Field>
        <Field label="Localidad (opcional)">
          <Input name="localidad" maxLength={120} placeholder="Palermo" />
        </Field>
      </div>

      <Field label="Email">
        <Input name="email" type="email" required autoComplete="email" placeholder="vos@example.com" />
      </Field>

      <Field label="Contraseña (mín 12, mayúsc + minúsc + dígito)">
        <Input
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
        />
      </Field>

      <Field label="Teléfono (opcional)">
        <Input name="telefono" placeholder="+54 9 11 …" />
      </Field>

      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        <UserPlus size={16} />
        {pending ? 'Creando cuenta…' : 'Crear Pulso ID'}
      </Button>

      <p className="text-2xs text-pulso-niebla">
        Al crear tu cuenta, aceptás los{' '}
        <a href="/terminos" className="text-pulso-turquesa hover:underline">
          términos
        </a>{' '}
        y la{' '}
        <a href="/privacidad" className="text-pulso-turquesa hover:underline">
          política de privacidad
        </a>{' '}
        de Pulso.
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-pulso-niebla">
        {label}
      </span>
      {children}
    </label>
  );
}
