import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/orderService';
import { getPaymentStats } from '../services/paymentService';
import { 
  ClipboardDocumentListIcon, 
  CurrencyRupeeIcon, 
  UserGroupIcon,
  TruckIcon 
} from '@heroicons/react/24/outline';

import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sample chart data (in a real app, this would come from the backend)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [12000, 19000, 15000, 22000, 25000, 30000, 35000, 33000, 40000, 36000, 42000, 50000],
    orders: [30, 40, 35, 50, 49, 60, 70, 65, 75, 70, 80, 90],
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        try {
          const statsResponse = await getDashboardStats();
          if (statsResponse && statsResponse.data) {
            setStats(statsResponse.data);
          } else {
            console.warn('Unexpected dashboard stats response:', statsResponse);
          }
        } catch (statsErr) {
          console.error('Error fetching dashboard stats:', statsErr);
          // Don't set the main error yet, try to fetch payment stats
        }
        
        // Fetch payment stats
        try {
          const paymentStatsResponse = await getPaymentStats();
          if (paymentStatsResponse && paymentStatsResponse.data) {
            setPaymentStats(paymentStatsResponse.data);
          } else {
            console.warn('Unexpected payment stats response:', paymentStatsResponse);
          }
        } catch (paymentErr) {
          console.error('Error fetching payment stats:', paymentErr);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  // Mock data for the demo (in a real app, this would come from the backend)
  const mockStats = {
    totalOrders: 1243,
    pendingOrders: 18,
    totalRevenue: 342500,
    totalUsers: 825,
    recentOrders: [
      {
        _id: '60d21b4667d0d8992e610c85',
        user: { fullName: 'John Doe' },
        createdAt: new Date(),
        totalAmount: 1250,
        status: 'confirmed'
      },
      {
        _id: '60d21b4667d0d8992e610c86',
        user: { fullName: 'Jane Smith' },
        createdAt: new Date(Date.now() - 86400000),
        totalAmount: 950,
        status: 'washing'
      },
      {
        _id: '60d21b4667d0d8992e610c87',
        user: { fullName: 'Mike Johnson' },
        createdAt: new Date(Date.now() - 172800000),
        totalAmount: 750,
        status: 'delivered'
      },
      {
        _id: '60d21b4667d0d8992e610c88',
        user: { fullName: 'Sarah Williams' },
        createdAt: new Date(Date.now() - 259200000),
        totalAmount: 1450,
        status: 'pending'
      },
      {
        _id: '60d21b4667d0d8992e610c89',
        user: { fullName: 'Alex Brown' },
        createdAt: new Date(Date.now() - 345600000),
        totalAmount: 2100,
        status: 'out_for_delivery'
      }
    ]
  };
  
  const mockPaymentStats = {
    totalPayments: 1150,
    successfulPayments: 1095,
    failedPayments: 55,
    khaltiPayments: 764,
    cashPayments: 386
  };

  // Use real data if available, otherwise fall back to mock data
  // Ensure we have a valid object with all the required properties to avoid errors
  const displayStats = stats ? {
    totalOrders: stats.totalOrders || 0,
    pendingOrders: stats.pendingOrders || 0,
    totalRevenue: stats.totalRevenue || 0,
    totalUsers: stats.totalUsers || 0,
    recentOrders: stats.recentOrders || mockStats.recentOrders
  } : mockStats;
  
  // Same for payment stats
  const displayPaymentStats = paymentStats ? {
    totalPayments: paymentStats.totalPayments || 0,
    successfulPayments: paymentStats.successfulPayments || 0,
    failedPayments: paymentStats.failedPayments || 0,
    khaltiPayments: paymentStats.khaltiPayments || 0,
    cashPayments: paymentStats.cashPayments || 0
  } : mockPaymentStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome to your LaundryEase admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={displayStats?.totalOrders || 0}
          icon={ClipboardDocumentListIcon}
          change="12.5%"
          changeType="increase"
          footer="Since last month"
        />
        <StatCard
          title="Revenue"
          value={`Rs. ${(displayStats?.totalRevenue || 0).toLocaleString()}`}
          icon={CurrencyRupeeIcon}
          change="8.2%"
          changeType="increase"
          footer="Since last month"
        />
        <StatCard
          title="Total Users"
          value={displayStats?.totalUsers || 0}
          icon={UserGroupIcon}
          change="5.1%"
          changeType="increase"
          footer="Since last month"
        />
        <StatCard
          title="Pending Orders"
          value={displayStats?.pendingOrders || 0}
          icon={TruckIcon}
          change="3"
          changeType="decrease"
          footer="Since yesterday"
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={chartData} />

      {/* Recent Orders */}
      <RecentOrdersTable orders={displayStats?.recentOrders || []} loading={false} />
    </div>
  );
};

export default Dashboard;
