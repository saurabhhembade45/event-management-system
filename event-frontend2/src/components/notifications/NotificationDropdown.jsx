import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Calendar, BellRing, CheckCheck, X, Bell, Ticket, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClearAll,
  onClose 
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const getIcon = (type) => {
    switch (type) {
      case 'system':
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-sm">
            <Info size={18} />
          </div>
        );
      case 'event':
        return (
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
            <Calendar size={18} />
          </div>
        );
      case 'booking':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <Ticket size={18} />
          </div>
        );
      case 'admin':
      case 'broadcast':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <BellRing size={18} />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
            <Bell size={18} />
          </div>
        );
    }
  };

  const getTimeAgo = (dateVal) => {
    if (!dateVal) return 'Just now';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return 'Just now';
      return formatDistanceToNow(d, { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed sm:absolute top-20 sm:top-14 right-3 sm:right-0 left-3 sm:left-auto w-[calc(100vw-1.5rem)] sm:w-96 bg-[#030712]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden z-50 flex flex-col max-h-[85vh]"
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Bell size={16} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[360px] custom-scrollbar divide-y divide-white/5">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                if (!notification.isRead) onMarkAsRead(notification._id);
              }}
              className={`p-4 flex gap-3.5 transition-all cursor-pointer group ${
                !notification.isRead
                  ? 'bg-indigo-500/[0.08] hover:bg-indigo-500/[0.14] border-l-2 border-indigo-500'
                  : 'hover:bg-white/[0.04] border-l-2 border-transparent opacity-80'
              }`}
            >
              {getIcon(notification.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`text-xs font-bold truncate ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                    {notification.title || 'Notification'}
                  </h4>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed line-clamp-2 ${!notification.isRead ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
                  {notification.message}
                </p>
              </div>

              {!notification.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 self-center shadow-[0_0_8px_rgba(99,102,241,0.9)]" />
              )}
            </div>
          ))
        ) : (
          <div className="py-12 px-6 text-center flex flex-col items-center justify-center text-gray-400 gap-2">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-1">
              <Bell size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-300">
              {filter === 'unread' ? 'No unread notifications' : "You're all caught up!"}
            </p>
            <p className="text-xs text-gray-500 max-w-[220px]">
              {filter === 'unread' ? 'You have read all your notifications.' : 'New notifications will show up here.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>{notifications.length} total</span>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Mark all read
              </button>
            )}
            {onClearAll && (
              <button
                onClick={onClearAll}
                className="text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationDropdown;
