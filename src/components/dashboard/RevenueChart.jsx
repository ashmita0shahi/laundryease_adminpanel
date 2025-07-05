import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.revenue,
        borderColor: '#1590FF',
        backgroundColor: 'rgba(21, 144, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Orders',
        data: data.orders,
        borderColor: '#FF8B15',
        backgroundColor: 'rgba(255, 139, 21, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rs. ' + value;
          }
        }
      },
    },
  };

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Revenue Overview
      </h2>
      <Line data={chartData} options={options} height={80} />
    </div>
  );
};

export default RevenueChart;
