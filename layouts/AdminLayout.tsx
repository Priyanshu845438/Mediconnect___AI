import React from 'react';
import { Outlet } from 'react-router-dom'; 
import AdminSidebar from '../components/admin/AdminSidebar';

interface AdminLayoutProps {
  onLogout?: () => void; 
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col md:flex-row flex-grow bg-extralight"> 
      <AdminSidebar onLogout={onLogout!} /> 
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
