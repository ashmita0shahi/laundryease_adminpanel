import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getOrderById, updateOrderStatus } from '../services/orderService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      setOrder(response.data);
      // Set the current status as the default selected status
      setNewStatus(response.data.status);
    } catch (err) {
      setError('Failed to load order details. Please try again.');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(null);
      
      await updateOrderStatus(id, newStatus, statusNote);
      
      // Refresh order data
      const response = await getOrderById(id);
      setOrder(response.data);
      
      setUpdateSuccess('Order status updated successfully');
      setStatusNote(''); // Clear the note field
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
    } catch (err) {
      setUpdateError('Failed to update order status. Please try again.');
      console.error('Error updating order status:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Status badge styles
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
      return format(new Date(dateString), 'dd MMM yyyy, h:mm a');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/orders" className="btn btn-icon btn-ghost">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Order #{id.substring(0, 8)}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {order?.createdAt && `Created on ${formatDate(order.createdAt)}`}
            </p>
          </div>
        </div>
        <div>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              statusClasses[order?.status]
            }`}
          >
            {formatStatus(order?.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="card space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Order Items
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {order?.items?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {item.service?.name || 'Unknown Service'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.service?.description || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{item.item}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">Rs. {item.price?.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right font-medium">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        Rs. {order?.totalAmount?.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Status History
              </h2>
              <div className="space-y-3">
                {order?.statusHistory?.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full mr-4 ${statusClasses[status.status] || 'bg-gray-100'}`}
                    >
                      {status.status === 'cancelled' ? (
                        <XCircleIcon className="w-5 h-5" />
                      ) : (
                        <CheckCircleIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{formatStatus(status.status)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(status.timestamp)}
                        </span>
                      </div>
                      {status.note && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{status.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary and Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Information */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Customer Information
            </h2>
            {order?.user ? (
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300 font-medium">{order.user.fullName}</p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="text-gray-500 dark:text-gray-400">Email:</span> {order.user.email}
                </p>
                {order.user.phoneNumber && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span> {order.user.phoneNumber}
                  </p>
                )}
                <Link to={`/users/${order.user._id}`} className="btn btn-sm btn-outline-primary mt-2">
                  View Customer Profile
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Customer information not available</p>
            )}
          </div>

          {/* Pickup Location */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Pickup Location
            </h2>
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
              <p className="text-gray-700 dark:text-gray-300">{order?.pickupLocation}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Payment Details
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order?.paymentStatus === 'completed'
                      ? 'bg-success-100 text-success-700'
                      : order?.paymentStatus === 'failed'
                      ? 'bg-danger-100 text-danger-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {formatStatus(order?.paymentStatus)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Method:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatStatus(order?.paymentMethod)}</span>
              </div>
              {order?.paymentDetails?.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
                  <span className="text-gray-700 dark:text-gray-300">{order.paymentDetails.transactionId}</span>
                </div>
              )}
              {order?.paymentDetails?.paymentDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Payment Date:</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatDate(order.paymentDetails.paymentDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Update Order Status */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Update Order Status
            </h2>
            
            {updateSuccess && <Alert type="success" message={updateSuccess} />}
            {updateError && <Alert type="error" message={updateError} />}
            
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="washing">Washing</option>
                  <option value="drying">Drying</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="note" className="form-label">
                  Note (Optional)
                </label>
                <textarea
                  id="note"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change"
                  className="form-input"
                  rows="3"
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Status'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
