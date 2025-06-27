import React, { isValidElement } from 'react';
import ContactForm from '../components/ContactForm';
import { CONTACT_DETAILS } from '../constants.ts';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-extralight py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Get In Touch</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We're here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <ContactForm />

          <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-dark mb-8">Contact Information</h2>
            <div className="space-y-6 text-gray-700">
              <div className="flex items-start">
                {isValidElement(CONTACT_DETAILS.mapIcon) && React.cloneElement(CONTACT_DETAILS.mapIcon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-8 h-8 text-primary mr-4 mt-1 flex-shrink-0"})}
                <div>
                  <h3 className="text-xl font-semibold text-dark">Our Address</h3>
                  <p>{CONTACT_DETAILS.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                 {isValidElement(CONTACT_DETAILS.emailIcon) && React.cloneElement(CONTACT_DETAILS.emailIcon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-8 h-8 text-primary mr-4 mt-1 flex-shrink-0"})}
                <div>
                  <h3 className="text-xl font-semibold text-dark">Email Us</h3>
                  <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-primary hover:text-teal-700 transition-colors">{CONTACT_DETAILS.email}</a>
                </div>
              </div>
              <div className="flex items-start">
                {isValidElement(CONTACT_DETAILS.phoneIcon) && React.cloneElement(CONTACT_DETAILS.phoneIcon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-8 h-8 text-primary mr-4 mt-1 flex-shrink-0"})}
                <div>
                  <h3 className="text-xl font-semibold text-dark">Call Us</h3>
                  <a href={`tel:${CONTACT_DETAILS.phone}`} className="text-primary hover:text-teal-700 transition-colors">{CONTACT_DETAILS.phone}</a>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
                 <h3 className="text-xl font-semibold text-dark mb-3">Office Hours</h3>
                 <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                 <p>Saturday: 10:00 AM - 4:00 PM</p>
                 <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="mt-16 md:mt-24 h-96 bg-gray-300 rounded-xl shadow-lg flex items-center justify-center">
            <p className="text-gray-500 text-xl">Embedded Map Placeholder (e.g., Google Maps)</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;