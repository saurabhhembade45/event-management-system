import api from './index';

export const getParticipantCount = (eventId) => api.get(`/participants/count/${eventId}`);
export const getMyParticipations = () => api.get('/participants/my');
export const checkParticipation = (eventId) => api.get(`/participants/check/${eventId}`);
