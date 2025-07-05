const Loader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };
  
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-solid border-primary-500 border-t-transparent ${sizeClasses[size]} ${className}`}
      ></div>
    </div>
  );
};

export default Loader;
