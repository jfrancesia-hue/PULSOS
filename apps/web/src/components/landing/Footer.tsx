import Link from 'next/link';
import { Logo } from '@pulso/ui';

const FOOTER_LINKS = [
  {
    titulo: 'Plataforma',
    items: [
      { label: 'Pulso ID', href: '#modulos' },
      { label: 'Pulso Emergency', href: '#modulos' },
      { label: 'Pulso Clinical', href: '#modulos' },
      { label: 'Pulso Mica', href: '#mica' },
      { label: 'Pulso Connect', href: '#modulos' },
    ],
  },
  {
    titulo: 'Audiencias',
    items: [
      { label: 'Ciudadanos', href: '#audiencias' },
      { label: 'Profesionales', href: '#audiencias' },
      { label: 'Instituciones', href: '#audiencias' },
      { label: 'Gobiernos', href: '#audiencias' },
    ],
  },
  {
    titulo: 'Empresa',
    items: [
      { label: 'Nativos Consultora', href: 'https://nativos.consulting' },
      { label: 'Contacto', href: 'mailto:hola@nativos.consulting' },
      { label: 'Demo institucional', href: '/demo' },
    ],
  },
  {
    titulo: 'Legal',
    items: [
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Términos', href: '/terminos' },
      { label: 'Ley 25.326', href: '/cumplimiento' },
      { label: 'Auditoría externa', href: '/auditoria' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-pulso-azul-medianoche">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div>
            <Logo variant="full" size="lg" className="text-pulso-blanco-calido" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-pulso-niebla">
              Plataforma de infraestructura sanitaria interoperable. Tu salud, conectada. Segura.
              Siempre.
            </p>
            <p className="mt-6 text-xs text-pulso-niebla">
              Por <span className="text-pulso-turquesa">Nativos Consultora Digital</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_LINKS.map((col) => (
              <div key={col.titulo}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-pulso-blanco-calido">
                  {col.titulo}
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-pulso-niebla transition-colors hover:text-pulso-turquesa"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-pulso-niebla sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Nativos Consultora Digital. Todos los derechos reservados.</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span>Sistema operativo · Argentina</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
