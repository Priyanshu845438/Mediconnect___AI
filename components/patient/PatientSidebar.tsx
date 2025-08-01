
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import { PATIENT_SIDEBAR_LINKS } from '../../constants.ts'; 
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '../icons/SolidIcons'; 

interface PatientSidebarProps {
  onLogout: () => void;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate(); 
  const activeClassName = "bg-primary text-white shadow-md border-l-4 border-accent";
  const inactiveClassName = "text-gray-700 hover:bg-teal-50 hover:text-primary border-l-4 border-transparent";

  return (
    <aside className="w-full md:w-72 bg-white shadow-xl md:min-h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
            <UserCircleIcon className="h-14 w-14 text-primary rounded-full bg-teal-100 p-2 ring-2 ring-primary/50" />
            <div>
                <h2 className="text-2xl font-bold text-primary">Patient Portal</h2>
            </div>
        </div>
      </div>
      <nav className="flex-grow py-4 px-3 space-y-1">
        {PATIENT_SIDEBAR_LINKS.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3.5 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm group
               ${isActive ? activeClassName : inactiveClassName}`
            }
          >
            <link.icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${ activeClassName.includes('text-white') ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-gray-200">
        <button
          onClick={() => {
            onLogout();
            navigate('/login');
          }}
          className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold text-sm bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 shadow-sm hover:shadow-md`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default PatientSidebar;