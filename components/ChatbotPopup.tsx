import React, { useEffect, useRef, useState, useCallback } from 'react';
import Modal from './Modal';
import { ChatMessage, InitialFormData, Appointment, ChatOption, TriageReportData } from '../types';
import { PaperAirplaneIcon } from './icons/SolidIcons';
import { APP_NAME, APPOINTMENT_FEE, MOCKED_PATIENT_PASSWORD } from '../constants.ts';
import { saveAppointment } from '../services/localStorageService';
import { loadRazorpayScript, initiateRazorpayPayment } from '../services/razorpayService';
import CalendarPicker from './CalendarPicker';
import TriageReportCard from './TriageReportCard';

interface ChatbotPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InitialFormData;
  onAppointmentBooked: (appointment: Appointment) => void;
}

enum ConversationState {
  GREETING,
  TRIAGING,
  AWAITING_BOOKING_CONFIRMATION,
  SHOWING_CALENDAR,
  COLLECTING_NAME,
  COLLECTING_EMAIL,
  COLLECTING_PHONE,
  CONFIRMING_DETAILS,
  PAYMENT_PENDING,
  BOOKING_COMPLETE,
}

const API_URL = 'http://127.0.0.1:8000/nlp/';

const isAffirmative = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return ['yes', 'y', 'sure', 'ok', 'alright', 'book', 'please', 'correct', 'looks good'].some(w => lowerText.includes(w));
}

