
import React from 'react';
import { DocumentTextIcon } from '../../components/icons/SolidIcons'; 
import { EnvelopeIcon } from '../../components/icons/OutlineIcons';

const PatientReportsPage: React.FC = () => {
  return (
    <div className="space-y-8"> {/* Increased space */}
      <header className="bg-white shadow-xl rounded-xl p-6 sm:p-8"> {/* Increased padding and shadow */}
         <div className="flex items-center">
            <div className="p-3 bg-accent/10 rounded-full mr-4">
                <DocumentTextIcon className="w-10 h-10 text-accent" /> {/* Larger icon */}
            </div>
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-accent">My Reports</h1> {/* Larger title, accent color */}
                <p className="text-gray-600 mt-1">Access your medical reports and health summaries.</p>
            </div>
        </div>
      </header>

      <div className="bg-white shadow-xl rounded-xl p-10 text-center"> {/* Increased padding and shadow */}
        <DocumentTextIcon className="w-24 h-24 text-gray-300 mx-auto mb-8" /> {/* Larger icon */}
        <h2 className="text-2xl font-semibold text-dark mb-4">No Reports Available Yet</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          Your medical reports will securely appear here once they are processed and uploaded by our clinical team. 
          You'll be notified when new reports are available. Please check back later or if you have any questions, feel free to contact our support team.
        </p>
        <a 
            href="#/contact" 
            className="inline-flex items-center bg-secondary text-white font-semibold py-3 px-8 rounded-lg hover:bg-sky-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
            <EnvelopeIcon className="w-5 h-5 mr-2.5"/> Contact Support
        </a>
      </div>
    </div>
  );
};

export default PatientReportsPage;
// Removed local Link component definition. Using direct <a> for hash link.