import api from './api';

// Get all orders (admin)
export const getAdminOrders = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    
    const response = await api.get(`/orders/admin?${queryParams}`);
    // Return the response directly to access the raw axios response
    return response;
  } catch (error) {
    console.error('Error in getAdminOrders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status, note = '') => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status, note });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/orders/dashboard-stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};
