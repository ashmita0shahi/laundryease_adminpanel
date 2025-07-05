import api from './api';

// Get all services
export const getAllServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get service by ID
export const getServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new service (admin only)
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update service (admin only)
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await api.put(`/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete service (admin only)
export const deleteService = async (serviceId) => {
  try {
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
