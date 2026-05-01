import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { requireAdmin } from '@/lib/session';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="flex min-h-screen">
      <Sidebar email={user.email} />
      <div className="ml-72 flex-1">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
