import React, { useEffect, useRef, useState, useCallback } from 'react';
import Modal from './Modal';
import { ChatMessage, InitialFormData, Appointment, ChatOption } from '../types';
import { PaperAirplaneIcon, CalendarDaysIcon, MapPinIcon as MapPinIconSolid, ChatBubbleLeftEllipsisIcon as SupportIcon } from './icons/SolidIcons';
import { APP_NAME, APPOINTMENT_FEE, BOT_GREETING_MESSAGE, WHATSAPP_SUPPORT_NUMBER, MOCKED_PATIENT_PASSWORD } from '../constants.ts'; // Added MOCKED_PATIENT_PASSWORD
import { saveAppointment } from '../services/localStorageService';
import { loadRazorpayScript, initiateRazorpayPayment } from '../services/razorpayService';
// import { MINOR_DISEASES_DATA } from '../data/minorDiseases.ts';
// import { MAJOR_DISEASES_DATA } from '../data/majorDiseases.ts';

interface ChatbotPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InitialFormData;
  onAppointmentBooked: (appointment: Appointment) => void;
}

enum ChatState {
  IDLE,
  AWAITING_USER_INPUT,
  AWAITING_PAYMENT_CONFIRMATION,
  APPOINTMENT_BOOKED_SUCCESS,
}

