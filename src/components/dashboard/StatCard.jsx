const StatCard = ({ title, value, icon, change, changeType = 'increase', footer }) => {
  const Icon = icon;
  
  return (
    <div className="card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            
            {change && (
              <p className={`ml-2 text-sm font-medium ${
                changeType === 'increase' ? 'text-success-600' : 'text-red-600'
              }`}>
                {changeType === 'increase' ? '+' : ''}{change}
              </p>
            )}
          </div>
        </div>
        
        <div className={`p-3 rounded-full ${
          changeType === 'increase' ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-red-600'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {footer && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default StatCard;
