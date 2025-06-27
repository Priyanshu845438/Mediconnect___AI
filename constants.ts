
import React from 'react';
import { PageLink, Service, BlogPost, UserRole, SidebarLink } from './types';
import { 
  HeartIcon, UserGroupIcon, BeakerIcon, ClipboardDocumentListIcon, 
  ChatBubbleLeftEllipsisIcon, MapPinIcon as MapPinIconSolid, CheckCircleIcon, 
  CalendarDaysIcon, ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon, DocumentTextIcon, HomeIconSolid, ListBulletIcon,
  ChatBubbleLeftRightIcon
} from './components/icons/SolidIcons';
import { 
  MapPinIcon, PhoneIcon, EnvelopeIcon, BuildingOffice2Icon, QuestionMarkCircleIcon 
} from './components/icons/OutlineIcons';


export const APP_NAME = "MediConnect AI";

export const NAV_LINKS: PageLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' },
];

export const ADMIN_CREDENTIALS = {
  username: 'admin@mediconnect.ai',
  password: 'password123',
};

export const MOCKED_PATIENT_PASSWORD = "patient123";


export const ADMIN_SIDEBAR_LINKS: SidebarLink[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIconSolid, requiresAuth: UserRole.ADMIN },
  { name: 'Manage Patients', path: '/admin/patients', icon: UserGroupIcon, requiresAuth: UserRole.ADMIN },
  { name: 'Site Settings', path: '/admin/settings', icon: Cog6ToothIcon, requiresAuth: UserRole.ADMIN },
];

export const PATIENT_SIDEBAR_LINKS: SidebarLink[] = [
  { name: 'Dashboard', path: '/patient/dashboard', icon: HomeIconSolid, requiresAuth: UserRole.PATIENT },
  { name: 'My Bookings', path: '/patient/bookings', icon: CalendarDaysIcon, requiresAuth: UserRole.PATIENT },
  { name: 'My Reports', path: '/patient/reports', icon: DocumentTextIcon, requiresAuth: UserRole.PATIENT },
];


export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'General Consultation', description: 'Comprehensive health check-ups and consultations with experienced doctors.', icon: React.createElement(UserGroupIcon, { className: "w-12 h-12 text-primary" }) },
  { id: '2', name: 'Cardiology', description: 'Specialized heart care, diagnostics, and treatment plans.', icon: React.createElement(HeartIcon, { className: "w-12 h-12 text-primary" }) },
  { id: '3', name: 'Diagnostics Lab', description: 'Advanced lab testing for accurate diagnosis.', icon: React.createElement(BeakerIcon, { className: "w-12 h-12 text-primary" }) },
  { id: '4', name: 'Mental Wellness', description: 'Counseling and therapy sessions for mental well-being.', icon: React.createElement(ChatBubbleLeftEllipsisIcon, { className: "w-12 h-12 text-primary" }) },
  { id: '5', name: 'Pediatrics', description: 'Specialized care for infants, children, and adolescents.', icon: React.createElement(BuildingOffice2Icon, { className: "w-12 h-12 text-primary" }) }, // Changed icon for variety
  { id: '6', name: 'Emergency Care', description: '24/7 emergency services for urgent medical needs.', icon: React.createElement(ClipboardDocumentListIcon, { className: "w-12 h-12 text-primary" }) },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  { id: '1', title: 'The Importance of Regular Health Check-ups', excerpt: 'Discover why routine health screenings are crucial for early detection and prevention of diseases...', imageUrl: 'https://picsum.photos/400/250?random=1', author: 'Dr. Emily Carter', date: 'October 26, 2023' },
  { id: '2', title: 'Managing Stress in a Fast-Paced World', excerpt: 'Learn effective strategies to cope with stress and improve your overall well-being...', imageUrl: 'https://picsum.photos/400/250?random=2', author: 'Dr. Johnathan Lee', date: 'October 22, 2023' },
  { id: '3', title: 'Nutritional Tips for a Healthier Heart', excerpt: 'Explore dietary changes you can make to promote cardiovascular health and reduce risks...', imageUrl: 'https://picsum.photos/400/250?random=3', author: 'Dr. Sarah Miller', date: 'October 18, 2023' },
];

