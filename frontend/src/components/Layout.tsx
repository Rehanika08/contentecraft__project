import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LayoutDashboard, History, LogOut, User } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/history', icon: History, label: 'History' },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'rgb(10 12 20)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r shrink-0" style={{ background: 'rgb(14 16 30)', borderColor: 'rgb(30 41 59)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'rgb(30 41 59)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246))' }}>
            <Sparkles size={18} color="white" />
          </div>
          <span className="font-bold text-white text-lg">ContentCraft</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'linear-gradient(135deg, rgb(99 102 241 / 0.2), rgb(139 92 246 / 0.2))' : 'transparent',
                color: isActive ? 'rgb(165 180 252)' : 'rgb(100 116 139)',
                border: isActive ? '1px solid rgb(99 102 241 / 0.3)' : '1px solid transparent',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: 'rgb(30 41 59)' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2" style={{ background: 'rgb(22 27 45)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246))' }}>
              <User size={16} color="white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgb(100 116 139)' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{ color: 'rgb(100 116 139)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgb(239 68 68)'; e.currentTarget.style.background = 'rgb(239 68 68 / 0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgb(100 116 139)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
