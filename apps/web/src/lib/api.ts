import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const API = {
  base: BASE_URL,
  url: (path: string) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
};

export interface ApiOk<T> {
  ok: true;
  data: T;
}
export interface ApiErr {
  ok: false;
  error: { code: string; message: string };
}
export type ApiResult<T> = ApiOk<T> | ApiErr;

interface FetchOpts extends RequestInit {
  authToken?: string | null;
}

export async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<ApiResult<T>> {
  const { authToken, headers, ...rest } = opts;
  const finalHeaders = new Headers(headers);
  finalHeaders.set('Content-Type', 'application/json');
  if (authToken) finalHeaders.set('Authorization', `Bearer ${authToken}`);

  try {
    const res = await fetch(API.url(`/api${path}`), {
      ...rest,
      headers: finalHeaders,
      cache: 'no-store',
    });
    const text = await res.text();
    const body = text ? (JSON.parse(text) as unknown) : null;
    if (!res.ok) {
      const err = body as { error?: { code?: string; message?: string }; message?: string } | null;
      return {
        ok: false,
        error: {
          code: err?.error?.code ?? `HTTP_${res.status}`,
          message: err?.error?.message ?? err?.message ?? `Error ${res.status}`,
        },
      };
    }
    return { ok: true, data: body as T };
  } catch (e) {
    return {
      ok: false,
      error: {
        code: 'NETWORK',
        message: e instanceof Error ? e.message : 'Error de red',
      },
    };
  }
}

export async function apiFetchAuthed<T>(path: string, opts: FetchOpts = {}): Promise<ApiResult<T>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('pulso_access')?.value;
  if (!accessToken) {
    return { ok: false, error: { code: 'NO_SESSION', message: 'Iniciá sesión primero.' } };
  }
  return apiFetch<T>(path, { ...opts, authToken: accessToken });
}
