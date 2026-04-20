import { type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
   { label: 'Accueil', path: '/landing' },
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Clients', path: '/clients' },
  { label: 'Factures', path: '/invoices' },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-950">
      <header className="sticky top-0 z-30 mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12 md:py-8 bg-white/80 border-b border-emerald-200 shadow-sm backdrop-blur-xl">
        
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Facturly" className="h-20 w-auto" />
        </div>

        
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-400/20'
                    : 'text-slate-700 hover:text-emerald-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

      
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-sm text-slate-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-500"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        {children}
      </main>
    </div>
  );
}