const ChatbotPopup: React.FC<ChatbotPopupProps> = ({ isOpen, onClose, initialData, onAppointmentBooked }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For payment processing
  const [isBotTyping, setIsBotTyping] = useState(false); // For bot "thinking" animation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentChatState, setCurrentChatState] = useState<ChatState>(ChatState.IDLE);
  const [tentativeAppointmentDetails, setTentativeAppointmentDetails] = useState<Partial<InitialFormData> | null>(null);

  const addMessageToChat = (text: string, sender: 'user' | 'bot' | 'system', options?: ChatOption[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      text,
      sender,
      timestamp: Date.now(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
        const checkDiseaseFromAPI = async (symptoms: string[]) => {
      const response = await fetch("http://127.0.0.1:8000/checkdisease/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noofsym: symptoms.length, symptoms }),
      });
      console.log("API Response:", response);
      if (!response.ok) throw new Error("Failed to fetch prediction");

      return response.json();
    };

  useEffect(scrollToBottom, [messages, isBotTyping]);

  const initializeChat = useCallback(async () => {
    let welcomeMessage = BOT_GREETING_MESSAGE;
    let currentDetails: Partial<InitialFormData> = {};

    if (initialData && (initialData.name || initialData.symptom || initialData.email || initialData.phone)) {
      currentDetails = {...initialData};
      setTentativeAppointmentDetails(currentDetails);
      if (initialData.name && initialData.symptom) {
          welcomeMessage = `Hello ${initialData.name}! I understand you're experiencing symptoms like "${initialData.symptom}". How can your ${APP_NAME} assistant help you further with this or other queries?`;
      } else if (initialData.name) {
          welcomeMessage = `Hello ${initialData.name}! How can your ${APP_NAME} assistant assist you today?`;
      } else if (initialData.symptom) {
           welcomeMessage = `Hello there! I understand you're experiencing symptoms like "${initialData.symptom}". How can your ${APP_NAME} assistant assist you further?`;
      }
    } else {
        setTentativeAppointmentDetails(null);
    }
    
    addMessageToChat(welcomeMessage, 'bot');
    setCurrentChatState(ChatState.AWAITING_USER_INPUT);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]); 

  useEffect(() => {
    if (isOpen) {
      setMessages([]); 
      initializeChat();
    } else {
      setCurrentChatState(ChatState.IDLE);
      setTentativeAppointmentDetails(null);
      setIsBotTyping(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); 

    const handleBookingIntent = (symptom?: string) => {
      const details = { ...(tentativeAppointmentDetails || {}), ...(initialData || {}) };

      if (symptom && !details.symptom) {
        details.symptom = symptom;
        setTentativeAppointmentDetails(d => ({ ...d, symptom }));
      }

      const missingFields = [];
      if (!details.name) missingFields.push("name");
      if (!details.email) missingFields.push("email");
      if (!details.phone) missingFields.push("phone");
      if (!details.symptom) missingFields.push("symptom(s)");

      if (missingFields.length > 0) {
        return {
          responseText: `Sure, I can help with that. To book an appointment, I need your ${missingFields.join(", ")}. Please provide these details.`,
          nextState: ChatState.AWAITING_USER_INPUT
        };
      }

      const symptomText = details.symptom ? `for ${details.symptom}` : "for a general consultation";
      return {
        responseText: `Okay, ${details.name}. To confirm your appointment ${symptomText}, a nominal consultation fee of ${APPOINTMENT_FEE / 100} INR is required. Would you like to proceed with the payment?`,
        nextState: ChatState.AWAITING_PAYMENT_CONFIRMATION,
        options: [{
          text: `Pay ${APPOINTMENT_FEE / 10000} INR and Book`,
          action: () => handlePayment()
        }]
      };
    };

const processUserMessage = async (text: string): Promise<{ responseText: string; nextState?: ChatState; options?: ChatOption[] }> => {
  const lowerText = text.toLowerCase();
  const knownSymptoms = ["fever", "cough", "headache", "vomiting", "diarrhea", "chest pain"]; // extend as needed
  const matchedSymptoms = knownSymptoms.filter(symptom => lowerText.includes(symptom.toLowerCase()));

  // Predict disease using API if any symptoms match
  if (matchedSymptoms.length > 0) {
    try {
      setIsBotTyping(true);
      const result = await checkDiseaseFromAPI(matchedSymptoms);
      setIsBotTyping(false);

      const responseText =
        `Based on your symptom, it might be **${result.predicteddisease}**.\n` +
        `Confidence Score: ${result.confidencescore}\n` +
        `Please consult a **${result.consultdoctor}**.\n\n` +
        `Would you like to book an appointment for this condition?`;

      if (!tentativeAppointmentDetails?.symptom) {
        setTentativeAppointmentDetails(prev => ({ ...prev, symptom: result.predicteddisease }));
      }

      return {
        responseText,
        nextState: ChatState.AWAITING_USER_INPUT,
        options: [{
          text: "Yes, book appointment",
          action: () => {
            const bookingResponse = handleBookingIntent(result.predicteddisease);
            addMessageToChat(bookingResponse.responseText, 'bot', bookingResponse.options);
            if (bookingResponse.nextState) setCurrentChatState(bookingResponse.nextState);
          }
        }]
      };
    } catch (err) {
      console.error("API Error:", err);
      setIsBotTyping(false);
      return {
        responseText: "I couldn't process your symptoms at the moment. Please try again shortly.",
        nextState: ChatState.AWAITING_USER_INPUT
      };
    }
  }

  // Fallback to manual MAJOR_DISEASES_DATA
  // for (const disease of MAJOR_DISEASES_DATA) {
  //   if (disease.keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
  //     const matchedKeyword = disease.keywords.find(kw => lowerText.includes(kw.toLowerCase())) || "your stated concern";
  //     const responseText = disease.response.replace("[matched keyword]", matchedKeyword);

  //     if (!tentativeAppointmentDetails?.symptom && initialData?.symptom !== matchedKeyword) {
  //       setTentativeAppointmentDetails(prev => ({ ...prev, symptom: matchedKeyword }));
  //     }

  //     if (disease.offerBooking) {
  //       return {
  //         responseText,
  //         nextState: ChatState.AWAITING_USER_INPUT,
  //         options: [{
  //           text: "Yes, help me book an appointment",
  //           action: () => {
  //             const bookingResponse = handleBookingIntent(matchedKeyword);
  //             addMessageToChat(bookingResponse.responseText, 'bot', bookingResponse.options);
  //             if (bookingResponse.nextState) setCurrentChatState(bookingResponse.nextState);
  //           }
  //         }]
  //       };
  //     }

  //     return { responseText, nextState: ChatState.AWAITING_USER_INPUT };
  //   }
  // }

  // // 🔁 MINOR diseases
  // for (const disease of MINOR_DISEASES_DATA) {
  //   if (disease.keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
  //     const matchedKeyword = disease.keywords.find(kw => lowerText.includes(kw.toLowerCase()));
  //     if (matchedKeyword && !tentativeAppointmentDetails?.symptom && !initialData?.symptom) {
  //       setTentativeAppointmentDetails(prev => ({ ...prev, symptom: matchedKeyword }));
  //     }
  //     return { responseText: disease.response, nextState: ChatState.AWAITING_USER_INPUT };
  //   }
  // }

  const details = { ...(tentativeAppointmentDetails || {}), ...(initialData || {}) };

  if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
    return { responseText: "Hello there! How can I help you today?", nextState: ChatState.AWAITING_USER_INPUT };
  }

  if (lowerText.includes("book appointment") || lowerText.includes("schedule visit") || lowerText.includes("make an appointment")) {
    return handleBookingIntent();
  }

  let detailProvided = false;
  if (!details.name && (lowerText.includes("my name is") || (lowerText.split(" ").length < 5 && messages.length > 1 && messages[messages.length - 1].text.toLowerCase().includes("name")))) {
    const nameGuess = lowerText.replace("my name is", "").trim();
    setTentativeAppointmentDetails(prev => ({ ...prev, name: nameGuess }));
    detailProvided = true;
  }
  if (!details.email && (lowerText.includes("my email is") || lowerText.includes("@"))) {
    setTentativeAppointmentDetails(prev => ({ ...prev, email: text.trim() }));
    detailProvided = true;
  }
  if (!details.phone && (lowerText.includes("my phone is") || lowerText.match(/\d{10}/))) {
    setTentativeAppointmentDetails(prev => ({ ...prev, phone: text.trim() }));
    detailProvided = true;
  }
  if (!details.symptom && (lowerText.includes("my symptom is") || lowerText.includes("experiencing"))) {
    setTentativeAppointmentDetails(prev => ({ ...prev, symptom: text.replace("my symptom is", "").replace("experiencing", "").trim() }));
    detailProvided = true;
  }

  if (detailProvided) {
    return {
      responseText: "Thanks for the information. If all details are provided (Name, Email, Phone, Symptom), you can now say 'book appointment' or use the button to proceed.",
      nextState: ChatState.AWAITING_USER_INPUT
    };
  }

  if (lowerText.includes("nearby hospital") || lowerText.includes("hospital near me") || lowerText.includes("hospitals")) {
    const hospitalList = MOCK_NEARBY_HOSPITALS.map(h => `- ${h.name} (${h.address})`).join('\n');
    return {
      responseText: `Here are some hospitals in the general area:\n${hospitalList}\n\nFor exact locations, please use map services.`,
      nextState: ChatState.AWAITING_USER_INPUT
    };
  }

  if (currentChatState === ChatState.AWAITING_PAYMENT_CONFIRMATION) {
    if (lowerText.includes("yes") || lowerText.includes("proceed") || lowerText.includes("ok") || lowerText.includes("pay")) {
      handlePayment();
      return { responseText: "Great! Proceeding to payment..." };
    } else if (lowerText.includes("no") || lowerText.includes("cancel")) {
      return {
        responseText: "Okay, let me know if you change your mind or need help with anything else.",
        nextState: ChatState.AWAITING_USER_INPUT
      };
    }
  }

  return {
    responseText: "I'm here to help with your health concerns or appointment bookings. You can also say 'book appointment' or mention a symptom like 'fever'.",
    nextState: ChatState.AWAITING_USER_INPUT
  };
};

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || userInput;
    if (!textToSend.trim()) return;

    addMessageToChat(textToSend, 'user');
    setUserInput('');
    setIsBotTyping(true);
    
    setTimeout(async () => {
      setIsBotTyping(false);
      const botLogicResponse = await processUserMessage(textToSend);
      addMessageToChat(botLogicResponse.responseText, 'bot', botLogicResponse.options);
      
      if (botLogicResponse.nextState) {
        setCurrentChatState(botLogicResponse.nextState);
      } else {
        setCurrentChatState(ChatState.AWAITING_USER_INPUT);
      }
    }, 700 + Math.random() * 600);
  };
  
  const handlePayment = async () => {
    const finalDetails: Partial<InitialFormData> = { 
      ...(initialData || {}), 
      ...(tentativeAppointmentDetails || {}) 
    };
    
    if (!finalDetails?.name || !finalDetails?.email || !finalDetails?.phone || !finalDetails?.symptom) {
       addMessageToChat(
           "To book an appointment, I need your Name, Email, Phone, and a brief description of your Symptoms. Could you please provide the missing details?",
           'bot'
        );
       setCurrentChatState(ChatState.AWAITING_USER_INPUT);
       return;
    }

    setIsLoading(true); 
    addMessageToChat("Loading payment gateway...", 'system');

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      addMessageToChat("Failed to load payment gateway. Please try again.", 'system');
      setIsLoading(false);
      setCurrentChatState(ChatState.AWAITING_PAYMENT_CONFIRMATION); 
      return;
    }

    initiateRazorpayPayment({
      amount: APPOINTMENT_FEE,
      currency: 'INR',
      name: finalDetails.name!,
      description: `Appointment for ${finalDetails.symptom!}`,
      email: finalDetails.email!,
      contact: finalDetails.phone!,
      onSuccess: (response) => {
        const patientId = `PID-${Date.now()}`;
        const newAppointment: Appointment = {
          id: response.razorpay_payment_id,
          name: finalDetails.name!,
          email: finalDetails.email!,
          phone: finalDetails.phone!,
          symptom: finalDetails.symptom!,
          bookingDate: new Date().toISOString(),
          patientId: patientId,
          paymentStatus: 'completed',
        };
        saveAppointment(newAppointment);
        onAppointmentBooked(newAppointment);
        addMessageToChat(
          `Thank you, ${finalDetails.name}! Your payment was successful and your appointment is booked.\nYour Patient ID is ${patientId}.\n\nA login has been automatically created for you. You can log in anytime using:\nUsername: ${finalDetails.email}\nPassword: "${MOCKED_PATIENT_PASSWORD}"\n\nYou are now logged in and will be redirected to your dashboard shortly.`, 
          'bot'
        );
        setCurrentChatState(ChatState.APPOINTMENT_BOOKED_SUCCESS);
        setIsLoading(false);
        setTimeout(onClose, 100);
      },
      onFailure: (errorMsg) => {
        addMessageToChat(`Payment failed: ${errorMsg}. Please try again or contact support.`, 'bot');
        setCurrentChatState(ChatState.AWAITING_PAYMENT_CONFIRMATION); 
        setIsLoading(false);
      }
    });
  };


  const handleOptionClick = (option: ChatOption) => {
    setMessages(prevMessages => prevMessages.map(msg => {
      if (msg.options?.some(o => o.text === option.text && o.action === option.action)) {
        return { ...msg, options: undefined };
      }
      return msg;
    }));
    option.action();
  };

  const handleBookAppointmentClick = () => {
    addMessageToChat("Book Appointment", 'user');
    setIsBotTyping(true);
    setTimeout(() => {
        setIsBotTyping(false);
        const bookingResponse = handleBookingIntent(tentativeAppointmentDetails?.symptom);
        addMessageToChat(bookingResponse.responseText, 'bot', bookingResponse.options);
        if(bookingResponse.nextState) setCurrentChatState(bookingResponse.nextState);
    }, 400 + Math.random() * 300);
  };

  const handleNearbyHospitalsClick = () => {
    addMessageToChat("Okay, opening Google Maps for nearby hospitals.", 'user');
    setIsBotTyping(true);
    setTimeout(() => {
        setIsBotTyping(false);
        addMessageToChat("Opening Google Maps to find nearby hospitals...", 'system');
        window.open('https://www.google.com/maps/search/?api=1&query=hospitals+near+me', '_blank');
    }, 400 + Math.random() * 300);
  };

  const handleContactSupportClick = () => {
    addMessageToChat("I'd like to contact support.", 'user');
    setIsBotTyping(true);
    setTimeout(() => {
        setIsBotTyping(false);
        addMessageToChat("Connecting you to support via WhatsApp...", 'system');
        const whatsappMessage = encodeURIComponent(`Hello ${APP_NAME} Support, I need assistance.`);
        window.open(`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${whatsappMessage}`, '_blank');
    }, 400 + Math.random() * 300);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${APP_NAME} Assistance`} size="lg">
      <div className="flex flex-col h-[70vh]">
        <div className="flex-grow overflow-y-auto p-4 space-y-2.5 bg-slate-100 rounded-md">
          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
            {msg.sender === 'system' ? (
                <div className="w-full my-2 clear-both">
                    <p className="text-xs text-gray-600 italic text-center bg-gray-200 py-1.5 px-3 rounded-full mx-auto max-w-max shadow-sm">
                        {msg.text}
                    </p>
                </div>
            ) : (
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 shadow 
                    ${msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-t-xl rounded-bl-xl' 
                        : 'bg-white text-gray-800 rounded-t-xl rounded-br-xl'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {msg.options.map((opt, index) => (
                          <button
                            key={`${msg.id}-opt-${index}`}
                            onClick={() => handleOptionClick(opt)}
                            disabled={isLoading || isBotTyping} 
                            className="w-full text-left bg-teal-50 hover:bg-teal-100 text-primary px-3.5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed border border-teal-200 hover:border-teal-300"
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs mt-1.5 opacity-80 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
            )}
            </React.Fragment>
          ))}

          {isBotTyping && (
            <div className="flex justify-start">
              <div className="max-w-[60%] p-3 rounded-t-xl rounded-br-xl shadow bg-white text-gray-800">
                <div className="flex items-center space-x-1.5 h-5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          {isLoading && currentChatState !== ChatState.APPOINTMENT_BOOKED_SUCCESS && (
            <div className="flex justify-center py-2">
                <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-sm text-primary ml-1">Processing payment...</span>
                </div>
            </div>
           )}
          <div ref={messagesEndRef} />
        </div>

        {currentChatState !== ChatState.APPOINTMENT_BOOKED_SUCCESS && (
          <div className="p-4 border-t border-gray-200 bg-slate-50">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3.5">
              <button
                onClick={handleBookAppointmentClick}
                disabled={isLoading || isBotTyping}
                className="flex items-center justify-center text-sm font-medium bg-primary hover:bg-teal-700 text-white py-2.5 px-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed group"
              >
                <CalendarDaysIcon className="w-5 h-5 mr-2 transition-colors" />
                Book Appointment
              </button>
              <button
                onClick={handleNearbyHospitalsClick}
                disabled={isLoading || isBotTyping}
                className="flex items-center justify-center text-sm font-medium bg-secondary hover:bg-sky-600 text-white py-2.5 px-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed group"
              >
                <MapPinIconSolid className="w-5 h-5 mr-2 transition-colors" />
                Nearby Hospitals
              </button>
              <button
                onClick={handleContactSupportClick}
                disabled={isLoading || isBotTyping}
                className="flex items-center justify-center text-sm font-medium bg-accent hover:bg-pink-600 text-white py-2.5 px-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed group"
              >
                <SupportIcon className="w-5 h-5 mr-2 transition-colors" />
                Contact Support
              </button>
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  isBotTyping ? `${APP_NAME} is typing...` :
                  currentChatState === ChatState.AWAITING_PAYMENT_CONFIRMATION && messages[messages.length-1]?.options?.length > 0
                  ? "Please choose an option or type 'cancel'"
                  : "Type your message..."
                }
                className="flex-grow p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow disabled:bg-gray-100"
                disabled={isLoading || isBotTyping || (currentChatState === ChatState.AWAITING_PAYMENT_CONFIRMATION && messages[messages.length-1]?.options?.length > 0 && !(userInput.toLowerCase().includes("cancel") || userInput.toLowerCase().includes("no")))}
              />
              <button
                type="submit"
                disabled={isLoading || isBotTyping || !userInput.trim() || (currentChatState === ChatState.AWAITING_PAYMENT_CONFIRMATION && messages[messages.length-1]?.options?.length > 0 && !(userInput.toLowerCase().includes("cancel") || userInput.toLowerCase().includes("no")))}
                className="bg-primary text-white p-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChatbotPopup;
