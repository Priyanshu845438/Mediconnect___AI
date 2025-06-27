
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS, APP_NAME, MOCKED_PATIENT_PASSWORD } from '../constants.ts';
import { UserRole } from '../types';
import { getAppointments } from '../services/localStorageService';
import { UserCircleIcon } from '../components/icons/SolidIcons'; 
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '../components/icons/OutlineIcons';

interface LoginPageProps {
  onLogin: (role: UserRole, id?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PATIENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === UserRole.ADMIN) {
      if (email === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        onLogin(UserRole.ADMIN);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } else if (selectedRole === UserRole.PATIENT) {
      if (!email.trim() || !password.trim()) {
        setError('Email and password are required.');
        return;
      }

      const appointments = getAppointments();
      const patientAppointment = appointments.find(app => app.email.toLowerCase() === email.toLowerCase());

      if (patientAppointment && password === MOCKED_PATIENT_PASSWORD) {
        onLogin(UserRole.PATIENT, patientAppointment.patientId);
        navigate('/patient/dashboard');
      } else if (patientAppointment && password !== MOCKED_PATIENT_PASSWORD) {
        setError(`Invalid password for patient. If this is your first time, try the default password or re-book via our AI assistant if unsure.`);
      } 
       else {
        setError('Patient email not found. Please ensure you have an existing booking or check your email. New patients can start by chatting with our AI assistant.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:shadow-primary/30 duration-300 ease-in-out">
        <div className="text-center mb-8">
          <UserCircleIcon className="w-20 h-20 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-dark">{APP_NAME} Login</h1>
          <p className="text-gray-600 mt-2">Access your account or the admin panel.</p>
        </div>

        {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Login as:
            </label>
            <div className="flex space-x-4">
              {(Object.keys(UserRole) as Array<keyof typeof UserRole>)
                .filter(role => UserRole[role] !== UserRole.NONE)
                .map(roleKey => (
                  <button
                    key={UserRole[roleKey]}
                    type="button"
                    onClick={() => setSelectedRole(UserRole[roleKey])}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border-2 transition-all duration-150 ease-in-out
                                            ${selectedRole === UserRole[roleKey]
                                                ? 'bg-primary text-white border-primary shadow-md'
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                                            }`}
                  >
                    {UserRole[roleKey].charAt(0) + UserRole[roleKey].slice(1).toLowerCase()}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-colors"
                placeholder={selectedRole === UserRole.ADMIN ? ADMIN_CREDENTIALS.username : "yourpatient.email@example.com"}
                />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-colors"
                placeholder={selectedRole === UserRole.PATIENT ? `Default: ${MOCKED_PATIENT_PASSWORD}` : "••••••••"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
        {selectedRole === UserRole.PATIENT && (
          <p className="mt-6 text-center text-xs text-gray-500">
            For demo purposes, existing patients can log in with their booking email and the password "{MOCKED_PATIENT_PASSWORD}". New? Chat with our AI assistant to book an appointment first.
          </p>
        )}
        <p className="mt-4 text-center text-sm text-gray-500">
            Forgot password? <a href="#/contact" className="font-medium text-primary hover:text-teal-700">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
