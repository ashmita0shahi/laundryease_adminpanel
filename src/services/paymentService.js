import api from './api';

// Get all payments (admin only)
export const getPayments = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    
    const response = await api.get(`/payments/history?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify Khalti payment
export const verifyKhaltiPayment = async (pidx, orderId) => {
  try {
    const response = await api.post('/payments/verify', { pidx, orderId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment statistics
export const getPaymentStats = async () => {
  try {
    const response = await api.get('/payments/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};
