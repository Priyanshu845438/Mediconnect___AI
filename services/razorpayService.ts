
import { RAZORPAY_KEY_ID, APP_NAME } from '../constants.ts';
import { RazorpayOptions, RazorpayPaymentSuccessResponse } from '../types';

declare global {
  interface Window {
    Razorpay: any; // Define Razorpay on window
  }
}

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
let razorpayScriptLoaded = false; 

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (razorpayScriptLoaded) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => {
      razorpayScriptLoaded = true;
      resolve(true);
    };
    script.onerror = (error) => {
      console.error("Failed to load Razorpay SDK script:", error);
      razorpayScriptLoaded = false;
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

interface PaymentConfig {
  amount: number;
  currency: string;
  name: string;
  description: string;
  email: string;
  contact: string;
  onSuccess: (response: RazorpayPaymentSuccessResponse) => void;
  onFailure: (errorMsg: string) => void;
}

export const initiateRazorpayPayment = (config: PaymentConfig): void => {
  if (RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_ID') { // This specific check is fine to keep as a general placeholder warning.
    console.warn(
      `%c[${APP_NAME} Warning] Razorpay is using a PLACEHOLDER Key ID ('rzp_test_YOUR_KEY_ID'). 
      Please replace this in 'constants.ts' with your actual Razorpay test or live key ID for payments to function correctly.`,
      "color: orange; font-weight: bold;"
    );
  }

  if (!razorpayScriptLoaded) {
    console.error("Razorpay SDK not loaded. Cannot initiate payment.");
    config.onFailure("Payment gateway (Razorpay SDK) is not loaded. Please try again or check console for errors.");
    return;
  }

  const options: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: config.amount,
    currency: config.currency,
    name: `${APP_NAME} Clinic`, // Updated clinic name
    description: config.description,
    image: "https://picsum.photos/seed/logo/128/128", 
    handler: function (response: RazorpayPaymentSuccessResponse) {
      config.onSuccess(response);
    },
    prefill: {
      name: config.name,
      email: config.email,
      contact: config.contact,
    },
    notes: {
      address: `${APP_NAME} Corporate Office`, 
    },
    theme: {
      color: "#0D9488", 
    },
    modal: {
        ondismiss: function() {
            console.log("Razorpay modal.ondismiss event triggered.");
            // This is called when the user closes the payment modal manually OR if Razorpay closes it due to an error.
            config.onFailure("Payment window was dismissed. If this was not intentional (e.g., it closed automatically), please verify your Razorpay key ID in 'constants.ts' is correct for the environment (test/live) and try again. Contact support if issues persist.");
        }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) { 
        console.error("Razorpay payment.failed full response:", response);
        
        const errorPayload = response.error || {};
        let detailedErrorMessage = errorPayload.description || "Payment Failed (Unknown Razorpay Error)";
        
        if (errorPayload.code) {
            detailedErrorMessage += ` (Code: ${errorPayload.code})`;
        }
        if (errorPayload.reason) {
            detailedErrorMessage += ` (Reason: ${errorPayload.reason})`;
        }
        config.onFailure(detailedErrorMessage);
    });

    rzp.open();
  } catch(error) {
    console.error("Error initiating Razorpay checkout:", error);
    config.onFailure(`Could not initiate Razorpay checkout. ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};