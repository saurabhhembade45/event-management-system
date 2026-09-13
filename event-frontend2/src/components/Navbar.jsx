import { Search, Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NotificationBell from './notifications/NotificationBell';

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const displayName = user?.username?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="sticky top-4 z-40 px-3 sm:px-6 md:px-8 mb-6">
      <header className="h-16 bg-[#030712]/60 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 sm:px-6 flex items-center justify-between gap-3 shadow-glass">
        
        {/* Left: Mobile menu toggle + Eventopia logo/name for mobile/tab + Desktop welcome header */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white shrink-0"
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>

          {/* Eventopia Logo & Name - Mobile & Tab Only */}
          <Link to="/dashboard" className="flex items-center gap-2 md:hidden shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-premium flex items-center justify-center shadow-glow">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-lg font-extrabold gradient-text tracking-tighter">
              Eventopia
            </span>
          </Link>

          {/* Desktop Welcome Header */}
          <h2 className="hidden md:block text-sm sm:text-lg font-semibold text-white tracking-tight truncate">
            Welcome to Eventopia, <span className="text-transparent bg-clip-text bg-gradient-premium">{displayName}</span> 👋
          </h2>
        </div>

        {/* Right: Search, Notifications & Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-6 shrink-0">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search events..."
              className="w-44 md:w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:bg-white/10"
            />
          </div>

          <NotificationBell />

          <Link to="/profile">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-premium p-[2px] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-white">{avatarLetter}</span>
              </div>
            </div>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Navbar;