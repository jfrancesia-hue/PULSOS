import Link from 'next/link';
import { Logo, Button } from '@pulso/ui';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export const metadata = { title: 'Verificar email · Pulso' };

interface SearchParams {
  token?: string;
}

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Layout>
        <Status icon="warning" titulo="Falta el token">
          El enlace que abriste no incluye el token de verificación. Volvé a abrir el email que te
          mandamos al registrarte.
        </Status>
      </Layout>
    );
  }

  const res = await apiFetch('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    return (
      <Layout>
        <Status icon="warning" titulo="No pudimos verificar tu email">
          {res.error.message}. Pedí un nuevo enlace desde tu panel o registrate de nuevo.
        </Status>
      </Layout>
    );
  }

  return (
    <Layout>
      <Status icon="success" titulo="Email verificado">
        Listo. Tu cuenta está activa. Ya podés ingresar a Pulso con tus credenciales.
      </Status>
      <Link href="/ingresar" className="mt-6 inline-block">
        <Button variant="primary">Ingresar</Button>
      </Link>
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo variant="full" size="lg" className="mb-12 text-pulso-blanco-calido" />
      {children}
    </main>
  );
}

function Status({
  icon,
  titulo,
  children,
}: {
  icon: 'success' | 'warning';
  titulo: string;
  children: React.ReactNode;
}) {
  const Icon = icon === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div className="mx-auto max-w-md">
      <Icon
        size={48}
        className={icon === 'success' ? 'mx-auto mb-6 text-success' : 'mx-auto mb-6 text-pulso-cobre'}
      />
      <h1 className="font-display text-3xl font-bold tracking-tight">{titulo}</h1>
      <p className="mt-4 text-pulso-niebla">{children}</p>
    </div>
  );
}
