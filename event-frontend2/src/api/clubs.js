import api from './index';

export const getClubs = () => api.get('/clubs/getClubs');
export const createClub = (data) => api.post('/clubs/createClub', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const deleteClub = (id) => api.delete(`/clubs/deleteClub/${id}`);
