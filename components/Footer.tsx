
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, CONTACT_DETAILS } from '../constants.ts';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light border-t border-gray-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">{APP_NAME}</h3>
            <p className="text-gray-400">Your health, our priority. Advanced care with a personal touch.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-primary transition-colors text-gray-300">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors text-gray-300">Services</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors text-gray-300">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors text-gray-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <address className="not-italic text-gray-400 space-y-2">
              <p className="flex items-start">
                {React.cloneElement(CONTACT_DETAILS.mapIcon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0"})}
                <span>{CONTACT_DETAILS.address}</span>
              </p>
              <p className="flex items-center">
                 {React.cloneElement(CONTACT_DETAILS.phoneIcon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-5 h-5 text-primary mr-2 flex-shrink-0"})}
                <a href={`tel:${CONTACT_DETAILS.phone}`} className="hover:text-primary transition-colors text-gray-300">{CONTACT_DETAILS.phone}</a>
              </p>
              <p className="flex items-center">
                {React.cloneElement(CONTACT_DETAILS.emailIcon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-5 h-5 text-primary mr-2 flex-shrink-0"})}
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="hover:text-primary transition-colors text-gray-300">{CONTACT_DETAILS.email}</a>
              </p>
            </address>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-2">Stay updated with our latest news and health tips.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="w-full p-2 rounded-md bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-primary focus:border-primary" />
              <button type="submit" className="mt-2 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
