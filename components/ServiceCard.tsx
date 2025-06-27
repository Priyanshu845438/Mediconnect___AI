
import React, { isValidElement } from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col h-full border border-gray-200/80 hover:border-primary/40 hover:shadow-primary/20"> {/* Added group */}
      <div className="p-8 flex-grow">
        <div className="flex justify-center mb-6">
           {isValidElement(service.icon) && React.cloneElement(service.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-16 h-16 text-primary group-hover:text-accent transition-colors duration-300" })} {/* Icon hover effect */}
        </div>
        <h3 className="text-2xl font-semibold text-dark text-center mb-3">{service.name}</h3>
        <p className="text-gray-600 text-center text-sm leading-relaxed">{service.description}</p>
      </div>
      <div className="p-6 bg-gray-50 text-center mt-auto border-t border-gray-200/60">
        <a 
          href="#/contact" 
          className="inline-block bg-teal-50 text-primary hover:bg-teal-100 group-hover:bg-primary/10 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-300 shadow-sm hover:shadow-md" /* Restyled "Learn More" */
        >
          Learn More &rarr;
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
