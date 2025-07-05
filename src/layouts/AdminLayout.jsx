import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { SidebarProvider } from '../context/SidebarContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
