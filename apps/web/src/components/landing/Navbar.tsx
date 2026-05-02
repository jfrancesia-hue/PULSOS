import Link from 'next/link';
import { Logo, Button } from '@pulso/ui';

const NAV_ITEMS = [
  { label: 'Plataforma', href: '#modulos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Para gobiernos', href: '#audiencias' },
  { label: 'Profesionales', href: '#audiencias' },
  { label: 'Mica IA', href: '#mica' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-pulso-azul-medianoche/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-pulso-blanco-calido">
          <Logo variant="full" size="md" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-pulso-niebla lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative transition-colors hover:text-pulso-turquesa after:absolute after:bottom-[-6px] after:left-0 after:h-px after:w-0 after:bg-pulso-turquesa after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/ingresar" className="hidden text-sm text-pulso-niebla transition-colors hover:text-pulso-turquesa lg:inline">
            Ingresar
          </Link>
          <Link href="/demo">
            <Button variant="cobre-pulse" size="sm">
              Solicitar demo
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
