import api from './api';

// Get all users (admin only)
export const getUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const queryParams = new URLSearchParams({ page, limit, search });
    const response = await api.get(`/users/getalluser?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/admin/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/admin/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId, page = 1, limit = 10) => {
  try {
    const queryParams = new URLSearchParams({ userId, page, limit });
    const response = await api.get(`/orders/history?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
