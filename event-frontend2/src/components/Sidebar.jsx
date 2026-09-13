import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Calendar, Bookmark, BarChart, Settings, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clubs', href: '/clubs', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Bookings', href: '/bookings', icon: Bookmark },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.email === 'saurabhhembade9518@gmail.com';

  return (
    <div className="hidden md:flex flex-col w-64 bg-[#030712] border-r border-white-[0.03] h-screen sticky top-0 custom-scrollbar z-50">
      <div className="p-8">
        <h1 className="text-3xl font-extrabold gradient-text tracking-tighter">Eventopia</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const needsAdmin = item.name === 'Analytics' && !isAdmin;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-white/10 text-white shadow-glow relative border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span className="font-medium">{item.name}</span>
              </div>
              
              {needsAdmin && (
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/10">
                  <Lock size={10} />
                  <span>Admin</span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
