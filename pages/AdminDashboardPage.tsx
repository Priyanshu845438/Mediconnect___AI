
import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '../components/icons/OutlineIcons'; 
import { UserGroupIcon, CheckCircleIcon, ClockIcon, ListBulletIcon } from '../components/icons/SolidIcons'; 

interface AdminDashboardPageProps {
  appointments: Appointment[];
}

const ITEMS_PER_PAGE = 10;

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ appointments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Appointment | null; direction: 'ascending' | 'descending' }>({ key: 'bookingDate', direction: 'descending' });

  const filteredAppointments = useMemo(() => {
    let filtered = appointments.filter(app => 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (valA === null || valA === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valB === null || valB === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
        
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [appointments, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const requestSort = (key: keyof Appointment) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: keyof Appointment) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '↕'; // Default sort indicator for unsorted columns
  };

  const handleViewAppointment = (appointment: Appointment) => {
    alert(`Viewing Appointment:\nID: ${appointment.id}\nName: ${appointment.name}\nPatient ID: ${appointment.patientId}\nSymptom: ${appointment.symptom}\nStatus: ${appointment.paymentStatus}\nDate: ${new Date(appointment.bookingDate).toLocaleString()}`);
  };

  return (
    <div className="space-y-8">
      <header className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage patient appointments and site data efficiently.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Changed to 3 columns for better fit */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark">Total Appointments</h3>
            <div className="p-2 bg-primary/10 rounded-full">
                <ListBulletIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-4xl font-bold text-primary">{appointments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark">Completed Payments</h3>
            <div className="p-2 bg-green-500/10 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-green-500">{appointments.filter(a => a.paymentStatus === 'completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark">Pending Payments</h3>
            <div className="p-2 bg-yellow-500/10 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-500" /> {/* Changed icon to ClockIcon (Solid) */}
            </div>
          </div>
          <p className="text-4xl font-bold text-yellow-500">{appointments.filter(a => a.paymentStatus === 'pending').length}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl"> {/* Increased padding */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-dark">Appointments List</h2>
          <div className="relative w-full sm:w-auto">
            <input 
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-72 shadow-sm transition-colors" // Enhanced search bar
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {paginatedAppointments.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200"> {/* Added border around table container */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {['Patient ID', 'Name', 'Email', 'Symptom', 'Booking Date', 'Status', 'Actions'].map((header) => {
                    const sortKeyMap: {[key: string]: keyof Appointment} = {
                        'Patient ID': 'patientId',
                        'Name': 'name',
                        'Email': 'email',
                        'Symptom': 'symptom',
                        'Booking Date': 'bookingDate',
                        'Status': 'paymentStatus'
                    };
                    const currentSortKey = sortKeyMap[header];
                    return (
                        <th key={header} scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => currentSortKey && requestSort(currentSortKey)}>
                            {header} <span className="ml-1 text-gray-500">{currentSortKey && getSortIndicator(currentSortKey)}</span>
                        </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-teal-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.patientId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">{app.symptom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(app.bookingDate).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {app.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleViewAppointment(app)} className="text-primary hover:text-teal-700 p-1.5 rounded-md hover:bg-primary/10 transition-all" title="View Details"><EyeIcon className="w-5 h-5"/></button>
                      <button className="text-secondary hover:text-sky-700 p-1.5 rounded-md hover:bg-secondary/10 transition-all" title="Edit (Placeholder)"><PencilIcon className="w-5 h-5"/></button>
                      <button className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-500/10 transition-all" title="Delete (Placeholder)"><TrashIcon className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
             <ListBulletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" /> {/* Changed icon */}
             <p className="text-lg">No appointments found.</p>
             <p className="text-sm mt-1">Try adjusting your search terms or wait for new bookings.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center"> {/* Increased top margin */}
            <span className="text-sm text-gray-700 mb-3 sm:mb-0">
              Showing <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAppointments.length)}</span> of <span className="font-semibold">{filteredAppointments.length}</span> results
            </span>
            <div className="inline-flex mt-2 sm:mt-0 shadow-md rounded-lg"> {/* Added shadow and rounded-lg to parent */}
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-r-0 border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;