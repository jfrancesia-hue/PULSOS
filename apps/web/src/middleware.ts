import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/panel', '/portal-profesional/dashboard', '/portal-profesional/buscar', '/portal-profesional/paciente', '/portal-profesional/auditoria'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoute = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!protectedRoute) return NextResponse.next();

  const access = req.cookies.get('pulso_access')?.value;
  if (!access) {
    const loginUrl = pathname.startsWith('/portal-profesional')
      ? '/portal-profesional/ingresar'
      : '/ingresar';
    const url = req.nextUrl.clone();
    url.pathname = loginUrl;
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*', '/portal-profesional/:path*'],
};
