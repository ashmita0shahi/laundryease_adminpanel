const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} LaundryEase. All rights reserved.
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
          Admin Dashboard v1.0.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;
