import api from './index';

export const getNotifications = () => {
  return api.get('/notifications');
};

export const markAsRead = (notificationId = null) => {
  return api.patch('/notifications/read', { notificationId });
};

// Admin only
export const broadcastNotification = (data) => {
  return api.post('/notifications/broadcast', data);
};
