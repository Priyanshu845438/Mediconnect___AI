
import React from 'react';
import { PageLink, UserRole, SidebarLink } from './types';
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
    mission: "Our mission is to ensure that everyone has access to compassionate and top-notch healthcare. We’re all about using technology to make the patient experience better and improve outcomes.",
    vision: "We aim to be a top healthcare provider known for our clinical excellence, innovative practices, and a strong focus on patient-centered care.",
    values: ["Compassion", "Excellence", "Integrity", "Innovation", "Teamwork"],
    story: "Founded in 2025, MediConnect AI emerged from a genuine desire to connect traditional healthcare with the latest technological innovations. We kicked things off as a small clinic fueled by a big dream: to transform healthcare into something more proactive, personalized, and convenient. Our passionate team is dedicated to making sure you receive top-notch care in a warm and welcoming environment. We're always on the lookout for new ways to improve, like incorporating our AI-powered assistant to better meet your needs.\n\n Founded in 2025, MediConnect AI emerged from a genuine desire to connect traditional healthcare with the latest technological innovations. We kicked things off as a small clinic fueled by a big dream: to transform healthcare into something more proactive, personalized, and convenient. Our passionate team is dedicated to making sure you receive top-notch care in a warm and welcoming environment. We're always on the lookout for new ways to improve, like incorporating our AI-powered assistant to better meet your needs.",
    imageUrl: "https://picsum.photos/seed/aboutus/600/400"
  },
  whyChooseUs: [
    { title: "Experienced Professionals", description: "Our team is made up of talented and experienced doctors, nurses, and support staff who are dedicated to providing the best care possible.", icon: React.createElement(UserGroupIcon, { className: "w-8 h-8 text-primary" }) },
    { title: "Advanced Technology", description: "We use the latest medical technology to ensure precise diagnoses and effective treatments.", icon: React.createElement(BeakerIcon, { className: "w-8 h-8 text-primary" }) },
    { title: "Patient-Centric Care", description: "Your health and comfort are our main focus. We offer personalized care that’s designed just for you.", icon: React.createElement(HeartIcon, { className: "w-8 h-8 text-primary" }) },
    { title: "AI-Powered Assistance", description: "Our MediConnect AI assistant is here to help you with your questions and to schedule appointments in a flash.", icon: React.createElement(ChatBubbleLeftEllipsisIcon, { className: "w-8 h-8 text-primary" }) },
  ]
};

export { 
    HeartIcon, UserGroupIcon, BeakerIcon, ClipboardDocumentListIcon, ChatBubbleLeftEllipsisIcon, 
    MapPinIconSolid, CheckCircleIcon, CalendarDaysIcon, ArrowRightOnRectangleIcon, UserCircleIcon,
    Cog6ToothIcon, DocumentTextIcon, HomeIconSolid, ListBulletIcon, ChatBubbleLeftRightIcon
};
export { MapPinIcon, PhoneIcon, EnvelopeIcon, BuildingOffice2Icon, QuestionMarkCircleIcon };
