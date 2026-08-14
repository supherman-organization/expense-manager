import {  useState } from 'react';
import { NavLink , Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface NavItem {
    to: string;
    label: string;
    end?: boolean;
    roles?: UserRole[];
}

// Libellés pour l'affichage .
const NAV_ITEMS: NavItem[] = [
    { to: '/', label: 'Mes notes de frais', end: true },
    { to: '/nouvelle-note', label: 'Nouvelle note' },
    {to: '/toutes-les-notes', label: 'Toutes les notes', roles: ['manager', 'accounting'] },
    {to: '/comptes', label: 'Créer un compte', roles: ['manager'] },
    {to: '/profil', label: 'Mon profil' },
];

const ROLE_LABELS: Record<UserRole, string> = {
    employee: 'Employé',
    manager: 'Manager',
    accounting: 'Comptabilité',
};

export default function Layout(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Calcul pendant le rendu : la liste visible se dérive du rôle, pas besoin
    // de state ni d'useEffect pour la « stocker ».
    const visibleItems = NAV_ITEMS.filter(
        (item) => !item.roles || (user && item.roles.includes(user.role)),
  );
    // Action utilisateur, gestionnaire d'événement.
    function handleLogout() {
        logout();
        navigate('/connexion', { replace: true });
  }
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `block rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'
    }`;

    return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-slate-800">Expense Manager</span>

          {/* Liens — visibles en ligne à partir de md */}
          <div className="hidden items-center gap-1 md:flex">
            {visibleItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Identité + déconnexion (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-slate-500">
              {user?.email} · {user ? ROLE_LABELS[user.role] : ''}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Déconnexion
            </button>
          </div>

          {/* Bouton hamburger (mobile uniquement) */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-xl leading-none text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Menu déroulant mobile */}
        {menuOpen && (
          <div className="border-t border-slate-200 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3">
              <p className="mb-2 text-sm text-slate-500">
                {user?.email} · {user ? ROLE_LABELS[user.role] : ''}
              </p>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      {/* La page active vient se loger ici */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );



}



