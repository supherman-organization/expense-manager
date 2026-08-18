import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../utils/labels';
import { BRAND_NAME } from '../utils/branding';
import type { UserRole } from '../types';
import { 
  Receipt, PlusCircle, ClipboardList, User, UserPlus, LogOut, Menu, X, type LucideIcon,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Mes notes de frais', icon: Receipt, end: true },
  { to: '/nouvelle-note', label: 'Nouvelle note', icon: PlusCircle },
  {
    to: '/toutes-les-notes',
    label: 'Toutes les notes',
    icon: ClipboardList,
    roles: ['manager', 'accounting'],
  },
  { to: '/profil', label: 'Mon profil', icon: User },
  { to: '/comptes', label: 'Créer un compte', icon: UserPlus, roles: ['manager'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  useEffect(() => {
    if (!drawerOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [drawerOpen]);

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function handleLogout() {
    logout();
    navigate('/connexion', { replace: true });
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="min-h-screen">
      {/* Barre supérieure mobile : déclencheur du menu */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Ouvrir le menu"
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-7 w-7 rounded-md" />
          <span className="font-display text-base font-bold text-primary">{BRAND_NAME}</span>
        </div>
      </header>

      {/* Fond semi-transparent derrière le drawer (mobile uniquement) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Sidebar : fixe sur desktop, drawer coulissant sur mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-primary px-4 py-6 transition-transform duration-200 md:translate-x-0 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* En-tête marque + bouton fermer  */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-14 w-14 rounded-xl" />
            <p className="font-display text-xl font-extrabold leading-tight text-white">
              {BRAND_NAME}
            </p>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Fermer le menu"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeDrawer}
                className={linkClass}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-secondary' : ''} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Identité + déconnexion */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="mb-3 px-2">
            <p className="truncate text-sm font-medium text-white">{user?.email}</p>
            <p className="text-xs text-slate-400">{user ? ROLE_LABELS[user.role] : ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}