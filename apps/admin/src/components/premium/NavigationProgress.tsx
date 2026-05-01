'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Barra de progreso superior que aparece al navegar entre páginas.
 * Estilo NProgress: pulse de gradient turquesa→cobre.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    setVisible(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setVisible(false), 300);
    }, 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`nav-progress ${loading ? 'loading' : ''}`}
      style={{
        opacity: loading ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    />
  );
}
