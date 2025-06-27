
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



export const RAZORPAY_KEY_ID: string = 'rzp_test_1DP5mmOlF5G5ag';
export const APPOINTMENT_FEE = 100000; 
export const WHATSAPP_SUPPORT_NUMBER = '+916206698170'; 

export const CONTACT_DETAILS = {
  address: "Parul University, Limda, Waghodia, Vadodara, Gujarat 391760",
  phone: "+916206698170",
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

export { 
    HeartIcon, UserGroupIcon, BeakerIcon, ClipboardDocumentListIcon, ChatBubbleLeftEllipsisIcon, 
    MapPinIconSolid, CheckCircleIcon, CalendarDaysIcon, ArrowRightOnRectangleIcon, UserCircleIcon,
    Cog6ToothIcon, DocumentTextIcon, HomeIconSolid, ListBulletIcon, ChatBubbleLeftRightIcon
};
export { MapPinIcon, PhoneIcon, EnvelopeIcon, BuildingOffice2Icon, QuestionMarkCircleIcon };
