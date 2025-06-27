

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  symptom: string;
  bookingDate: string;
  patientId: string;
  paymentStatus: 'pending' | 'completed';
}

export enum UserRole {
  NONE = 'NONE',
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN',
}

export interface PageLink {
  name: string;
  path: string;
  requiresAuth?: UserRole; // Which role can see this link
  hideWhenAuth?: UserRole; // Hide if this role is active
  showOnlyWhenAuth?: UserRole; // Show only if this role is active (for dashboard links)
}

export interface SidebarLink extends PageLink {
  icon: React.ElementType; // For SVG icon components
}


export interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode; // For SVG icons
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
}

export interface InitialFormData {
  name: string;
  email: string;
  phone: string;
  symptom: string;
}

export interface RazorpayPaymentSuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

// For Razorpay (mocked)
export interface RazorpayOptions {
  key: string;
  amount: number; // amount in the smallest currency unit
  currency: string;
  name: string;
  description: string;
  image?: string; // URL of a logo
  order_id?: string; // If using Orders API
  handler: (response: RazorpayPaymentSuccessResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: any;
  theme?: {
    color?: string;
  };
  modal?: {
      ondismiss: () => void;
  };
}

export interface ChatOption {
  text: string;
  payload: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: number;
  options?: ChatOption[];
  isStreaming?: boolean;
}

export interface MinorDiseaseInfo {
  keywords: string[];
  response: string;
}

export interface MajorDiseaseInfo {
  keywords: string[];
  response: string;
  offerBooking: boolean;
}