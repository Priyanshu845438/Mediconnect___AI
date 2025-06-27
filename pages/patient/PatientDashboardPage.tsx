
import React from 'react';
import { Link } from 'react-router-dom';
import { Appointment, InitialFormData } from '../../types';
import { CalendarDaysIcon, ChatBubbleLeftEllipsisIcon, DocumentTextIcon, SparklesIcon } from '../../components/icons/SolidIcons'; // Added SparklesIcon
import { APP_NAME } from '../../constants.ts';

interface PatientDashboardPageProps {
  appointments: Appointment[];
  patientId: string | null;
  onOpenChatbot: (formData?: InitialFormData) => void;
}

const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({ appointments, patientId, onOpenChatbot }) => {
  const latestAppointment = appointments.length > 0 
    ? [...appointments].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())[0]
    : null;
  
  const patientName = latestAppointment?.name || "Valued Patient"; // More generic greeting

  return (
    <div className="space-y-8">
      <header className="bg-gradient-to-r from-primary to-teal-600 shadow-xl rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome Back, {patientName}!</h1>
        <p className="text-teal-100 text-lg">Here's an overview of your health journey with {APP_NAME}.</p>
      </header>

      {latestAppointment && (
        <section className="bg-white shadow-xl rounded-xl p-6 hover:shadow-primary/20 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-dark mb-4 flex items-center">
            <CalendarDaysIcon className="w-7 h-7 text-primary mr-3" />
            Your Next/Latest Appointment
          </h2>
          <div className="bg-teal-50 border-l-4 border-primary p-5 rounded-r-lg">
            <p className="mb-2"><strong className="text-gray-700">Symptom/Reason:</strong> <span className="text-gray-800">{latestAppointment.symptom}</span></p>
            <p className="mb-2"><strong className="text-gray-700">Date:</strong> <span className="text-gray-800">{new Date(latestAppointment.bookingDate).toLocaleString()}</span></p>
            <p><strong className="text-gray-700">Status:</strong> <span className={`capitalize px-3 py-1 rounded-full text-xs font-semibold ${latestAppointment.paymentStatus === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{latestAppointment.paymentStatus}</span></p>
          </div>
          <Link 
            to="/patient/bookings" 
            className="mt-5 inline-block text-primary hover:text-teal-700 font-semibold transition-colors"
          >
            View all bookings &rarr;
          </Link>
        </section>
      )}

      {!latestAppointment && (
         <section className="bg-white shadow-xl rounded-xl p-8 text-center hover:shadow-accent/20 transition-shadow duration-300">
            <SparklesIcon className="w-20 h-20 text-accent mx-auto mb-5" /> {/* Changed icon */}
            <h2 className="text-2xl font-semibold text-dark mb-3">Ready to Start Your Wellness Journey?</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              It looks like you don't have any appointments scheduled yet. <br/>
              Let our AI assistant help you find the right care and book your first visit.
            </p>
            <button
                onClick={() => onOpenChatbot()}
                className="bg-accent text-white font-semibold py-3.5 px-8 rounded-lg shadow-lg hover:bg-pink-500 transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center mx-auto"
            >
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6 mr-2" />
                Book an Appointment
            </button>
         </section>
      )}

      <section className="grid md:grid-cols-2 gap-8"> {/* Increased gap */}
        <div className="bg-white shadow-xl rounded-xl p-6 group hover:shadow-secondary/20 transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-secondary/10 rounded-full mr-4 group-hover:bg-secondary transition-colors duration-300">
                <CalendarDaysIcon className="w-7 h-7 text-secondary group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-dark">Manage Your Bookings</h3>
          </div>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">View, reschedule, or get details about your past and upcoming appointments with ease.</p>
          <Link to="/patient/bookings" className="bg-secondary text-white font-medium py-2.5 px-5 rounded-lg hover:bg-sky-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Go to My Bookings
          </Link>
        </div>
        <div className="bg-white shadow-xl rounded-xl p-6 group hover:shadow-accent/20 transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-accent/10 rounded-full mr-4 group-hover:bg-accent transition-colors duration-300">
                 <DocumentTextIcon className="w-7 h-7 text-accent group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-dark">Access Your Reports</h3>
          </div>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">Securely view your medical reports and health records as soon as they become available.</p>
          <Link to="/patient/reports" className="bg-accent text-white font-medium py-2.5 px-5 rounded-lg hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            View My Reports
          </Link>
        </div>
      </section>
      
       <section className="bg-white shadow-xl rounded-xl p-6 group hover:shadow-primary/20 transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full mr-4 group-hover:bg-primary transition-colors duration-300">
                 <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-dark">Need Assistance?</h3>
          </div>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">{APP_NAME} is available 24/7 to help you with queries, new bookings, or information right from your dashboard.</p>
          <button
            onClick={() => onOpenChatbot()}
            className="bg-primary text-white font-medium py-2.5 px-5 rounded-lg hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Chat with {APP_NAME}
          </button>
        </section>
    </div>
  );
};

export default PatientDashboardPage;