
import React from 'react';
import { Outlet } from 'react-router-dom';
import PatientSidebar from '../components/patient/PatientSidebar';

interface PatientLayoutProps {
  onLogout?: () => void;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ onLogout }) => {
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
