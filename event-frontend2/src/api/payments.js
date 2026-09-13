import api from './index';

export const createOrder = (data) => api.post('/payment/createOrder', data);
export const verifyPayment = (data) => api.post('/payment/verify-payment', data);
