import api from './index';

export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const verifyOtpUser = (data) => api.post('/verify-otp', data);
export const resendOtpUser = (data) => api.post('/resend-otp', data);
export const getDashboard = () => api.get('/dashboard');
