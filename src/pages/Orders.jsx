import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { getAdminOrders, updateOrderStatus } from '../services/orderService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { toast } from 'react-toastify';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [visibleColumns, setVisibleColumns] = useState({
    orderId: true,
    customer: true,
    date: true,
    items: true,
    amount: true,
    status: true,
    actions: true
  });
  
  useEffect(() => {
    fetchOrders();
  }, [currentPage, filterStatus]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (filterStatus) {
        filters.status = filterStatus;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      // Add timestamp to prevent caching
      filters.timestamp = new Date().getTime();
      
      const response = await getAdminOrders(currentPage, 10, filters);
      
      // Check if response exists and has the expected structure
      if (response && response.data && response.data.success) {
        // Set orders from the data array
        setOrders(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        console.log('Fetched orders:', response.data.data);
      } else {
        // If response doesn't have expected structure, set orders to empty array
        setOrders([]);
        setTotalPages(1);
        console.warn('Unexpected response structure:', response);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error fetching orders:', err);
      // Set orders to empty array on error
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchOrders();
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
  
  // Function to handle status updates
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setStatusUpdateLoading(true);
      
      // Call API to update order status
      const response = await updateOrderStatus(orderId, newStatus);
      
      if (response && response.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        
        toast.success(`Order status updated to ${formatStatus(newStatus)}`);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingOrderId(null);
    }
  };
  
  // Sorting handler
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  // Date range filter handler
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };
  
  // Column visibility handler
  const handleColumnToggle = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
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
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // No more mock data - we're using real API data only
  
  // Use only real API data, no more fallback to mock data
  const displayOrders = Array.isArray(orders) ? orders : [];
  
  // Debug: Log current state values
  console.log('Current state:', { 
    ordersLength: displayOrders.length,
    totalPages, 
    currentPage,
    loading,
    error 
  });
  
  // Filter and sort orders before display
  let filteredOrders = [...displayOrders];

  // Filter by date range
  if (dateRange.from && dateRange.to) {
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return isWithinInterval(orderDate, {
        start: new Date(dateRange.from),
        end: new Date(dateRange.to)
      });
    });
  }

  // Sort orders
  filteredOrders.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    if (sortBy === 'customer') {
      aValue = a.user?.fullName || '';
      bValue = b.user?.fullName || '';
    }
    if (sortBy === 'amount') {
      aValue = a.totalAmount;
      bValue = b.totalAmount;
    }
    if (sortBy === 'status') {
      aValue = a.status;
      bValue = b.status;
    }
    if (sortBy === 'createdAt') {
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Orders</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage customer orders and their statuses
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
                placeholder="Search orders by ID, customer name, or phone"
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
                <option value="confirmed">Confirmed</option>
                <option value="washing">Washing</option>
                <option value="drying">Drying</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Column Visibility Controls */}
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.keys(visibleColumns).map((col) => (
          <label key={col} className="flex items-center space-x-1 text-xs">
            <input
              type="checkbox"
              checked={visibleColumns[col]}
              onChange={() => handleColumnToggle(col)}
            />
            <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
          </label>
        ))}
      </div>
      
      {/* Date Range Filter */}
      <div className="flex gap-2 mb-2">
        <label className="text-xs">From:
          <input type="date" name="from" value={dateRange.from} onChange={handleDateChange} className="ml-1 form-input text-xs" />
        </label>
        <label className="text-xs">To:
          <input type="date" name="to" value={dateRange.to} onChange={handleDateChange} className="ml-1 form-input text-xs" />
        </label>
      </div>
      
      {/* Orders Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center my-8">
            <Loader size="large" />
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {visibleColumns.orderId && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('_id')}>
                      Order ID {sortBy === '_id' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  )}
                  {visibleColumns.customer && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('customer')}>
                      Customer {sortBy === 'customer' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  )}
                  {visibleColumns.date && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('createdAt')}>
                      Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  )}
                  {visibleColumns.items && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Items
                    </th>
                  )}
                  {visibleColumns.amount && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amount')}>
                      Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {visibleColumns.orderId && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          {order._id.substring(0, 8)}...
                        </Link>
                      </td>
                    )}
                    {visibleColumns.customer && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {(order.user && order.user.fullName) || 'Unknown'}
                        </div>
                      </td>
                    )}
                    {visibleColumns.date && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(order.createdAt), 'dd MMM yyyy')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(order.createdAt), 'hh:mm a')}
                        </div>
                      </td>
                    )}
                    {visibleColumns.items && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {(Array.isArray(order.items) ? 
                            order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) 
                            : 0)} items
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {Array.isArray(order.items) && order.items.length > 0 ? 
                            order.items
                              .filter(item => item && item.service)
                              .map(item => item.service.name)
                              .join(', ') 
                            : 'No items'}
                        </div>
                      </td>
                    )}
                    {visibleColumns.amount && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Rs. {(order.totalAmount || 0).toFixed(2)}
                        </div>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusClasses[order.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status ? formatStatus(order.status) : 'Unknown'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusUpdateLoading && updatingOrderId === order._id ? (
                          <div className="flex justify-center">
                            <div className="w-5 h-5 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <select
                            className="form-select text-sm py-1 px-2"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="washing">Washing</option>
                            <option value="drying">Drying</option>
                            <option value="out_for_delivery">Out For Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
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

export default Orders;
