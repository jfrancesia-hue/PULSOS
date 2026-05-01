'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  QrCode,
  ShieldCheck,
  Network,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  accent: 'turquesa' | 'cobre';
  badge?: string;
  sparkle?: boolean;
}

const NAV: NavItem[] = [
  { href: '/', label: 'Resumen', icon: LayoutDashboard, accent: 'turquesa' },
  { href: '/usuarios', label: 'Usuarios', icon: Users, accent: 'turquesa' },
  { href: '/profesionales', label: 'Profesionales', icon: Stethoscope, accent: 'cobre' },
  { href: '/instituciones', label: 'Instituciones', icon: Building2, accent: 'cobre' },
  { href: '/accesos-emergencia', label: 'Accesos QR', icon: QrCode, accent: 'cobre', badge: 'live', sparkle: true },
  { href: '/auditoria', label: 'Auditoría', icon: ShieldCheck, accent: 'turquesa' },
  { href: '/connect', label: 'Connect FHIR', icon: Network, accent: 'turquesa', sparkle: true },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-0.5 px-3 pb-4">
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        const isCobre = item.accent === 'cobre';
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200 ${
              isActive
                ? isCobre
                  ? 'bg-gradient-to-r from-pulso-cobre/25 via-pulso-cobre/10 to-transparent text-pulso-cobre shadow-[inset_0_0_0_1px_rgba(217,120,71,0.15)]'
                  : 'bg-gradient-to-r from-pulso-turquesa/25 via-pulso-turquesa/10 to-transparent text-pulso-turquesa shadow-[inset_0_0_0_1px_rgba(43,212,201,0.15)]'
                : 'text-pulso-niebla hover:bg-white/[0.03] hover:text-pulso-blanco-calido hover:translate-x-0.5'
            }`}
          >
            {/* Barra activa lateral con glow */}
            {isActive ? (
              <span
                className={`absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full ${
                  isCobre ? 'bg-pulso-cobre shadow-[0_0_10px_rgba(217,120,71,0.7)]' : 'bg-pulso-turquesa shadow-[0_0_10px_rgba(43,212,201,0.7)]'
                }`}
              />
            ) : null}

            {/* Icon con rotate + scale en hover */}
            <span className={`flex-shrink-0 ${item.sparkle ? 'sparkle' : ''} icon-spin-hover`}>
              <Icon size={16} strokeWidth={isActive ? 2 : 1.6} />
            </span>

            <span className="flex-1 font-medium">{item.label}</span>

            {item.badge === 'live' ? (
              <span className="flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-pulso-cobre" />
                Live
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
