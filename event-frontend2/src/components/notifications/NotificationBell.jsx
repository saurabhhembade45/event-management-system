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
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isRead: false,
  },
  {
    _id: 'notif-2',
    type: 'booking',
    title: 'Booking Confirmed!',
    message: 'Your seat for "AI & Future Web Dev Workshop" has been successfully reserved.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
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

  const handleToggleRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await markAsRead(id);
    } catch {
      // Ignore
    }
    setNotifications(prev => {
      const updated = prev.map(n => n._id === id ? { ...n, isRead: !n.isRead } : n);
      localStorage.setItem('eventopia_notifications', JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.isRead).length);
      return updated;
    });
  };

  const handleDeleteNotification = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev => {
      const updated = prev.filter(n => n._id !== id);
      localStorage.setItem('eventopia_notifications', JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.isRead).length);
      return updated;
    });
    toast.success("Notification removed");
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
    toast.success("All notifications marked as read!");
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
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isOpen 
            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.35)] scale-105' 
            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
        } transition-transform active:scale-95 group`}
        title="Notifications"
      >
        <Bell size={18} />
        
        {/* Unread Count Badge (Static / Silent) */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-[#030712] shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onToggleRead={handleToggleRead}
            onDeleteNotification={handleDeleteNotification}
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
