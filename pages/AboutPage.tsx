import React from 'react';
import { STATIC_CONTENT } from '../constants.ts';
import { CheckCircleIcon } from '../components/icons/SolidIcons';


const AboutPage: React.FC = () => {
  const { title, mission, vision, values, story, imageUrl } = STATIC_CONTENT.aboutUs;

  return (
    <div className="bg-extralight py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{title}</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Learn more about our commitment to your health and well-being.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="prose prose-lg text-gray-700 max-w-none">
            <h2 className="text-2xl font-semibold text-dark mb-3">Our Story</h2>
            <p>{story}</p>
          </div>
          <div>
            <img src={imageUrl} alt="Aura Health Clinic" className="rounded-xl shadow-2xl w-full h-auto object-cover" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-dark mb-4">Our Mission</h2>
            <p className="text-gray-700">{mission}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-dark mb-4">Our Vision</h2>
            <p className="text-gray-700">{vision}</p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-dark mb-8 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-extralight rounded-lg">
                <CheckCircleIcon className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-dark">{value}</h3>
                  <p className="text-gray-600 text-sm">Dedicated to upholding this principle in all our interactions.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold text-dark mb-12">Meet Our Team (Placeholder)</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
                 <div key={i} className="bg-white p-6 rounded-lg shadow-lg text-center">
                 <img src={`https://picsum.photos/seed/team${i}/150/150`} alt={`Team member ${i}`} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary" />
                 <h3 className="text-xl font-semibold text-dark">Dr. Placeholder {i}</h3>
                 <p className="text-primary">Specialty</p>
               </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;