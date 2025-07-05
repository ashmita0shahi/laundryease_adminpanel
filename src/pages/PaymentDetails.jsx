import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getPaymentById } from '../services/paymentService';
import { getUserById } from '../services/userService';
import { getOrderById } from '../services/orderService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);
  
  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await getPaymentById(id);
      const paymentData = response.data;
      setPayment(paymentData);
      
      // Fetch user data
      if (paymentData.userId) {
        try {
          const userResponse = await getUserById(paymentData.userId);
          setUser(userResponse.data);
        } catch (userErr) {
          console.error('Error fetching user details:', userErr);
        }
      }
      
      // Fetch order data
      if (paymentData.order) {
        try {
          const orderResponse = await getOrderById(paymentData.order);
          setOrder(orderResponse.data);
        } catch (orderErr) {
          console.error('Error fetching order details:', orderErr);
        }
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load payment details. Please try again.');
      console.error('Error fetching payment details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Normalized payment data
  const displayPayment = payment ? {
    ...payment,
    paymentMethod: payment.method, // Map 'method' to 'paymentMethod' for consistency
    user: user || null,
    order: order || null
  } : null;
  
  // Status badge styles
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };
  
  // Format status text for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Format payment method for display
  const formatPaymentMethod = (method) => {
    if (!method) return 'Unknown';
    return method === 'khalti' 
      ? 'Khalti' 
      : method === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : method;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, h:mm a');
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  // Format customer name
  const formatCustomerName = (user) => {
    if (!user) return 'N/A';
    if (user.fullName) return user.fullName;
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
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
  
  if (!displayPayment) {
    return <Alert type="warning" message="Payment information not found." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/payments" className="btn btn-icon btn-ghost">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Payment #{displayPayment._id ? displayPayment._id.substring(0, 8) : 'Unknown'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created on {formatDate(displayPayment.createdAt)}
            </p>
          </div>
        </div>
        <div>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              statusClasses[displayPayment.status] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {formatStatus(displayPayment.status)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details */}
        <div className="lg:col-span-2">
          <div className="card space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Payment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment ID</p>
                    <p className="text-gray-900 dark:text-white font-medium">{displayPayment?._id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {displayPayment?.transactionId || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Rs. {displayPayment?.amount?.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CreditCardIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="text-gray-900 dark:text-white">
                        {formatPaymentMethod(displayPayment.paymentMethod || displayPayment.method)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(displayPayment?.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    {displayPayment.status === 'completed' ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-1" />
                    ) : displayPayment.status === 'failed' ? (
                      <XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-1" />
                    ) : displayPayment.status === 'processing' ? (
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : displayPayment.status === 'pending' ? (
                      <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5 mr-2" />
                    )}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-gray-900 dark:text-white">
                        {formatStatus(displayPayment.status)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {displayPayment?.notes && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                  Notes
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {displayPayment.notes}
                </p>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Order Items
              </h3>
              
              {displayPayment?.order?.items?.length > 0 ? (
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {displayPayment.order.items.map((item, index) => {
                        const serviceName = 
                          item.service?.name || 
                          (typeof item.service === 'string' ? item.service : 'Unknown Service');
                          
                        const price = parseFloat(item.price || 0);
                        const quantity = parseInt(item.quantity || 0);
                        
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {serviceName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {item.item || item.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                              Rs. {price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                              Rs. {(price * quantity).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <td colSpan="4" className="px-6 py-3 text-right font-medium">
                          Total:
                        </td>
                        <td className="px-6 py-3 text-right font-bold">
                          Rs. {(displayPayment.order.totalAmount || displayPayment.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : displayPayment.order && typeof displayPayment.order !== 'string' ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Order items not available</p>
                  <Link
                    to={`/orders/${displayPayment.order._id}`}
                    className="mt-2 inline-block text-primary-600 hover:text-primary-800"
                  >
                    View Order Details
                  </Link>
                </div>
              ) : displayPayment.order && typeof displayPayment.order === 'string' ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Order items not available</p>
                  <Link
                    to={`/orders/${displayPayment.order}`}
                    className="mt-2 inline-block text-primary-600 hover:text-primary-800"
                  >
                    View Order Details
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No items available</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Customer and Order Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Information */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Customer Information
            </h2>
            
            {displayPayment.user ? (
              <div className="space-y-3">
                <div className="flex items-start">
                  <UserCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                    <Link 
                      to={`/users/${displayPayment.user._id}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      {formatCustomerName(displayPayment.user)}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">
                      {displayPayment.user.email || 'N/A'}
                    </p>
                  </div>
                </div>
                
                {displayPayment.user.phoneNumber && (
                  <div className="flex items-start">
                    <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white">
                        {displayPayment.user.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : displayPayment.userId ? (
              <div className="flex justify-center">
                <Loader size="small" />
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Customer information not available</p>
            )}
          </div>
          
          {/* Order Information */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Order Information
            </h2>
            
            {displayPayment.order ? (
              <div className="space-y-3">
                <div className="flex items-start">
                  <DocumentTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <Link 
                      to={`/orders/${displayPayment.order._id}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      {displayPayment.order._id}
                    </Link>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Rs. {(displayPayment.order.totalAmount || displayPayment.amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : typeof displayPayment.order === 'string' ? (
              <div className="space-y-3">
                <div className="flex items-start">
                  <DocumentTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <Link 
                      to={`/orders/${displayPayment.order}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      {displayPayment.order}
                    </Link>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Rs. {displayPayment.amount?.toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Order information not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
