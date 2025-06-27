
import { Appointment, UserRole } from '../types';

const APPOINTMENTS_KEY = 'auraHealthAppointments';
const USER_ROLE_KEY = 'auraHealthUserRole';
const PATIENT_ID_KEY = 'auraHealthPatientId';

// Appointments
export const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem(APPOINTMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

// User Role
export const getCurrentUserRole = (): UserRole => {
  return (localStorage.getItem(USER_ROLE_KEY) as UserRole) || UserRole.NONE;
};

export const setCurrentUserRole = (role: UserRole): void => {
  localStorage.setItem(USER_ROLE_KEY, role);
};

export const clearCurrentUserRole = (): void => {
  localStorage.removeItem(USER_ROLE_KEY);
};

// Patient ID
export const getCurrentPatientId = (): string | null => {
  return localStorage.getItem(PATIENT_ID_KEY);
};

export const setCurrentPatientId = (patientId: string): void => {
  localStorage.setItem(PATIENT_ID_KEY, patientId);
};

export const clearCurrentPatientId = (): void => {
  localStorage.removeItem(PATIENT_ID_KEY);
};
