'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@pulso/ui';
import { ArrowRight } from 'lucide-react';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <Link
        href="/registro"
        className={`group pointer-events-auto block ${visible ? '' : 'pointer-events-none'}`}
      >
        <Button
          variant="cobre-pulse"
          size="lg"
          className="h-14 px-7 text-base font-semibold shadow-glow-cobre"
        >
          Crear Pulso ID
          <ArrowRight size={18} className="icon-bounce-hover" />
        </Button>
      </Link>
    </div>
  );
}
