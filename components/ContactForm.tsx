
import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitted(false);
    // Simulate API call
    try {
      // Replace with actual API call: await api.submitContactForm(formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full">
      <h2 className="text-3xl font-bold text-dark mb-8">Send Us a Message</h2>
      {isSubmitted && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Your message has been sent successfully! We'll get back to you soon.
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea name="message" id="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"></textarea>
        </div>
        <div>
          <button type="submit" className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
