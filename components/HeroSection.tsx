
import React, { useState } from 'react';
import { InitialFormData } from '../types';
import { ChatBubbleLeftEllipsisIcon } from './icons/SolidIcons';
import { APP_NAME } from '../constants.ts'; 

interface HeroSectionProps {
  onOpenChatbot: (formData: InitialFormData) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenChatbot }) => {
  const [formData, setFormData] = useState<InitialFormData>({
    name: '',
    email: '',
    phone: '',
    symptom: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onOpenChatbot(formData);
    // Optionally clear form:
    // setFormData({ name: '', email: '', phone: '', symptom: '' }); 
  };

  return (
    <div className="relative bg-gradient-to-br from-primary via-teal-700 to-teal-900 text-white py-24 md:py-40 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-25"></div>

      {/* Decorative Graphics Layer - NEW */}
      <div className="absolute inset-0 z-[5]" aria-hidden="true">
        {/* Sweeping Bands */}
        <svg
          className="absolute -right-1/4 sm:-right-1/3 md:-right-1/2 top-0 h-full w-auto transform translate-x-1/3 -translate-y-1/4 opacity-15 sm:opacity-20"
          width="1000" // Increased width for larger sweep
          height="800" // Increased height
          viewBox="0 0 1000 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-200 800C50 600 200 200 500 400C800 600 950 300 1200 100" stroke="white" strokeWidth="180" strokeLinecap="round"/>
          <path d="M-150 750C100 550 250 150 550 350C850 550 1000 250 1250 50" stroke="white" strokeWidth="120" strokeLinecap="round" strokeOpacity="0.5"/>
        </svg>

        {/* Soft Orbs/Particles Cluster */}
        <div className="absolute top-1/4 left-4 sm:left-10 md:left-20 transform -translate-y-1/2 animate-spin_slow"> {/* Added animate-spin_slow */}
        </div>
         <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 opacity-20 hidden md:block">
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="75" cy="75" r="60" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
            <circle cx="75" cy="75" r="40" stroke="white" strokeOpacity="0.2" strokeWidth="4"/>
            <path d="M75 30 V0 M75 120 V150 M30 75 H0 M120 75 H150" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
            <path d="M106.066 43.934 L127.279 22.721 M43.934 106.066 L22.721 127.279 M43.934 43.934 L22.721 22.721 M106.066 106.066 L127.279 127.279" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
          </svg>
        </div>

      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="md:pr-8">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              Welcome to {APP_NAME}
            </h1>
            <p className="text-lg sm:text-xl text-white opacity-95 mb-8"> {/* Increased opacity */}
              Your journey to better health starts here. Get instant assistance from our AI assistant, or book an appointment with our specialists.
            </p>
            <button 
              onClick={() => onOpenChatbot(formData)} 
              className="bg-accent text-white font-semibold py-4 px-10 rounded-lg shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105 text-lg flex items-center animate-pulse"
            >
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 mr-3" />
              Chat with {APP_NAME} Now
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-xl shadow-2xl border border-primary/30"> {/* Enhanced form container */}
            <h2 className="text-3xl font-bold text-dark mb-8 text-center">Quick Enquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm transition-shadow" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm transition-shadow" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm transition-shadow" />
              </div>
              <div>
                <label htmlFor="symptom" className="block text-sm font-medium text-gray-700">Briefly describe your symptom(s)</label>
                <textarea name="symptom" id="symptom" rows={3} value={formData.symptom} onChange={handleChange} required className="mt-1 block w-full px-3 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm transition-shadow"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Start Chat & Get Help
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
