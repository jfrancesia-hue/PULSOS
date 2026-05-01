import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { KpiRow } from '@/components/dashboard/KpiRow';
import { MapaArgentina } from '@/components/dashboard/MapaArgentina';
import { ActividadReciente } from '@/components/dashboard/ActividadReciente';
import { ProfesionalesTabla } from '@/components/dashboard/ProfesionalesTabla';
import { TendenciasChart } from '@/components/dashboard/TendenciasChart';
import { DistribucionDonut } from '@/components/dashboard/DistribucionDonut';
import { DocumentosBar } from '@/components/dashboard/DocumentosBar';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-72 flex-1">
        <Topbar />
        <main className="p-8">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
              Buenos días, Ministerio de Salud
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
              Panel institucional Pulso
            </h1>
          </div>

          <KpiRow />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <MapaArgentina />
            <ActividadReciente />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <TendenciasChart />
            <DistribucionDonut />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ProfesionalesTabla />
            <DocumentosBar />
          </div>
        </main>
      </div>
    </div>
  );
}
