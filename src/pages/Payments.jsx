import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getPayments } from '../services/paymentService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchPayments();
  }, [currentPage, filterStatus]);
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (filterStatus) {
        filters.status = filterStatus;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      const response = await getPayments(currentPage, 10, filters);
      setPayments(response.data);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err) {
      setError('Failed to load payments. Please try again.');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchPayments();
  };
  
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Status badge styles
  const statusClasses = {
    pending: 'bg-gray-100 text-gray-700',
    processing: 'bg-primary-100 text-primary-700',
    completed: 'bg-success-100 text-success-700',
    failed: 'bg-danger-100 text-danger-700',
  };
  
  // Format status text for display
  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Format payment method for display
  const formatPaymentMethod = (method) => {
    return method === 'khalti' 
      ? 'Khalti' 
      : method === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : method;
  };
  
  // Mock payments for the demo (in a real app, this would come from the backend)
  const mockPayments = [
    {
      _id: '60d21b4667d0d8992e610c85',
      order: {
        _id: '60d21b4667d0d8992e610c80',
        totalAmount: 1250
      },
      user: { 
        fullName: 'John Doe',
        email: 'john@example.com'
      },
      amount: 1250,
      paymentMethod: 'khalti',
      status: 'completed',
      transactionId: 'KHL12345678',
      createdAt: new Date()
    },
    {
      _id: '60d21b4667d0d8992e610c86',
      order: {
        _id: '60d21b4667d0d8992e610c81',
        totalAmount: 950
      },
      user: { 
        fullName: 'Jane Smith',
        email: 'jane@example.com'
      },
      amount: 950,
      paymentMethod: 'cash_on_delivery',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      _id: '60d21b4667d0d8992e610c87',
      order: {
        _id: '60d21b4667d0d8992e610c82',
        totalAmount: 750
      },
      user: { 
        fullName: 'Mike Johnson',
        email: 'mike@example.com'
      },
      amount: 750,
      paymentMethod: 'khalti',
      status: 'processing',
      transactionId: 'KHL12345679',
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      _id: '60d21b4667d0d8992e610c88',
      order: {
        _id: '60d21b4667d0d8992e610c83',
        totalAmount: 2100
      },
      user: { 
        fullName: 'Alex Brown',
        email: 'alex@example.com'
      },
      amount: 2100,
      paymentMethod: 'khalti',
      status: 'failed',
      transactionId: 'KHL12345680',
      createdAt: new Date(Date.now() - 345600000)
    }
  ];
  
  // Use real data if available, otherwise fall back to mock data
  const displayPayments = payments.length > 0 ? payments : mockPayments;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Payments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track customer payments
          </p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments by transaction ID or customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pr-10"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          <button
            onClick={toggleFilters}
            className="btn btn-secondary flex items-center"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="statusFilter" className="form-label">Status</label>
              <select
                id="statusFilter"
                value={filterStatus}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Payments Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center my-8">
            <Loader size="large" />
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : displayPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {displayPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment._id.substring(0, 8)}...
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.transactionId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <Link to={`/users/${payment.user?._id}`} className="hover:text-primary-600">
                          {payment.user?.fullName || 'Unknown'}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.user?.email || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/orders/${payment.order?._id}`} 
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        #{payment.order?._id.substring(0, 8) || 'N/A'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Rs. {payment.amount?.toFixed(2) || payment.order?.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPaymentMethod(payment.paymentMethod)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(payment.createdAt), 'dd MMM yyyy')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(payment.createdAt), 'hh:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusClasses[payment.status]
                        }`}
                      >
                        {formatStatus(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/payments/${payment._id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="View details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No payments found.</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Showing page{' '}
                  <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page number indicators */}
                  {[...Array(totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => setCurrentPage(page + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page + 1
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
