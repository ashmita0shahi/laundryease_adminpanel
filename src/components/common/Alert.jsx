import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Alert = ({ 
  type = 'info', 
  message, 
  title,
  dismissible = true,
  onDismiss = () => {},
  className = ''
}) => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };
  
  const alertStyles = {
    info: {
      container: 'bg-primary-50 border-primary-400 text-primary-800',
      icon: <InformationCircleIcon className="h-5 w-5 text-primary-500" />,
    },
    success: {
      container: 'bg-success-50 border-success-400 text-success-800',
      icon: <CheckCircleIcon className="h-5 w-5 text-success-500" />,
    },
    warning: {
      container: 'bg-warning-50 border-warning-400 text-warning-800',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-warning-500" />,
    },
    error: {
      container: 'bg-danger-50 border-danger-400 text-danger-800',
      icon: <XCircleIcon className="h-5 w-5 text-danger-500" />,
    },
  };
  
  const { container, icon } = alertStyles[type];
  
  return (
    <div className={`rounded-md border-l-4 p-4 ${container} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''}`}>{message}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleDismiss}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
