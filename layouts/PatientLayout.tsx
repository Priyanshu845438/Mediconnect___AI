
import React from 'react';
import { Outlet } from 'react-router-dom'; // Removed useNavigate
import PatientSidebar from '../components/patient/PatientSidebar';
// Removed clearCurrentUserRole, clearCurrentPatientId as they are handled by the passed onLogout function

interface PatientLayoutProps {
  onLogout?: () => void; // Made onLogout optional, as it's injected by ProtectedRoute
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ onLogout }) => {
  // Removed local handleLogout and useNavigate
  return (
    <div className="flex flex-col md:flex-row flex-grow bg-extralight"> 
      {/* Use non-null assertion as ProtectedRoute guarantees onLogout */}
      <PatientSidebar onLogout={onLogout!} /> 
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
