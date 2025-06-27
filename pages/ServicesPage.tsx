
import React from 'react';
import { MOCK_SERVICES, APP_NAME } from '../constants.ts';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-extralight py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Medical Services</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We offer a comprehensive range of healthcare services to meet all your needs. Our team is dedicated to providing expert care with compassion.
          </p>
        </header>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_SERVICES.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <section className="mt-16 md:mt-24 text-center bg-white p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-dark mb-6">Ready to Book an Appointment?</h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            Use our {APP_NAME} Assistant for quick scheduling or contact us directly. We're here to help you on your path to wellness.
          </p>
          <div>
            <a href="#/" className="bg-accent text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-pink-500 transition-colors text-lg mr-4">
              Chat with {APP_NAME}
            </a>
            <a href="#/contact" className="bg-secondary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-sky-700 transition-colors text-lg">
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;