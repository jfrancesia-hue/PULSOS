import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Modulos } from '@/components/landing/Modulos';
import { ComoFunciona } from '@/components/landing/ComoFunciona';
import { Audiencias } from '@/components/landing/Audiencias';
import { QrSection } from '@/components/landing/QrSection';
import { MicaSection } from '@/components/landing/MicaSection';
import { Ecosistema } from '@/components/landing/Ecosistema';
import { CtaInstitucional } from '@/components/landing/CtaInstitucional';
import { Footer } from '@/components/landing/Footer';
import { FloatingCTA } from '@/components/landing/FloatingCTA';

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Modulos />
      <ComoFunciona />
      <Audiencias />
      <QrSection />
      <MicaSection />
      <Ecosistema />
      <CtaInstitucional />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
