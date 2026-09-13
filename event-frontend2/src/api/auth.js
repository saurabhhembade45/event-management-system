import api from './index';

export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const getDashboard = () => api.get('/dashboard');
