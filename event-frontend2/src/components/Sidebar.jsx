import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Calendar, Bookmark, BarChart, Settings, LogOut, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clubs', href: '/clubs', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Bookings', href: '/bookings', icon: Bookmark },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.email === 'saurabhhembade9518@gmail.com';

  const closeMobileMenu = () => {
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#030712] border-r border-white-[0.03] custom-scrollbar">
      <div className="p-8 flex items-center justify-between">
        <Link to="/dashboard" onClick={closeMobileMenu} className="inline-block cursor-pointer">
          <h1 className="text-3xl font-extrabold gradient-text tracking-tighter hover:opacity-90 transition-opacity">Eventopia</h1>
        </Link>
        {mobileMenuOpen && (
          <button
            onClick={closeMobileMenu}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg bg-white/5"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const needsAdmin = item.name === 'Analytics' && !isAdmin;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeMobileMenu}
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

      <div className="p-4 border-t border-white/5 mt-auto">
        <button
          onClick={() => {
            closeMobileMenu();
            logout();
          }}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen sticky top-0 custom-scrollbar z-50">
        {navContent}
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 md:hidden shadow-2xl"
            >
              {navContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
