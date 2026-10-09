import { RiCloseLine } from '@remixicon/react';
import { useState, type JSX } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomTabs } from '@/components/AppShell/BottomTabs';
import { Brand } from '@/components/AppShell/Brand';
import { SidebarNav } from '@/components/AppShell/SidebarNav';
import { Topbar } from '@/components/AppShell/Topbar';
import { Drawer } from '@/components/ui/Drawer';

const DRAWER_STYLES = {
  header: {
    background: 'var(--nav-bg)',
    borderBottom: '1px solid var(--nav-border)',
  },
  body: { background: 'var(--nav-bg)', padding: 12 },
} as const;

/**
 * Responsive frame around every page: icon rail at L, full sidebar at XL, a menu drawer at S and MD
 * and a bottom tab bar at XS.
 */
export function AppShell(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-[72px] flex-col gap-6 bg-nav px-3 py-4 lg:flex xl:w-60">
        <Brand
          className="px-1 text-nav-fg-active"
          nameClassName="hidden xl:inline"
        />
        <SidebarNav labels="wide" />
      </aside>

      <div className="lg:ps-[72px] xl:ps-60">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="px-4 pb-24 pt-6 sm:px-6 sm:pb-10 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomTabs onOpenMenu={() => setMenuOpen(true)} />

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="left"
        size={280}
        title={<Brand className="text-nav-fg-active" />}
        closeIcon={<RiCloseLine className="size-5 text-nav-fg" />}
        styles={DRAWER_STYLES}
      >
        <SidebarNav labels="always" onNavigate={() => setMenuOpen(false)} />
      </Drawer>
    </div>
  );
}
