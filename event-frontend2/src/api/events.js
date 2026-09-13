import api from './index';

export const createEvent = (data) => api.post('/events/createEvent', data, {
  headers: {
    'Content-Type': 'multipart/form-data' // Assuming file uploads are used
  }
});
export const getAllEvents = () => api.get('/events/getAllEvents');
export const getClubEvents = (clubId) => api.get(`/events/club/${clubId}`);
export const getSingleEvent = (eventId) => api.get(`/events/${eventId}`);
export const deleteEvent = (id) => api.delete(`/events/deleteEvent/${id}`);