export const MOCK_NEARBY_HOSPITALS = [
    { name: "City General Hospital", address: "123 Main St, Anytown", phone: "555-1234" },
    { name: "County Medical Center", address: "456 Oak Ave, Anytown", phone: "555-5678" },
    { name: "St. Luke's Healthcare", address: "789 Pine Rd, Anytown", phone: "555-9012" },
];

export const RAZORPAY_KEY_ID: string = 'rzp_test_1DP5mmOlF5G5ag';
export const APPOINTMENT_FEE = 100000; 
export const WHATSAPP_SUPPORT_NUMBER = '+12345678900'; 

export const CONTACT_DETAILS = {
  address: "123 Health Drive, Wellness City, HC 45678",
  phone: "+1 (555) 123-4567",
  email: "contact@mediconnect.ai",
  mapIcon: React.createElement(MapPinIcon, { className: "w-6 h-6 text-primary" }),
  phoneIcon: React.createElement(PhoneIcon, { className: "w-6 h-6 text-primary" }),
  emailIcon: React.createElement(EnvelopeIcon, { className: "w-6 h-6 text-primary" }),
};

export const BOT_GREETING_MESSAGE = "Hello! I'm your MediConnect AI assistant. How can I help you today?";


export const STATIC_CONTENT = {
  aboutUs: {
    title: "About MediConnect AI",
    mission: "Our mission is to provide accessible, compassionate, and high-quality healthcare to every individual. We believe in leveraging technology to enhance patient experience and outcomes.",
    vision: "To be a leading healthcare provider recognized for clinical excellence, innovation, and patient-centered care.",
    values: ["Compassion", "Excellence", "Integrity", "Innovation", "Teamwork"],
    story: "Founded in 2023, MediConnect AI was born out of a desire to bridge the gap between traditional healthcare and modern technological advancements. We started as a small clinic with a big vision: to make healthcare more proactive, personalized, and convenient. Our team of dedicated professionals works tirelessly to ensure that you receive the best possible care in a comfortable and supportive environment. We are constantly evolving, adopting new technologies like our AI-powered assistant to better serve your needs.",
    imageUrl: "https://picsum.photos/seed/aboutus/600/400"
  },
  whyChooseUs: [
    { title: "Experienced Professionals", description: "Our team consists of highly skilled and experienced doctors, nurses, and support staff.", icon: React.createElement(UserGroupIcon, { className: "w-8 h-8 text-primary" }) },
    { title: "Advanced Technology", description: "We utilize cutting-edge medical technology for accurate diagnosis and effective treatment.", icon: React.createElement(BeakerIcon, { className: "w-8 h-8 text-primary" }) },
    { title: "Patient-Centric Care", description: "Your health and comfort are our top priorities. We provide personalized care tailored to your needs.", icon: React.createElement(HeartIcon, { className: "w-8 h-8 text-primary" }) },
    { title: "AI-Powered Assistance", description: "Our MediConnect AI assistant provides instant support for queries and appointment scheduling.", icon: React.createElement(ChatBubbleLeftEllipsisIcon, { className: "w-8 h-8 text-primary" }) },
  ]
};

// SVG Icons
export { 
    HeartIcon, UserGroupIcon, BeakerIcon, ClipboardDocumentListIcon, ChatBubbleLeftEllipsisIcon, 
    MapPinIconSolid, CheckCircleIcon, CalendarDaysIcon, ArrowRightOnRectangleIcon, UserCircleIcon,
    Cog6ToothIcon, DocumentTextIcon, HomeIconSolid, ListBulletIcon, ChatBubbleLeftRightIcon
};
export { MapPinIcon, PhoneIcon, EnvelopeIcon, BuildingOffice2Icon, QuestionMarkCircleIcon };
