import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Sidebar = () => {
  const { sidebarOpen, closeSidebar } = useSidebar();
  const location = useLocation();
  
  // Submenus state
  const [openSubMenu, setOpenSubMenu] = useState(null);
  
  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      path: '/',
    },
    {
      name: 'Orders',
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      path: '/orders',
    },
    {
      name: 'Services',
      icon: <Squares2X2Icon className="w-5 h-5" />,
      path: '/services',
    },
    {
      name: 'Users',
      icon: <UserGroupIcon className="w-5 h-5" />,
      path: '/users',
    },
    {
      name: 'Payments',
      icon: <CurrencyRupeeIcon className="w-5 h-5" />,
      path: '/payments',
    },
  ];
  
  // Sidebar overlay for mobile
  const overlay = sidebarOpen && (
    <div 
      className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      onClick={closeSidebar}
    />
  );
  
  return (
    <>
      {overlay}
      
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
              LaundryEase
            </span>
          </Link>
          <button
            onClick={closeSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white lg:hidden"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-md text-sm font-medium
                ${isActive ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              onClick={item.subItems ? () => toggleSubMenu(item.name) : closeSidebar}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
              {item.subItems && (
                <ChevronDownIcon
                  className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                    openSubMenu === item.name ? 'transform rotate-180' : ''
                  }`}
                />
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
