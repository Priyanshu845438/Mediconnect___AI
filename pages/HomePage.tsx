
import React, { isValidElement } from 'react';
import HeroSection from '../components/HeroSection';
import { InitialFormData, Service } from '../types';
import { MOCK_SERVICES, STATIC_CONTENT, APP_NAME } from '../constants.ts';
import { ChatBubbleLeftRightIcon } from '../components/icons/SolidIcons'; 

interface HomePageProps {
  onOpenChatbot: (formData: InitialFormData) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOpenChatbot }) => {
  return (
    <div className="bg-extralight"> 
      <HeroSection onOpenChatbot={onOpenChatbot} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <section className="py-16 md:py-20 bg-white border-b border-gray-200"> 
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Why Choose {APP_NAME}?</h2>
            <p className="text-gray-600 mb-12 md:mb-16 max-w-2xl mx-auto">We are committed to providing exceptional healthcare services with a focus on your well-being and convenience.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {STATIC_CONTENT.whyChooseUs.map((item, index) => (
                <div key={index} className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1.5">
                  <div className="mb-6 bg-teal-100 p-4 rounded-full inline-flex group-hover:bg-primary transition-colors duration-300">
                    {isValidElement(item.icon) && React.cloneElement(item.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "w-10 h-10 text-primary group-hover:text-white transition-colors duration-300" })}
                  </div>
                  <h3 className="text-xl font-semibold text-dark mb-2">{item.title}</h3> 
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white border-b border-gray-200">
          <div className="text-center"> 
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-12 md:mb-16">What Our Patients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah L.", location: "Wellness City", quote: `${APP_NAME} has transformed my healthcare experience. The doctors are attentive and the AI assistant is incredibly helpful!` },
                { name: "John B.", location: "Metroville", quote: `Booking appointments is so easy with our AI assistant! The care I received was top-notch. Highly recommend.` },
                { name: "Lisa K.", location: "Springfield", quote: "Finally, a clinic that embraces technology for patient convenience. The team is wonderful and very professional." }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-8 rounded-xl shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center border-t-4 border-primary rounded-t-lg">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-primary mb-6" />
                  <p className="text-lg italic text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p> 
                  <div className="mt-auto">
                    <h4 className="font-bold text-dark text-lg">{testimonial.name}</h4> 
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
