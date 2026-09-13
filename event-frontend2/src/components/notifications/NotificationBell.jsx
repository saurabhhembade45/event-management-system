import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { getNotifications, markAsRead } from '../../api/notifications';
import NotificationDropdown from './NotificationDropdown';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const DEFAULT_NOTIFICATIONS = [
  {
    _id: 'notif-1',
    type: 'event',
    title: 'Upcoming Tech Hackathon 2026',
    message: 'Registration is now open for the annual CodeFest Hackathon! Huge prizes await.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
  },
  {
    _id: 'notif-2',
    type: 'booking',
    title: 'Booking Confirmed!',
    message: 'Your seat for "AI & Future Web Dev Workshop" has been successfully reserved.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: false,
  },
  {
    _id: 'notif-3',
    type: 'system',
    title: 'Welcome to Eventopia',
    message: 'Explore top campus events, join exciting clubs, and manage your bookings effortlessly.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
  {
    _id: 'notif-4',
    type: 'admin',
    title: 'New Club Announcement',
    message: 'Robotics Club has just published 2 new events for this weekend!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true,
  }
];

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.data && res.data.success && Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
        return;
      }
    } catch {
      // Backend route offline fallback
    }

    const localData = localStorage.getItem('eventopia_notifications');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
          setUnreadCount(parsed.filter(n => !n.isRead).length);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    setNotifications(DEFAULT_NOTIFICATIONS);
    setUnreadCount(DEFAULT_NOTIFICATIONS.filter(n => !n.isRead).length);
    localStorage.setItem('eventopia_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch {
      // Backend error fallback
    }
    setNotifications(prev => {
      const updated = prev.map(n => n._id === id ? { ...n, isRead: true } : n);
      localStorage.setItem('eventopia_notifications', JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.isRead).length);
      return updated;
    });
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAsRead(); 
    } catch {
      // Backend error fallback
    }
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('eventopia_notifications', JSON.stringify(updated));
      setUnreadCount(0);
      return updated;
    });
    toast.success("All caught up!");
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem('eventopia_notifications', JSON.stringify([]));
    toast.success("Notifications cleared");
  };

  return (
    <div className="relative z-50 flex items-center" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isOpen ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
        } hover:scale-105 group relative`}
        title="Notifications"
      >
        <Bell size={18} />
        
        {/* Unread Badge with Pulse Ring */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#030712]"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
