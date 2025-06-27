
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ChatbotPopup from './components/ChatbotPopup.tsx';
import { UserRole, InitialFormData, Appointment } from './types';
import { getCurrentUserRole, setCurrentUserRole as saveUserRole, clearCurrentUserRole, getCurrentPatientId, setCurrentPatientId as savePatientId, clearCurrentPatientId, getAppointments } from './services/localStorageService';

import PatientLayout from './layouts/PatientLayout';
import AdminLayout from './layouts/AdminLayout';

import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import PatientBookingsPage from './pages/patient/PatientBookingsPage';
import PatientReportsPage from './pages/patient/PatientReportsPage';

const AdminManagePatientsPage: React.FC = () => <div className="p-8"><h1 className="text-2xl font-bold">Manage Patients (Placeholder)</h1></div>;
const AdminSiteSettingsPage: React.FC = () => <div className="p-8"><h1 className="text-2xl font-bold">Site Settings (Placeholder)</h1></div>;


interface ProtectedRouteProps {
  userRole: UserRole;
  allowedRoles: UserRole[];
  children: React.ReactElement<{ onLogout?: () => void }>; 
  onLogout: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userRole, allowedRoles, children, onLogout }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!allowedRoles.includes(userRole)) {
      navigate('/login', { replace: true });
    }
  }, [userRole, allowedRoles, navigate]);

  if (!allowedRoles.includes(userRole)) {
    return null;
  }
  return React.cloneElement(children, { onLogout });
};

const AppContent: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [initialChatFormData, setInitialChatFormData] = useState<InitialFormData | undefined>(undefined);
  const [currentUserRole, setCurrentUserRoleState] = useState<UserRole>(UserRole.NONE);
  const [currentPatientId, setCurrentPatientIdState] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const location = useLocation();

  const isDashboardRoute = location.pathname.startsWith('/admin/') || location.pathname.startsWith('/patient/');

  useEffect(() => {
    setCurrentUserRoleState(getCurrentUserRole());
    setCurrentPatientIdState(getCurrentPatientId());
    setAppointments(getAppointments());
  }, []); 

  const handleLogin = (role: UserRole, id?: string) => {
    saveUserRole(role);
    setCurrentUserRoleState(role);
    if (role === UserRole.PATIENT && id) {
      savePatientId(id);
      setCurrentPatientIdState(id);
    } else if (role !== UserRole.PATIENT) { 
      clearCurrentPatientId();
      setCurrentPatientIdState(null);
    }
  };

  const handleLogout = useCallback(() => {
    clearCurrentUserRole();
    clearCurrentPatientId();
    setCurrentUserRoleState(UserRole.NONE);
    setCurrentPatientIdState(null);
  }, []); 
  
  const openChatbot = useCallback((formData?: InitialFormData) => {
    if (formData) {
      setInitialChatFormData(formData);
    }
    setIsChatbotOpen(true);
  }, []);

  const closeChatbot = useCallback(() => {
    setIsChatbotOpen(false);
    setInitialChatFormData(undefined);
  }, []);

  const refreshAppointments = useCallback(() => {
    setAppointments(getAppointments());
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-dark">
      {!isDashboardRoute && <Navbar userRole={currentUserRole} onLogout={handleLogout} onOpenChatbot={() => openChatbot()} currentPatientId={currentPatientId} />}
      <main className="flex-grow"> 
        <Routes>
          <Route path="/" element={<HomePage onOpenChatbot={openChatbot} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route 
            path="/login" 
            element={currentUserRole === UserRole.NONE ? <LoginPage onLogin={handleLogin} /> : (currentUserRole === UserRole.ADMIN ? <Navigate to="/admin/dashboard" /> : <Navigate to="/patient/dashboard" />)} 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute userRole={currentUserRole} allowedRoles={[UserRole.ADMIN]} onLogout={handleLogout}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage appointments={appointments} />} />
            <Route path="patients" element={<AdminManagePatientsPage />} />
            <Route path="settings" element={<AdminSiteSettingsPage />} />
            <Route index element={<Navigate to="dashboard" />} />
          </Route>

            <Route 
            path="/patient" 
            element={
              <ProtectedRoute userRole={currentUserRole} allowedRoles={[UserRole.PATIENT]} onLogout={handleLogout}>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<PatientDashboardPage appointments={appointments.filter(a => a.patientId === currentPatientId)} patientId={currentPatientId} onOpenChatbot={openChatbot} />} />
            <Route path="bookings" element={<PatientBookingsPage appointments={appointments.filter(a => a.patientId === currentPatientId)} />} />
            <Route path="reports" element={<PatientReportsPage />} />
            <Route index element={<Navigate to="dashboard" />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
      {isChatbotOpen && (
        <ChatbotPopup 
          isOpen={isChatbotOpen} 
          onClose={closeChatbot} 
          initialData={initialChatFormData}
          onAppointmentBooked={(appointment) => {
            if(currentUserRole !== UserRole.PATIENT || currentPatientId !== appointment.patientId) {
              handleLogin(UserRole.PATIENT, appointment.patientId);
            }
            refreshAppointments();
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
