import { useState, useEffect } from 'react';
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService 
} from '../services/serviceService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentService, setCurrentService] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'washing',
    icon: 'default_icon.png',
    estimatedDuration: '',
    items: [{ name: '', price: 0 }],
    isActive: true
  });
  
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle item input changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'price' ? parseFloat(value) : value
    };
    setFormData({ ...formData, items: updatedItems });
  };
  
  // Add new item field
  const addItemField = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', price: 0 }]
    });
  };
  
  // Remove item field
  const removeItemField = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: updatedItems });
    }
  };
  
  // Open modal for creating a new service
  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      category: 'washing',
      icon: 'default_icon.png',
      estimatedDuration: '',
      items: [{ name: '', price: 0 }],
      isActive: true
    });
    setFormError(null);
    setFormSuccess(null);
    setModalMode('create');
    setShowModal(true);
  };
  
  // Open modal for editing a service
  const openEditModal = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      icon: service.icon,
      estimatedDuration: service.estimatedDuration,
      items: service.items.length > 0 ? service.items : [{ name: '', price: 0 }],
      isActive: service.isActive
    });
    setFormError(null);
    setFormSuccess(null);
    setModalMode('edit');
    setShowModal(true);
  };
  
  // Validate form before submission
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Service name is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setFormError('Service description is required');
      return false;
    }
    
    if (!formData.estimatedDuration.trim()) {
      setFormError('Estimated duration is required');
      return false;
    }
    
    // Validate items
    for (const item of formData.items) {
      if (!item.name.trim()) {
        setFormError('All item names are required');
        return false;
      }
      
      if (isNaN(item.price) || item.price < 0) {
        setFormError('All item prices must be valid numbers');
        return false;
      }
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormSubmitting(true);
      setFormError(null);
      
      if (modalMode === 'create') {
        await createService(formData);
        setFormSuccess('Service created successfully!');
      } else {
        await updateService(currentService._id, formData);
        setFormSuccess('Service updated successfully!');
      }
      
      // Refresh services list
      await fetchServices();
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err) {
      setFormError('An error occurred. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Handle service deletion
  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      setFormSubmitting(true);
      await deleteService(serviceToDelete._id);
      await fetchServices();
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
    } catch (err) {
      setError('Failed to delete service. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Format category for display
  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Services</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage laundry services offered to customers
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Add New Service
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <Loader size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="btn btn-icon btn-sm btn-ghost text-gray-500 hover:text-primary-600"
                    title="Edit service"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setServiceToDelete(service);
                      setShowDeleteConfirm(true);
                    }}
                    className="btn btn-icon btn-sm btn-ghost text-gray-500 hover:text-red-600"
                    title="Delete service"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <span className="inline-flex items-center mb-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {formatCategory(service.category)}
              </span>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Items:
                </h4>
                <ul className="space-y-1">
                  {service.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Rs. {item.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Duration: {service.estimatedDuration}</span>
                <span className="flex items-center">
                  {service.isActive ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 text-success-500 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 text-danger-500 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {modalMode === 'create' ? 'Add New Service' : 'Edit Service'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {formError && <Alert type="error" message={formError} className="mb-4" />}
              {formSuccess && <Alert type="success" message={formSuccess} className="mb-4" />}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="form-label">Service Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="washing">Washing</option>
                      <option value="dry_cleaning">Dry Cleaning</option>
                      <option value="ironing">Ironing</option>
                      <option value="specialized">Specialized</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="icon" className="form-label">Icon</label>
                    <input
                      type="text"
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="estimatedDuration" className="form-label">Estimated Duration</label>
                    <input
                      type="text"
                      id="estimatedDuration"
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleInputChange}
                      placeholder="e.g. 2-3 hours"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="form-label">Service Items</label>
                    <button
                      type="button"
                      onClick={addItemField}
                      className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" /> Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="w-1/3">
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            className="form-input"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemField(index)}
                            className="text-gray-400 hover:text-danger-500"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Active (available to customers)
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                    disabled={formSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formSubmitting}
                  >
                    {formSubmitting
                      ? 'Saving...'
                      : modalMode === 'create'
                      ? 'Create Service'
                      : 'Update Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 z-10">
              <div className="flex items-center mb-4">
                <div className="bg-danger-100 rounded-full p-2 mr-3">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Delete Service
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-medium">{serviceToDelete?.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-secondary"
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
