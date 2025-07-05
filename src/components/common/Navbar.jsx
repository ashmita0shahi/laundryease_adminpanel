import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../hooks/useSidebar';
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Mock notifications for the demo
  const notifications = [
    {
      id: 1,
      message: 'New order #12345 received',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      message: 'Payment for order #12340 confirmed',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      message: 'Customer feedback received for order #12335',
      time: 'Yesterday',
      read: true
    }
  ];
  
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);
  
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button & Logo */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-1 mr-3 rounded-md lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            <Link to="/" className="flex items-center lg:hidden">
              <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                LaundryEase
              </span>
            </Link>
          </div>
          
          {/* Right side - User menu, theme toggle, notifications */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
            
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                onClick={toggleNotifications}
                className="p-1 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <BellIcon className="w-6 h-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-danger-500"></span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.read ? '' : 'bg-primary-50 dark:bg-gray-700'}`}
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-4 border-t border-gray-200 dark:border-gray-700">
                    <Link to="/notifications" className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User menu */}
            <div className="relative ml-3">
              <button
                onClick={toggleUserMenu}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
              </button>
              
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="mr-2 w-5 h-5" />
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowLeftOnRectangleIcon className="mr-2 w-5 h-5" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
