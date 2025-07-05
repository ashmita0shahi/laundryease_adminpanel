import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const RecentOrdersTable = ({ orders, loading }) => {
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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h2>
        <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-800 flex items-center">
          View all <ArrowRightIcon className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link to={`/orders/${order._id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                      {order._id.substring(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{order.user?.fullName || 'Unknown'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(order.createdAt), 'dd MMM yyyy')}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Rs. {order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
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
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No recent orders found.</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