const ChatbotPopup: React.FC<ChatbotPopupProps> = ({ isOpen, onClose, initialData, onAppointmentBooked }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversationState, setConversationState] = useState<ConversationState>(ConversationState.GREETING);
  const [bookingDetails, setBookingDetails] = useState<Partial<InitialFormData & { bookingDate: string }>>({});
  const lastSymptomRef = useRef<string | null>(null);

  const addMessageToChat = (text: string, sender: 'user' | 'bot' | 'system', options?: ChatOption[], triageReport?: TriageReportData) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      text,
      sender,
      timestamp: Date.now(),
      options,
      triageReport,
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isBotTyping]);
  
  const handleTriage = async (symptomText: string) => {
    setIsBotTyping(true);
    
    const trimmedSymptom = symptomText.trim();
    if (trimmedSymptom.length < 3) {
        addMessageToChat("Please provide a more detailed description of your symptoms.", 'bot');
        setIsBotTyping(false);
        setConversationState(ConversationState.TRIAGING);
        return;
    }
    
    // This message was repetitive with the greeting and has been removed. The typing indicator is sufficient.
    // addMessageToChat(`Analyzing symptom: "${trimmedSymptom}"...`, 'system');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input_string: trimmedSymptom,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API error ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        const { severity, predicteddisease, confidencescore, consultdoctor } = data;

        if (!predicteddisease) {
            throw new Error("API returned an invalid prediction.");
        }
        
        lastSymptomRef.current = symptomText;

        const triageData: TriageReportData = {
          severity: severity || "Unknown",
          predictedCondition: predicteddisease,
          confidenceScore: confidencescore,
          recommendedSpecialist: consultdoctor
        };

        addMessageToChat(
            `Based on the analysis, would you like to book an appointment with a ${consultdoctor}?`, 
            'bot',
            [
                { text: 'Yes, book now', payload: 'yes' },
                { text: 'No, thanks', payload: 'no' }
            ],
            triageData
        );
        setConversationState(ConversationState.AWAITING_BOOKING_CONFIRMATION);

    } catch (error) {
        console.error("Error fetching disease prediction:", error);
        lastSymptomRef.current = 'General Consultation';
        addMessageToChat("I'm sorry, I encountered an error while analyzing your symptoms. This could be a connection issue or the symptoms might not be in our database. Please try rephrasing, or I can help you book a general consultation. Would you like to proceed?", 'bot', [
                { text: 'Yes, book a consultation', payload: 'yes' },
                { text: 'No, I\'ll try again later', payload: 'no' }
            ]);
        setConversationState(ConversationState.AWAITING_BOOKING_CONFIRMATION);
    } finally {
        setIsBotTyping(false);
    }
  };

  const resetChat = useCallback(async () => {
    setMessages([]);
    setUserInput('');
    setIsBotTyping(false);
    setIsLoading(false);
    setBookingDetails(initialData || {});
    lastSymptomRef.current = initialData?.symptom || null;

    let welcomeMessage: string;
    const hasInitialSymptom = initialData?.symptom && initialData.symptom.trim().length > 0;

    if (initialData?.name && hasInitialSymptom) {
        welcomeMessage = `Hello ${initialData.name}! I'm your ${APP_NAME} assistant. I see you're experiencing: "${initialData.symptom}". Let me analyze that for you.`;
    } else if (hasInitialSymptom) {
        welcomeMessage = `Hello! I'm your ${APP_NAME} assistant. One moment while I analyze the symptom you provided: "${initialData.symptom}".`;
    } else {
        welcomeMessage = "Hello! I'm your AI assistant. Please describe your symptoms in a sentence. For example, 'I have a bad cough and a slight fever'.";
    }

    addMessageToChat(welcomeMessage, 'bot');

    if (hasInitialSymptom) {
        setConversationState(ConversationState.TRIAGING);
        // Wait for the welcome message to be visible before starting analysis
        setTimeout(() => handleTriage(initialData.symptom!), 500);
    } else {
        setConversationState(ConversationState.TRIAGING);
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      resetChat();
    }
  }, [isOpen, resetChat]);


  const askForNextDetail = (currentDetails: Partial<InitialFormData & { bookingDate: string }>) => {
    if (!currentDetails.name) {
        addMessageToChat("To start, what is your full name?", 'bot');
        setConversationState(ConversationState.COLLECTING_NAME);
    } else if (!currentDetails.email) {
        addMessageToChat(`Thank you, ${currentDetails.name}. What is your email address?`, 'bot');
        setConversationState(ConversationState.COLLECTING_EMAIL);
    } else if (!currentDetails.phone) {
        addMessageToChat("Great. And finally, what is your phone number?", 'bot');
        setConversationState(ConversationState.COLLECTING_PHONE);
    } else {
        const readableDate = currentDetails.bookingDate ? new Date(currentDetails.bookingDate).toLocaleString() : 'Not set';
        addMessageToChat(
            `Please confirm your details:\n- Name: ${currentDetails.name}\n- Email: ${currentDetails.email}\n- Phone: ${currentDetails.phone}\n- Reason: ${currentDetails.symptom}\n- Time: ${readableDate}\n\nIs this information correct?`,
            'bot',
            [
                { text: 'Yes, looks good', payload: 'yes' },
                { text: 'No, start over', payload: 'no' }
            ]
        );
        setConversationState(ConversationState.CONFIRMING_DETAILS);
    }
  };

  const handleBookingConfirmation = (lowerCaseText: string) => {
    if (isAffirmative(lowerCaseText)) {
        addMessageToChat("Great! Please select an available date and time for your appointment.", 'bot');
        setConversationState(ConversationState.SHOWING_CALENDAR);
    } else {
        addMessageToChat("No problem. Is there anything else I can help you with? You can describe other symptoms if you like.", 'bot');
        setConversationState(ConversationState.TRIAGING);
    }
  };
  
  const handleDateTimeSelected = (dateTime: Date) => {
    const newDetails = { 
        ...bookingDetails, 
        symptom: lastSymptomRef.current || 'General Consultation', 
        bookingDate: dateTime.toISOString() 
    };
    setBookingDetails(newDetails);
    
    addMessageToChat(`You've selected: ${dateTime.toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`, 'system');
  
    setConversationState(ConversationState.COLLECTING_NAME);
    askForNextDetail(newDetails);
  };

  const processUserInput = async (text: string) => {
    const lowerCaseText = text.toLowerCase();
    
    switch (conversationState) {
        case ConversationState.TRIAGING:
            await handleTriage(text);
            break;
        case ConversationState.AWAITING_BOOKING_CONFIRMATION:
            handleBookingConfirmation(lowerCaseText);
            break;
        case ConversationState.COLLECTING_NAME:
            const name = text.trim();
            if (name && !/^\d+$/.test(name)) {
                const newDetails = { ...bookingDetails, name };
                setBookingDetails(newDetails);
                askForNextDetail(newDetails);
            } else {
                addMessageToChat("That doesn't seem like a valid name. Please enter your full name.", 'bot');
            }
            break;
        case ConversationState.COLLECTING_EMAIL:
            const email = text.trim();
            if (/\S+@\S+\.\S+/.test(email)) {
                const newDetails = { ...bookingDetails, email };
                setBookingDetails(newDetails);
                askForNextDetail(newDetails);
            } else {
                addMessageToChat("Please enter a valid email address.", 'bot');
            }
            break;
        case ConversationState.COLLECTING_PHONE:
            const phone = text.trim();
            if (phone.match(/^[0-9\s+-]{7,15}$/)) {
                const newDetails = { ...bookingDetails, phone };
                setBookingDetails(newDetails);
                askForNextDetail(newDetails);
            } else {
                addMessageToChat("Please enter a valid phone number.", 'bot');
            }
            break;
        case ConversationState.CONFIRMING_DETAILS:
             if (isAffirmative(lowerCaseText)) {
                addMessageToChat(`Great! Proceeding to payment to confirm your appointment.`, 'bot');
                setConversationState(ConversationState.PAYMENT_PENDING);
                handlePayment(bookingDetails as Required<InitialFormData & { bookingDate: string }>);
             } else {
                addMessageToChat("Okay, let's start over completely.", 'bot');
                resetChat();
             }
            break;
        default:
            addMessageToChat("I'm not sure how to handle that right now. Can you describe your symptoms?", 'bot');
            setConversationState(ConversationState.TRIAGING);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || userInput;
    if (!textToSend.trim() || isBotTyping || isLoading) return;

    addMessageToChat(textToSend, 'user');
    setUserInput('');
    
    await processUserInput(textToSend);
  };
  
  const handlePayment = async (details: Required<InitialFormData & { bookingDate: string }>) => {
    setIsLoading(true);
    addMessageToChat("Loading payment gateway...", 'system');

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      addMessageToChat("Failed to load payment gateway. Please try again.", 'system');
      setIsLoading(false);
      setConversationState(ConversationState.CONFIRMING_DETAILS);
      return;
    }

    initiateRazorpayPayment({
      amount: APPOINTMENT_FEE,
      currency: 'INR',
      name: details.name,
      description: `Appointment for ${details.symptom}`,
      email: details.email,
      contact: details.phone,
      onSuccess: (response) => {
        const patientId = `PID-${Date.now()}`;
        const newAppointment: Appointment = {
          id: response.razorpay_payment_id,
          name: details.name,
          email: details.email,
          phone: details.phone,
          symptom: details.symptom,
          bookingDate: details.bookingDate,
          patientId: patientId,
          paymentStatus: 'completed',
        };
        saveAppointment(newAppointment);
        onAppointmentBooked(newAppointment);
        addMessageToChat(
          `Thank you, ${details.name}! Your payment was successful and your appointment is booked.\nYour Patient ID is ${patientId}.\n\nA login has been automatically created for you. You can log in anytime using:\nUsername: ${details.email}\nPassword: "${MOCKED_PATIENT_PASSWORD}"\n\nYou can now close this chat or ask more questions.`,
          'bot'
        );
        setConversationState(ConversationState.BOOKING_COMPLETE);
        setIsLoading(false);
      },
      onFailure: (errorMsg) => {
        addMessageToChat(
          `The payment failed or was cancelled. Reason: ${errorMsg}\n\nDon't worry, your appointment is not booked yet. You can try the payment again or ask me to change the details. What would you like to do?`, 
          'bot'
        );
        setIsLoading(false);
        setConversationState(ConversationState.CONFIRMING_DETAILS);
      },
    });
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.sender === 'user';
    const isSystem = msg.sender === 'system';

    if (isSystem) {
      return (
        <div key={msg.id} className="text-center my-2">
          <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-3 py-1">{msg.text}</span>
        </div>
      );
    }

    return (
      <div key={msg.id} className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
            AI
          </div>
        )}
        <div 
          className={`px-4 py-2.5 rounded-2xl max-w-sm md:max-w-md break-words ${
            isUser 
              ? 'bg-primary text-white rounded-br-lg' 
              : 'bg-white text-dark rounded-bl-lg shadow-sm'
          }`}
        >
            {msg.triageReport && <TriageReportCard data={msg.triageReport} />}
            <p className="whitespace-pre-wrap">{msg.text}</p>
          {msg.options && (
            <div className="mt-3 border-t border-gray-300/50 pt-2 flex flex-wrap gap-2">
              {msg.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(opt.payload)}
                  disabled={isLoading || isBotTyping}
                  className="bg-secondary/20 text-secondary hover:bg-secondary/40 text-sm font-semibold px-3 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderChatInterface = () => (
    <>
      <div className="flex-grow p-4 overflow-y-auto bg-extralight rounded-t-lg">
        {messages.map(renderMessage)}
        {isBotTyping && (
           <div className="flex items-end gap-2 my-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              AI
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white text-dark rounded-bl-lg shadow-sm">
               <div className="flex items-center justify-center space-x-1 p-2">
                  <span className="sr-only">Typing...</span>
                  <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={conversationState > ConversationState.AWAITING_BOOKING_CONFIRMATION ? 'Type your answer...' : 'Describe your symptoms...'}
            disabled={isLoading || isBotTyping || conversationState === ConversationState.BOOKING_COMPLETE}
            className="flex-grow w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-75 transition-shadow"
            autoFocus
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isLoading || isBotTyping || conversationState === ConversationState.BOOKING_COMPLETE}
            className="bg-primary text-white p-3 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110"
            aria-label="Send Message"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${APP_NAME} Assistant`} size="lg">
      <div className="flex flex-col h-[70vh]">
        {conversationState === ConversationState.SHOWING_CALENDAR 
          ? <CalendarPicker 
              onDateTimeSelect={handleDateTimeSelected} 
              onClose={() => {
                addMessageToChat("You cancelled the booking process. Is there anything else I can help with?", "bot");
                setConversationState(ConversationState.TRIAGING);
              }}
            /> 
          : renderChatInterface()
        }
      </div>
    </Modal>
  );
};

export default ChatbotPopup;