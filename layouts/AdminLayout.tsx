
import React from 'react';
import { Outlet } from 'react-router-dom'; // Removed useNavigate
import AdminSidebar from '../components/admin/AdminSidebar';
// Removed clearCurrentUserRole as it's handled by the passed onLogout function

interface AdminLayoutProps {
  onLogout?: () => void; // Made onLogout optional, as it's injected by ProtectedRoute
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  // Removed local handleLogout and useNavigate
  return (
    <div className="flex flex-col md:flex-row flex-grow bg-extralight"> 
      {/* Use non-null assertion as ProtectedRoute guarantees onLogout */}
      <AdminSidebar onLogout={onLogout!} /> 
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
