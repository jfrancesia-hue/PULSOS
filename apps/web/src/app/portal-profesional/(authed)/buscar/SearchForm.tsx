'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, Button, Input, Badge } from '@pulso/ui';
import { Search, AlertTriangle, ShieldCheck } from 'lucide-react';
import { searchAction, requestConsentAction, type SearchHit } from './actions';

export function SearchForm() {
  const [dni, setDni] = useState('');
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SearchHit | null>(null);
  const [error, setError] = useState<string | null>(null);

  function search(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setError(null);
    startTransition(async () => {
      const res = await searchAction(dni.trim());
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      setResult(res.data);
    });
  }

  function requestConsent() {
    if (!result?.ciudadano?.dni) return;
    startTransition(async () => {
      const res = await requestConsentAction({
        dni: result.ciudadano!.dni!,
        scopes: ['PERFIL_COMPLETO', 'TIMELINE_CLINICO', 'CARGA_EVOLUCION'],
        motivo: 'Solicitud de acceso por consulta clínica.',
      });
      if (res.ok) {
        // Re-search para que aparezca con consent ya vigente.
        const re = await searchAction(dni.trim());
        if (re.ok) setResult(re.data);
      } else {
        setError(res.error.message);
      }
    });
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Búsqueda por DNI</CardTitle>
        <CardDescription>Sin puntos ni guiones. Ej: 32145678</CardDescription>
      </CardHeader>

      <form onSubmit={search} className="flex gap-3">
        <Input
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="DNI del paciente"
          inputMode="numeric"
          required
          minLength={7}
          maxLength={9}
          className="flex-1"
        />
        <Button type="submit" variant="primary" size="md" disabled={pending}>
          <Search size={14} />
          {pending ? 'Buscando…' : 'Buscar'}
        </Button>
      </form>

      {error ? (
        <div className="mt-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6">
          {!result.found ? (
            <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-sm text-pulso-niebla">
              No hay paciente con ese DNI en Pulso.
            </div>
          ) : result.consent_required ? (
            <ConsentRequiredCard hit={result} onRequest={requestConsent} pending={pending} />
          ) : (
            <FullProfile hit={result} />
          )}
        </div>
      ) : null}
    </Card>
  );
}

function ConsentRequiredCard({
  hit,
  onRequest,
  pending,
}: {
  hit: SearchHit;
  onRequest: () => void;
  pending: boolean;
}) {
  return (
    <div className="rounded-md border border-pulso-cobre/30 bg-pulso-cobre/5 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-1 text-pulso-cobre" />
        <div className="flex-1">
          <div className="font-display text-lg font-semibold">Consentimiento requerido</div>
          <p className="mt-1 text-sm text-pulso-niebla">
            Encontramos al paciente <span className="font-medium text-pulso-blanco-calido">
              {hit.ciudadano?.nombre} {hit.ciudadano?.inicial}.
            </span>{' '}
            No tenés consentimiento vigente para ver su perfil clínico.
          </p>
          <div className="mt-4">
            <Button onClick={onRequest} disabled={pending} variant="cobre" size="md">
              <ShieldCheck size={14} />
              {pending ? 'Solicitando…' : 'Solicitar consentimiento'}
            </Button>
          </div>
          <p className="mt-3 text-xs text-pulso-niebla">
            <strong>Modo demo:</strong> el consent se otorga automáticamente por 7 días para que
            puedas probar el flujo. En producción el ciudadano recibe push/email y debe aceptar.
          </p>
        </div>
      </div>
    </div>
  );
}

function FullProfile({ hit }: { hit: SearchHit }) {
  const c = hit.ciudadano!;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-2xl font-bold">
            {c.nombre} {c.apellido}
          </div>
          <div className="mt-1 text-xs text-pulso-niebla">
            DNI {c.dni} ·{' '}
            {c.grupoSanguineo
              ?.replace('_POSITIVO', '+')
              .replace('_NEGATIVO', '-')
              .replace('DESCONOCIDO', '?')}
          </div>
        </div>
        <Badge variant="success">
          <ShieldCheck size={12} />
          Consent vigente
        </Badge>
      </div>

      {c.alergias && c.alergias.length > 0 ? (
        <Section title="Alergias" accent="cobre">
          {c.alergias.map((a, i) => (
            <li key={i}>
              <strong>{a.sustancia}</strong>
              <span className="text-pulso-niebla"> · {a.severidad.toLowerCase()}</span>
            </li>
          ))}
        </Section>
      ) : null}

      {c.condicionesCriticas && c.condicionesCriticas.length > 0 ? (
        <Section title="Condiciones críticas" accent="turquesa">
          {c.condicionesCriticas.map((cc, i) => (
            <li key={i}>{cc.nombre}</li>
          ))}
        </Section>
      ) : null}

      {c.medicacionHabitual && c.medicacionHabitual.length > 0 ? (
        <Section title="Medicación habitual" accent="turquesa">
          {c.medicacionHabitual.map((m, i) => (
            <li key={i}>{m.nombre}</li>
          ))}
        </Section>
      ) : null}

      <Link href={`/portal-profesional/paciente/${c.id}`}>
        <Button variant="primary" size="md" className="w-full">
          Ver perfil completo y timeline
        </Button>
      </Link>
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: 'turquesa' | 'cobre';
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-4">
      <div
        className={`text-xs font-semibold uppercase tracking-wider ${
          accent === 'cobre' ? 'text-pulso-cobre' : 'text-pulso-turquesa'
        }`}
      >
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-sm text-pulso-blanco-calido">{children}</ul>
    </div>
  );
}
