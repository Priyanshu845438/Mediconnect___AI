
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { NAV_LINKS, APP_NAME } from '../constants.ts';
import { UserRole, PageLink } from '../types';
import { ChatBubbleLeftEllipsisIcon as ChatIconSolid, ArrowRightOnRectangleIcon, UserCircleIcon } from './icons/SolidIcons';
import { Bars3Icon, XMarkIcon } from './icons/OutlineIcons';


interface NavbarProps {
  userRole: UserRole;
  onLogout: () => void;
  onOpenChatbot: () => void;
  currentPatientId: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout, onOpenChatbot, currentPatientId }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const filteredNavLinks = NAV_LINKS.filter(link => {
    if (link.hideWhenAuth && link.hideWhenAuth === userRole) return false;
    if (link.path === '/login' && userRole !== UserRole.NONE) return false;
    return true;
  });

  const activeStyle = "text-primary border-b-2 border-primary";
  const inactiveStyle = "hover:text-primary transition-colors";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold text-primary">
              {APP_NAME}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {filteredNavLinks.map((link: PageLink) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-md font-medium`}
              >
                {link.name}
              </NavLink>
            ))}
             {userRole === UserRole.PATIENT && currentPatientId && (
              <NavLink 
                to="/patient/dashboard"
                className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-md font-medium flex items-center`}
              >
                <UserCircleIcon className="w-5 h-5 mr-1.5" /> My Dashboard
              </NavLink>
            )}
            {userRole === UserRole.ADMIN && (
              <NavLink 
                to="/admin/dashboard"
                className={({ isActive }) => `${isActive ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-md font-medium flex items-center`}
              >
                 <UserCircleIcon className="w-5 h-5 mr-1.5" /> Admin Panel
              </NavLink>
            )}
            <button
              onClick={onOpenChatbot}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center"
            >
              <ChatIconSolid className="w-5 h-5 mr-2" /> Ask MediConnect AI
            </button>
            {userRole !== UserRole.NONE && (
              <button
                onClick={() => { onLogout(); navigate('/login'); }}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
                onClick={onOpenChatbot}
                className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary mr-2"
                aria-label="Ask MediConnect AI"
              >
                <ChatIconSolid className="w-6 h-6" />
            </button>
            {userRole !== UserRole.NONE && (
                <button
                onClick={() => { onLogout(); navigate('/login'); }}
                className="p-2 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 mr-2"
                aria-label="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Open main menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-extralight hover:text-primary'} block px-3 py-2 rounded-md text-base font-medium`}
              >
                {link.name}
              </NavLink>
            ))}
            {userRole === UserRole.PATIENT && currentPatientId && (
              <NavLink 
                to="/patient/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-extralight hover:text-primary'} block px-3 py-2 rounded-md text-base font-medium`}
              >
                My Dashboard
              </NavLink>
            )}
             {userRole === UserRole.ADMIN && (
              <NavLink 
                to="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-extralight hover:text-primary'} block px-3 py-2 rounded-md text-base font-medium`}
              >
                Admin Panel
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
