
import React from 'react';
import { Link } from 'react-router-dom';
import { Appointment } from '../../types';
import { CalendarDaysIcon, ChatBubbleLeftEllipsisIcon } from '../../components/icons/SolidIcons';
import { EyeIcon } from '../../components/icons/OutlineIcons'; 

interface PatientBookingsPageProps {
  appointments: Appointment[];
}

const PatientBookingsPage: React.FC<PatientBookingsPageProps> = ({ appointments }) => {
  const sortedAppointments = [...appointments].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

  const handleViewDetails = (appointment: Appointment) => {
    alert(`Appointment Details:
    ID: ${appointment.id}
    Symptom: ${appointment.symptom}
    Date: ${new Date(appointment.bookingDate).toLocaleString()}
    Status: ${appointment.paymentStatus}
    Patient ID: ${appointment.patientId}
    (Full details would appear in a modal or dedicated view)`);
  };

  return (
    <div className="space-y-8">
      <header className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
        <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
                <CalendarDaysIcon className="w-10 h-10 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary">My Bookings</h1>
                <p className="text-gray-600 mt-1">Review your past and upcoming appointments.</p>
            </div>
        </div>
      </header>

      {sortedAppointments.length > 0 ? (
        <div className="bg-white shadow-xl rounded-xl p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Symptom / Reason</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-teal-50/50 transition-colors duration-150"> 
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{new Date(app.bookingDate).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.symptom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}> 
                        {app.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(app)} 
                        className="text-primary hover:text-teal-700 p-1.5 flex items-center text-xs bg-primary/10 hover:bg-primary/20 rounded-md transition-all" 
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4 mr-1.5"/> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-xl p-10 text-center"> 
          <ChatBubbleLeftEllipsisIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" /> 
          <h2 className="text-2xl font-semibold text-dark mb-3">No Appointments Found</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            It seems you haven't booked any appointments yet. Our AI assistant is ready to help you schedule your first consultation.
          </p>
          <Link to="/" className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Book an Appointment
          </Link>
        </div>
      )}
    </div>
  );
};

export default PatientBookingsPage;