import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const useNavigateInstance = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    useNavigateInstance('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/chat', label: 'AI Chat' },
    { to: '/conversations', label: 'History' },
    { to: '/tickets', label: 'Tickets' },
  ];

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <nav className="bg-slate-800/95 border-b border-slate-700/60 sticky top-0 z-50 px-6 sm:px-12 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-12">
          <Link to={user ? '/dashboard' : '/login'} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              AI
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
              SupportAI
            </span>
          </Link>

          {user && !isAuthPage && (
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname.startsWith(link.to)
                        ? 'text-indigo-400 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-slate-200 hidden sm:inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700/80 hover:bg-slate-700 border border-slate-600/60 rounded-xl transition-all shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}