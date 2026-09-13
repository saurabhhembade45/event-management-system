import { motion } from 'framer-motion';
import { Settings, Info, Calendar, BellRing, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'system': return <Info size={18} className="text-purple-500" />;
      case 'user': return <Calendar size={18} className="text-green-500" />;
      case 'admin': return <BellRing size={18} className="text-orange-400" />;
      default: return <BellRing size={18} className="text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-14 w-[420px] glass-card rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col"
    >
      <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              onClick={() => {
                if(!notification.isRead) onMarkAsRead(notification._id);
              }}
              className="px-4 py-4 border-b border-white/5 flex gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 pr-4">
                <p className={`text-sm tracking-wide ${!notification.isRead ? 'text-gray-200' : 'text-gray-400'}`}>
                  {notification.message}
                </p>
                {notification.title && (
                   <span className="text-xs text-indigo-400 mt-1 block">
                     {notification.title}
                   </span>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="text-[12px] text-gray-500 font-medium">
                  {formatDistanceToNow(new Date(notification.createdAt))} ago
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500 h-32 tracking-wide">
            You're all caught up!
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-black/10 flex justify-between items-center border-t border-white/10">
         <button 
            onClick={onClose} 
            className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
         >
            Close
         </button>
         {notifications.some(n => !n.isRead) ? (
            <button 
               onClick={onMarkAllAsRead} 
               className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
               Mark all as read
            </button>
         ) : (
            <span className="text-xs text-gray-500">No unread notifications</span>
         )}
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;
