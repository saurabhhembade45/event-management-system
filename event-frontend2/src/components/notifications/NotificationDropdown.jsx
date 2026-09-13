import { motion } from 'framer-motion';
import { Info, Calendar, BellRing, CheckCheck, X, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ notifications = [], onMarkAsRead, onMarkAllAsRead, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'system':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Info size={16} />
          </div>
        );
      case 'user':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Calendar size={16} />
          </div>
        );
      case 'admin':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <BellRing size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Bell size={16} />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="fixed sm:absolute top-20 sm:top-14 right-3 sm:right-0 left-3 sm:left-auto w-[calc(100vw-1.5rem)] sm:w-96 bg-[#030712]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]"
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Bell size={16} />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              <span className="hidden sm:inline">Mark all read</span>
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

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[340px] custom-scrollbar divide-y divide-white/5">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                if (!notification.isRead) onMarkAsRead(notification._id);
              }}
              className={`p-4 flex gap-3.5 transition-all cursor-pointer ${
                !notification.isRead
                  ? 'bg-indigo-500/[0.06] hover:bg-indigo-500/[0.1] border-l-2 border-indigo-500'
                  : 'hover:bg-white/[0.03] border-l-2 border-transparent opacity-80'
              }`}
            >
              {getIcon(notification.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className={`text-xs font-semibold truncate ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                    {notification.title || 'Notification'}
                  </h4>
                  <span className="text-[10px] text-gray-500 shrink-0 font-medium">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed line-clamp-2 ${!notification.isRead ? 'text-gray-200' : 'text-gray-400'}`}>
                  {notification.message}
                </p>
              </div>

              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 self-center shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </div>
          ))
        ) : (
          <div className="py-12 px-6 text-center flex flex-col items-center justify-center text-gray-400 gap-2">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-1">
              <Bell size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-300">You're all caught up!</p>
            <p className="text-xs text-gray-500 max-w-[200px]">No new notifications at this time.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>{notifications.length} notification{notifications.length === 1 ? '' : 's'}</span>
          {unreadCount > 0 ? (
            <button
              onClick={onMarkAllAsRead}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Clear unread
            </button>
          ) : (
            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
              ✓ All read
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default NotificationDropdown;
