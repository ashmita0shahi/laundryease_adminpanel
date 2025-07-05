import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getUserById, updateUser, getUserOrders } from '../services/userService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  KeyIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    role: 'user'
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  useEffect(() => {
    fetchUserDetails();
    fetchUserOrders();
  }, [id]);
  
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserById(id);
      setUser(response.data);
      
      // Initialize form data with user details
      setFormData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phoneNumber: response.data.phoneNumber || '',
        location: response.data.location || '',
        role: response.data.role || 'user'
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load user details. Please try again.');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserOrders = async () => {
  try {
    setOrdersLoading(true);
    const response = await getUserOrders(id);
    setUserOrders(response.data.data || []);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    setUserOrders([]);
  } finally {
    setOrdersLoading(false);
  }
};
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormSubmitting(true);
      setFormError(null);
      
      await updateUser(id, formData);
      
      // Refresh user data
      const response = await getUserById(id);
      setUser(response.data);
      
      setFormSuccess('User details updated successfully');
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowEditModal(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err) {
      setFormError('Failed to update user details. Please try again.');
      console.error('Error updating user:', err);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Status badge styles for orders
  const statusClasses = {
    pending: 'bg-gray-100 text-gray-700',
    confirmed: 'bg-primary-100 text-primary-700',
    washing: 'bg-primary-100 text-primary-700',
    drying: 'bg-warning-100 text-warning-700',
    out_for_delivery: 'bg-warning-100 text-warning-700',
    delivered: 'bg-success-100 text-success-700',
    cancelled: 'bg-danger-100 text-danger-700',
  };
  
  // Format status text for display
  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <Loader size="large" />
      </div>
    );
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/users" className="btn btn-icon btn-ghost">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          User Profile
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Details Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center mb-6">
              <div className="inline-block p-2 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                <UserCircleIcon className="w-16 h-16 text-gray-500 dark:text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.fullName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user?.role === 'admin'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {user?.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>
              
              {user?.phoneNumber && (
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white">{user.phoneNumber}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white">{user?.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn btn-primary w-full"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Orders History */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Order History
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {userOrders.length} orders
              </span>
            </div>
            
            {ordersLoading ? (
              <div className="flex justify-center my-8">
                <Loader size="medium" />
              </div>
            ) : userOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {userOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/orders/${order._id}`}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                          >
                            {order._id.substring(0, 8)}...
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            Rs. {order.totalAmount?.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              statusClasses[order.status]
                            }`}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No orders found for this user.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Edit User Profile
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {formError && <Alert type="error" message={formError} className="mb-4" />}
              {formSuccess && <Alert type="success" message={formSuccess} className="mb-4" />}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
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
                    {formSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
