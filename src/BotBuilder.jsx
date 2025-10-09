import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChevronDown, ChevronUp, Calendar, MessageCircle, Phone, Stethoscope, FileText, Settings, User, Mail, Globe, Palette, Eye, Code } from 'lucide-react';

const BotBuilder = () => {
  const [botName, setBotName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('upload');
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const [openingMessages, setOpeningMessages] = useState([
    { id: uuidv4(), text: 'Welcome to [Company Name]', showAvatar: true },
    { id: uuidv4(), text: 'Hope you are having a great day, how can I help you?', showAvatar: true },
    { id: uuidv4(), text: 'Would you like to get booked in with one of our dentists?', showAvatar: true }
  ]);
  const [appointmentOptions] = useState([
    { id: uuidv4(), text: 'Request an appointment', type: 'appointment' },
    { id: uuidv4(), text: 'Learn about treatments', type: 'treatment' },
    { id: uuidv4(), text: 'Request a callback', type: 'callback' }
  ]);
  const [appointmentGreeting, setAppointmentGreeting] = useState('Hello! 👋 I can help you book an appointment at our clinic.\nWhat\'s your full name?');
  // Confirmation messages (standardized - not configurable)
  const confirmationMessages = {
    success: '✅ I\'ve reserved your appointment for [chosen date/time].\nYou\'ll receive a confirmation email shortly.\nWould you also like directions to our clinic?',
    unavailable: '❌ That time isn\'t available.\nThe next slots are: [options]. Which one works for you?'
  };
  
  // Treatment Enquiry workflow states
  const treatmentGreeting = 'Hi! I\'m here to answer questions about our dental treatments. What treatment are you interested in learning more about?';
  const [treatmentOptions, setTreatmentOptions] = useState([
    { id: uuidv4(), name: 'Teeth Whitening', description: 'Professional teeth whitening treatments for a brighter smile', brochureUrl: '' },
    { id: uuidv4(), name: 'Invisalign', description: 'Clear aligners for straightening teeth discreetly', brochureUrl: '' },
    { id: uuidv4(), name: 'Dental Implants', description: 'Permanent tooth replacement solutions', brochureUrl: '' },
    { id: uuidv4(), name: 'General Checkup', description: 'Comprehensive dental examination and cleaning', brochureUrl: '' }
  ]);
  const treatmentFollowUp = 'Would you like me to send you a detailed brochure via email or help you schedule a free consultation with our dentist?';
  
  // Callback Request workflow states (standardized - not configurable)
  const callbackGreeting = 'You\'d like a callback from our team—happy to arrange that! Could you please provide your name and the best phone number to reach you?';
  const callbackFollowUp = 'Thank you! Is there a specific reason you\'d like us to call or a particular question you have?';
  const callbackTiming = 'What time works best for your callback? (e.g., morning, afternoon, or a specific time)';
  const callbackConfirmation = 'We\'ve scheduled your callback for [chosen time]. One of our team members will be in touch. Thank you for reaching out!';
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState('');
  const [companyOwnerEmail, setCompanyOwnerEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [themeColor, setThemeColor] = useState('#3B82F6'); // Default blue
  const [generatedScript, setGeneratedScript] = useState('');
  const [botId, setBotId] = useState('');
  const [activeTab, setActiveTab] = useState('builder');
  const [botPosition, setBotPosition] = useState('right');
  const [sideSpacing, setSideSpacing] = useState(25);
  const [bottomSpacing, setBottomSpacing] = useState(25);
  const [showDesktop, setShowDesktop] = useState(true);
  const [showMobile, setShowMobile] = useState(true);
  
  // Google Calendar integration states
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Test mode states
  const [testMode, setTestMode] = useState(false);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentFormField, setCurrentFormField] = useState(0);
  const [showForm, setShowForm] = useState(false);
  
  // New workflow states
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showTreatmentOptions, setShowTreatmentOptions] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackData, setCallbackData] = useState({});
  const [currentCallbackField, setCurrentCallbackField] = useState(0);
  const [showCallbackInput, setShowCallbackInput] = useState(false);
  const [callbackInput, setCallbackInput] = useState('');
  
  // Treatment chat states
  const [showTreatmentChat, setShowTreatmentChat] = useState(false);
  const [treatmentChatInput, setTreatmentChatInput] = useState('');
  const [treatmentChatMessages, setTreatmentChatMessages] = useState([]);
  const [treatmentUserEmail, setTreatmentUserEmail] = useState('');
  const [selectedTreatmentOption, setSelectedTreatmentOption] = useState(null);
  
  // State cleanup function to prevent UI conflicts
  const resetUIStates = () => {
    setShowOptions(false);
    setShowForm(false);
    setShowCallbackForm(false);
    setShowCallbackInput(false);
    setShowTreatmentOptions(false);
    setShowTreatmentChat(false);
    setCurrentFormField(-1);
    setCurrentCallbackField(-1);
  };
  
  // Accordion states
  const [accordionStates, setAccordionStates] = useState({
    basicSettings: true,
    appointmentFlow: false,
    treatmentFlow: false,
    googleCalendar: false,
    displaySettings: false
  });

  // Avatar upload handler
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedAvatar(e.target.result);
        setSelectedAvatar('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Get current avatar URL
  const getCurrentAvatar = () => {
    if (selectedAvatar === 'upload' && uploadedAvatar) {
      return uploadedAvatar;
    }
    return avatars.find(a => a.id === selectedAvatar)?.avatar || avatars[0].avatar;
  };

  // Preset avatars with real people images
  const avatars = [
    { id: 'upload', name: 'Upload', avatar: uploadedAvatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDI4QzE2LjY4NjMgMjggMTQgMjUuMzEzNyAxNCAyMkMxNCAxOC42ODYzIDE2LjY4NjMgMTYgMjAgMTZDMjMuMzEzNyAxNiAyNiAxOC42ODYzIDI2IDIyQzI2IDI1LjMxMzcgMjMuMzEzNyAyOCAyMCAyOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2IDEySDI0VjE0SDE2VjEyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K' },
    { id: 'michael', name: 'Michael', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80' },
    { id: 'emma', name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80' },
    { id: 'david', name: 'David', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80' },
    { id: 'lisa', name: 'Lisa', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format&q=80' },
    { id: 'james', name: 'James', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80' },
  ];

  const addOpeningMessage = () => {
    setOpeningMessages([...openingMessages, { id: uuidv4(), text: '', showAvatar: true }]);
  };

  const removeOpeningMessage = (id) => {
    if (openingMessages.length > 1) {
      setOpeningMessages(openingMessages.filter(message => message.id !== id));
    }
  };

  const updateOpeningMessage = (id, field, value) => {
    setOpeningMessages(openingMessages.map(message => 
      message.id === id ? { ...message, [field]: value } : message
    ));
  };


  // Treatment workflow functions
  const addTreatmentOption = () => {
    setTreatmentOptions([...treatmentOptions, { id: uuidv4(), name: '', description: '' }]);
  };

  const removeTreatmentOption = (id) => {
    if (treatmentOptions.length > 1) {
      setTreatmentOptions(treatmentOptions.filter(option => option.id !== id));
    }
  };

  const updateTreatmentOption = (id, field, value) => {
    setTreatmentOptions(treatmentOptions.map(option => 
      option.id === id ? { ...option, [field]: value } : option
    ));
  };

  // Accordion toggle function
  const toggleAccordion = (section) => {
    setAccordionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Google Calendar integration functions
  const checkCalendarStatus = async () => {
    if (!botId) {
      console.log('No botId available for calendar status check');
      return;
    }
    
    try {
      console.log('Checking calendar status for botId:', botId);
      const response = await fetch(`https://https://widget.flipthatpdf.site/api/calendar/status/${botId}`);
      const status = await response.json();
      console.log('Calendar status response:', status);
      setCalendarStatus(status);
      setGoogleCalendarConnected(status.connected);
    } catch (error) {
      console.error('Error checking calendar status:', error);
    }
  };

  const connectGoogleCalendar = async () => {
    if (!botId) {
      alert('Please save your bot configuration first to get a Bot ID');
      return;
    }
    
    console.log('Starting Google Calendar connection for botId:', botId);
    setIsConnecting(true);
    
    try {
      console.log('Attempting to connect Google Calendar for botId:', botId);
      const response = await fetch(`https://https://widget.flipthatpdf.site/oauth2/authorize/${botId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('OAuth URL received:', data.authUrl);
      
      // Open Google OAuth in a popup window
      const popup = window.open(
        data.authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      // Check if popup was blocked
      if (!popup) {
        alert('Popup blocked! Please allow popups for this site and try again.');
        setIsConnecting(false);
        return;
      }
      
      // Listen for the popup to close or receive a message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check status after popup closes (fallback if message didn't work)
          setTimeout(() => {
            console.log('Popup closed, checking calendar status as fallback');
            checkCalendarStatus();
          }, 1000);
        }
      }, 1000);

      // Also listen for messages from the popup
      const messageHandler = (event) => {
        // Allow messages from the server origin (OAuth callback)
        const allowedOrigins = [
          window.location.origin,
          'http://213.165.249.205:3001',
          'https://213.165.249.205:3001'
        ];
        
        if (!allowedOrigins.includes(event.origin)) {
          console.log('Rejected message from origin:', event.origin);
          return;
        }
        
        console.log('Received OAuth message:', event.data);
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          clearInterval(checkClosed);
          setIsConnecting(false);
          setGoogleCalendarConnected(true);
          checkCalendarStatus();
          popup.close();
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          clearInterval(checkClosed);
          setIsConnecting(false);
          alert('Failed to connect Google Calendar: ' + event.data.error);
          popup.close();
        }
      };

      window.addEventListener('message', messageHandler);
      
      // Clean up event listener when popup closes
      const originalCheckClosed = checkClosed;
      const checkClosedWithCleanup = setInterval(() => {
        if (popup.closed) {
          clearInterval(originalCheckClosed);
          clearInterval(checkClosedWithCleanup);
          window.removeEventListener('message', messageHandler);
          setIsConnecting(false);
          setTimeout(checkCalendarStatus, 1000);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      alert(`Failed to connect to Google Calendar: ${error.message}. Please check if the server is running on https://https://widget.flipthatpdf.site`);
      setIsConnecting(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    if (!botId) return;
    
    if (window.confirm('Are you sure you want to disconnect Google Calendar? This will stop automatic appointment creation.')) {
      try {
        const response = await fetch(`https://https://widget.flipthatpdf.site/api/calendar/disconnect/${botId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setGoogleCalendarConnected(false);
          setCalendarStatus(null);
          alert('Google Calendar disconnected successfully!');
        } else {
          const error = await response.json();
          alert('Failed to disconnect: ' + (error.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error disconnecting Google Calendar:', error);
        alert('Failed to disconnect Google Calendar. Please try again.');
      }
    }
  };

  // Check calendar status when botId changes
  React.useEffect(() => {
    if (botId) {
      checkCalendarStatus();
    }
  }, [botId]);


  const saveBot = () => {
    // Only generate a new botId if one doesn't exist
    const newBotId = botId || uuidv4();
    if (!botId) {
      setBotId(newBotId);
    }
    
    const position = botPosition === 'right' ? 'right' : 'left';
    const sidePosition = position === 'right' ? `right:${sideSpacing}px` : `left:${sideSpacing}px`;
    
    // Bot configuration
    const botConfig = {
      botId: newBotId,
      name: botName || 'Bot',
      companyName: companyName || 'Your Company',
      avatar: getCurrentAvatar(),
      openingMessages: openingMessages.map(msg => ({
        ...msg,
        text: msg.text.replace('[Company Name]', companyName || 'Your Company')
      })),
      appointmentGreeting: appointmentGreeting,
      privacyPolicyUrl: privacyPolicyUrl,
      companyOwnerEmail: companyOwnerEmail,
      companyPhone: companyPhone,
      companyWebsite: companyWebsite,
      webhookUrl: 'https://n8n.flipthatpdf.site/webhook/appointment-booking', // n8n webhook for Google Calendar integration
      gmailBrochureUrl: 'https://n8n.flipthatpdf.site/webhook/gmail-brochure', // n8n webhook for Gmail brochure requests
      gmailCallbackUrl: 'https://n8n.flipthatpdf.site/webhook/gmail-callback', // n8n webhook for Gmail callback requests
      themeColor: themeColor,
      position: position,
      sideSpacing: sideSpacing,
      bottomSpacing: bottomSpacing,
      showDesktop: showDesktop,
      showMobile: showMobile,
      appointmentFlow: {
        fields: [
          { name: 'fullName', type: 'text', label: 'Full Name', required: true },
          { name: 'contact', type: 'email', label: 'Email Address', required: true },
          { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
          { name: 'preferredDate', type: 'date', label: 'Preferred Date', required: true },
          { name: 'preferredTime', type: 'time', label: 'Preferred Time', required: true }
        ]
      },
      treatmentFlow: {
        options: treatmentOptions.filter(opt => opt.name.trim()),
        webhookUrl: 'https://n8n.flipthatpdf.site/webhook/gmail-brochure' // n8n webhook for Gmail brochure requests
      },
      callbackFlow: {
        fields: [
          { name: 'name', type: 'text', label: 'Full Name', required: true },
          { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
          { name: 'reason', type: 'text', label: 'Reason for Callback', required: true },
          { name: 'timing', type: 'text', label: 'Preferred Time', required: true }
        ]
      }
    };
    
    const script = `<script>
  window.flossyConfig = ${JSON.stringify(botConfig)};
  (function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(d.getElementById(id))return;
    js=d.createElement(s);js.id=id;
    js.src="https://widget.flipthatpdf.site/widget.js";
    fjs.parentNode.insertBefore(js,fjs);
  }(document,"script","flossy-widget"));
</script>`;
    
    setGeneratedScript(script);
  };

  const generateFreshCode = () => {
    // Always generate a new botId for fresh code
    const newBotId = uuidv4();
    setBotId(newBotId);
    
    const position = botPosition === 'right' ? 'right' : 'left';
    const sidePosition = position === 'right' ? `right:${sideSpacing}px` : `left:${sideSpacing}px`;
    
    // Bot configuration
    const botConfig = {
      botId: newBotId,
      name: botName || 'Bot',
      companyName: companyName || 'Your Company',
      avatar: getCurrentAvatar(),
      openingMessages: openingMessages.map(msg => ({
        ...msg,
        text: msg.text.replace('[Company Name]', companyName || 'Your Company')
      })),
      appointmentGreeting: appointmentGreeting,
      privacyPolicyUrl: privacyPolicyUrl,
      companyOwnerEmail: companyOwnerEmail,
      companyPhone: companyPhone,
      companyWebsite: companyWebsite,
      webhookUrl: 'https://n8n.flipthatpdf.site/webhook/appointment-booking', // n8n webhook for Google Calendar integration
      gmailBrochureUrl: 'https://n8n.flipthatpdf.site/webhook/gmail-brochure', // n8n webhook for Gmail brochure requests
      gmailCallbackUrl: 'https://n8n.flipthatpdf.site/webhook/gmail-callback', // n8n webhook for Gmail callback requests
      themeColor: themeColor,
      position: position,
      sideSpacing: sideSpacing,
      bottomSpacing: bottomSpacing,
      showDesktop: showDesktop,
      showMobile: showMobile,
      appointmentFlow: {
        fields: [
          { name: 'fullName', type: 'text', label: 'Full Name', required: true },
          { name: 'contact', type: 'email', label: 'Email Address', required: true },
          { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
          { name: 'preferredDate', type: 'date', label: 'Preferred Date', required: true },
          { name: 'preferredTime', type: 'time', label: 'Preferred Time', required: true }
        ]
      },
      treatmentFlow: {
        options: treatmentOptions.filter(opt => opt.name.trim()),
        webhookUrl: 'https://n8n.flipthatpdf.site/webhook/gmail-brochure' // n8n webhook for Gmail brochure requests
      },
      callbackFlow: {
        fields: [
          { name: 'name', type: 'text', label: 'Full Name', required: true },
          { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
          { name: 'reason', type: 'text', label: 'Reason for Callback', required: true },
          { name: 'timing', type: 'text', label: 'Preferred Time', required: true }
        ]
      }
    };
    
    const script = `<script>
  window.flossyConfig = ${JSON.stringify(botConfig)};
  (function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(d.getElementById(id))return;
    js=d.createElement(s);js.id=id;
    js.src="https://widget.flipthatpdf.site/widget.js";
    fjs.parentNode.insertBefore(js,fjs);
  }(document,"script","flossy-widget"));
</script>`;
    
    setGeneratedScript(script);
  };

  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (!generatedScript) {
        alert('Please generate the script first by clicking "Save" in the Builder tab or "Generate Fresh Code" button.');
        return;
      }
      
      await navigator.clipboard.writeText(generatedScript);
      setCopySuccess(true);
      
      // Reset the success state after 3 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  // Test mode functions
  const startTestMode = () => {
    setTestMode(true);
    setCurrentStep('greeting');
    setVisibleMessages([]);
    setShowOptions(false);
    setSelectedOption(null);
    setFormData({});
    setCurrentFormField(0);
    setShowForm(false);
    setIsTyping(false);
    setCurrentWorkflow(null);
    setSelectedTreatment(null);
    setShowTreatmentOptions(false);
    setShowCallbackForm(false);
    setCallbackData({});
    setCurrentCallbackField(0);
    setShowTreatmentChat(false);
    setTreatmentChatInput('');
    setTreatmentChatMessages([]);
    setTreatmentUserEmail('');
    
    // Start the greeting sequence
    setTimeout(() => {
      showMessagesSequentially();
    }, 300);
  };

  const exitTestMode = () => {
    setTestMode(false);
    setVisibleMessages([]);
    setShowOptions(false);
    setIsTyping(false);
    setShowForm(false);
    setCurrentFormField(0);
    setFormData({});
    setCurrentWorkflow(null);
    setSelectedTreatment(null);
    setShowTreatmentOptions(false);
    setShowCallbackForm(false);
    setCallbackData({});
    setCurrentCallbackField(0);
    setShowTreatmentChat(false);
    setTreatmentChatInput('');
    setTreatmentChatMessages([]);
    setTreatmentUserEmail('');
  };

  const scrollToBottom = () => {
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      const chatContainer = document.querySelector('.chat-messages-container');
      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  };

  const showMessagesSequentially = () => {
    openingMessages.forEach((message, index) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, { ...message, id: `msg-${index}`, isBot: true }]);
          scrollToBottom();
          
          // Show options after last message
          if (index === openingMessages.length - 1) {
            setTimeout(() => {
              setShowOptions(true);
              scrollToBottom();
            }, 600);
          }
        }, 800); // Faster typing duration
      }, index * 1400); // Faster delay between messages
    });
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    
    // Add user's selection to chat
    setVisibleMessages(prev => [...prev, {
      id: 'user-selection',
      text: option.text,
      showAvatar: false,
      isBot: false,
      isUser: true
    }]);
    
    scrollToBottom();
    
    // Handle treatment and callback options
    if (option.type === 'brochure' || option.type === 'consultation') {
      handleTreatmentOptionSelect(option);
      return;
    }
    
    if (option.type === 'callback' || option.type === 'done') {
      handleCallbackOptionSelect(option);
      return;
    }
    
    if (option.type === 'appointment') {
      setCurrentWorkflow('appointment');
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, {
            id: 'appointment-greeting',
            text: appointmentGreeting,
            showAvatar: true,
            isBot: true
          }]);
          scrollToBottom();
          
          setTimeout(() => {
            setShowForm(true);
            setCurrentFormField(0);
          }, 800);
        }, 800);
      }, 500);
    } else if (option.type === 'treatment') {
      setCurrentWorkflow('treatment');
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, {
            id: 'treatment-greeting',
            text: treatmentGreeting,
            showAvatar: true,
            isBot: true
          }]);
          scrollToBottom();
          
          setTimeout(() => {
            setShowTreatmentOptions(true);
          }, 800);
        }, 800);
      }, 500);
    } else if (option.type === 'callback') {
      setCurrentWorkflow('callback');
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, {
            id: 'callback-greeting',
            text: callbackGreeting,
            showAvatar: true,
            isBot: true
          }]);
          scrollToBottom();
          
          setTimeout(() => {
            setShowCallbackForm(true);
            setCurrentCallbackField(0);
          }, 800);
        }, 800);
      }, 500);
    }
  };

  const addBotMessage = (text, delay = 800) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, {
            id: `bot-msg-${Date.now()}`,
            text: text,
            showAvatar: true,
            isBot: true
          }]);
          scrollToBottom();
          resolve();
        }, delay);
      }, 300);
    });
  };

  const handleFormSubmit = async (fieldName, value) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
    
    // IMMEDIATELY hide the current field and move to next
    setCurrentFormField(-1); // Hide current field immediately
    
    // Add user's input to chat
    setVisibleMessages(prev => [...prev, {
      id: `user-input-${fieldName}-${Date.now()}`,
      text: value,
      showAvatar: false,
      isBot: false,
      isUser: true
    }]);
    
    // Scroll immediately after adding user message
    setTimeout(() => scrollToBottom(), 100);
    
    // Conversational responses based on field
    if (fieldName === 'fullName') {
      if (currentWorkflow === 'treatment') {
      await addBotMessage(`Thanks ${value}! 😊`);
      await addBotMessage(`What's the best way to reach you? Please share your email address.`);
      setCurrentFormField(1);
      } else {
        await addBotMessage(`Thanks ${value}! 😊`);
        await addBotMessage(`What's the best way to reach you? Please share your email address.`);
        setCurrentFormField(1);
      }
    } else if (fieldName === 'contact') {
      if (currentWorkflow === 'treatment') {
        await addBotMessage(`Perfect! I've got your contact info.`);
        if (privacyPolicyUrl) {
          await addBotMessage(`We take privacy and your data very seriously and do not share it. See our <a href="${privacyPolicyUrl}" target="_blank" style="color: ${themeColor}; text-decoration: underline;">privacy policy</a>`);
        }
        await addBotMessage(`I'll also need your phone number for follow-up.`);
        setCurrentFormField(2);
      } else {
      await addBotMessage(`Perfect! I've got your contact info.`);
      if (privacyPolicyUrl) {
        await addBotMessage(`We take privacy and your data very seriously and do not share it. See our <a href="${privacyPolicyUrl}" target="_blank" style="color: ${themeColor}; text-decoration: underline;">privacy policy</a>`);
      }
      await addBotMessage(`I'll also need your phone number for appointment reminders.`);
      setCurrentFormField(2);
      }
    } else if (fieldName === 'phone') {
      if (currentWorkflow === 'treatment') {
        // Treatment workflow - send brochure and finish
        await addBotMessage(`Thank you! We'll send the details shortly. If you'd like a call from our team, just type 'callback.'`);
        
        // Send treatment enquiry to n8n (only in production, not test mode)
        if (!testMode) {
          try {
            const response = await fetch('https://n8n.flipthatpdf.site/webhook/treatment-enquiry', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                botId: botId,
                type: 'treatment_brochure',
                treatment: {
                  name: selectedTreatment.name,
                  description: selectedTreatment.description,
                  brochureUrl: selectedTreatment.brochureUrl || ''
                },
                customer: {
                  name: newFormData.fullName,
                  email: newFormData.contact,
                  phone: value
                },
                companyOwnerEmail: companyOwnerEmail,
                companyName: companyName,
                companyPhone: companyPhone,
                companyWebsite: companyWebsite,
                timestamp: new Date().toISOString()
              })
            });
            
            if (response.ok) {
              console.log('Treatment enquiry sent successfully');
            } else {
              console.error('Failed to send treatment enquiry:', response.status);
              await addBotMessage(`I've saved your details. There was a temporary issue sending the brochure, but our team will contact you shortly.`);
            }
          } catch (error) {
            console.error('Error sending treatment enquiry:', error);
            await addBotMessage(`I've saved your details. There was a temporary issue sending the brochure, but our team will contact you shortly.`);
          }
        } else {
          console.log('Test mode: Treatment enquiry webhook call skipped');
        }
        
        // Show callback input field instead of form
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, {
            id: 'callback-input-prompt',
            text: 'Type "callback" if you\'d like us to call you back:',
            showAvatar: true,
            isBot: true
          }]);
          setShowCallbackInput(true);
          // Ensure other UI states are hidden
          setShowOptions(false);
        }, 1000);
        scrollToBottom();
        
        setShowForm(false);
        setCurrentFormField(-1);
        
        // Don't show options immediately - let callback input handle the flow
        // Options will be shown only if user doesn't engage with callback
      } else {
      await addBotMessage(`Great! Now let's find you the perfect appointment time.`);
      await addBotMessage(`What date works best for you?`);
      setCurrentFormField(3);
      }
    } else if (fieldName === 'preferredDate') {
      await addBotMessage(`${value} sounds good! 📅`);
      await addBotMessage(`What time would you prefer on that day?`);
      setCurrentFormField(4);
    } else if (fieldName === 'preferredTime') {
      await addBotMessage(`Perfect! Let me check availability for ${newFormData.preferredDate} at ${value}...`);
      
      // Simulate checking availability
      setTimeout(async () => {
        await addBotMessage(confirmationMessages.success.replace('[chosen date/time]', `${newFormData.preferredDate} at ${value}`));
        setShowForm(false);
        setCurrentFormField(-1);
        
        // Show options again after appointment completion
        setTimeout(() => {
          setShowOptions(true);
        }, 1000);
      }, 2000);
    }
  };

  // Treatment selection handler
  const handleTreatmentSelect = async (treatment) => {
    setSelectedTreatment(treatment);
    setShowTreatmentOptions(false);
    
    // Add user's selection to chat
    setVisibleMessages(prev => [...prev, {
      id: 'treatment-selection',
      text: treatment.name,
      showAvatar: false,
      isBot: false,
      isUser: true
    }]);
    
    scrollToBottom();
    
    // Show treatment info (Deeper Dive)
    await addBotMessage(`${treatment.description}. Would you like me to send you a detailed brochure via email or help you schedule a free consultation with our dentist?`);
    
    // Show clickable options
    setTimeout(() => {
      setVisibleMessages(prev => [...prev, {
        id: 'treatment-options',
        text: 'Please select an option:',
        showAvatar: true,
        isBot: true,
        showOptions: true,
        options: [
          { id: 'brochure', text: 'Send me the brochure', type: 'brochure' },
          { id: 'consultation', text: 'Schedule a consultation', type: 'consultation' }
        ]
      }]);
    }, 800);
  };

  // Treatment option handler
  const handleTreatmentOptionSelect = async (option) => {
    // Set selected option
    setSelectedTreatmentOption(option.id);
    
    scrollToBottom();
    
    if (option.type === 'brochure') {
      // Collect Details step
      await addBotMessage(`Please share your name and preferred contact method so we can follow up with information tailored to your needs.`);
      
      // Show form for collecting details
      setTimeout(() => {
        setShowForm(true);
        setCurrentFormField(0);
        setCurrentWorkflow('treatment');
        scrollToBottom();
      }, 1000);
      
    } else if (option.type === 'consultation') {
      // Switch to appointment booking
      await addBotMessage(`Great! I'll help you schedule a consultation for ${selectedTreatment.name}. Let me switch you to our appointment booking system.`);
      
      // Start appointment booking workflow
      setCurrentWorkflow('appointment');
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, {
            id: 'appointment-greeting',
            text: appointmentGreeting,
            showAvatar: true,
            isBot: true
          }]);
          scrollToBottom();
          
          setTimeout(() => {
            setShowForm(true);
            setCurrentFormField(0);
          }, 800);
        }, 800);
      }, 500);
    }
  };

  // Callback option handler
  const handleCallbackOptionSelect = async (option) => {
    // Add user's selection to chat
    setVisibleMessages(prev => [...prev, {
      id: `callback-option-${Date.now()}`,
      text: option.text,
      showAvatar: false,
      isBot: false,
      isUser: true
    }]);
    
    scrollToBottom();
    
    if (option.type === 'callback') {
      // Check if we have previously collected details
      if (formData.fullName && formData.contact && formData.phone) {
        // Use existing details
        await addBotMessage(`Perfect! I'll have our team call you at ${formData.phone}. Is there a specific reason you'd like us to call or a particular question you have?`);
        
        // Show callback form with pre-filled data
        setCallbackData({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.contact,
          reason: '',
          timing: ''
        });
        setCurrentCallbackField(2); // Skip name and phone, start with reason
        setShowCallbackForm(true);
      } else {
        // Start fresh callback flow
        await addBotMessage(callbackGreeting);
        setCurrentCallbackField(0);
        setShowCallbackForm(true);
      }
    } else if (option.type === 'done') {
      await addBotMessage(`Great! Feel free to reach out anytime if you have questions. Have a wonderful day!`);
      setShowOptions(true);
    }
  };

  // Treatment chat handler
  const handleTreatmentChatSubmit = async (message) => {
    if (!message.trim()) return;
    
    // Add user's message to chat
    setVisibleMessages(prev => [...prev, {
      id: `treatment-chat-${Date.now()}`,
      text: message,
      showAvatar: false,
      isBot: false,
      isUser: true
    }]);
    
    // Add to treatment chat messages
    setTreatmentChatMessages(prev => [...prev, {
      id: `treatment-chat-${Date.now()}`,
      text: message,
      isUser: true,
      timestamp: new Date()
    }]);
    
    setTreatmentChatInput('');
    scrollToBottom();
    
    // Check if user wants consultation or appointment
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('consultation') || lowerMessage.includes('schedule') || lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
      // Switch to appointment booking
      await addBotMessage(`Great! I'll help you schedule a consultation for ${selectedTreatment.name}. Let me switch you to our appointment booking system.`);
      setShowTreatmentChat(false);
      
      // Start appointment booking workflow
      setCurrentWorkflow('appointment');
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, {
            id: 'appointment-greeting',
            text: appointmentGreeting,
            showAvatar: true,
            isBot: true
          }]);
          scrollToBottom();
          
          setTimeout(() => {
            setShowForm(true);
            setCurrentFormField(0);
          }, 800);
        }, 800);
      }, 500);
      
    } else if (lowerMessage.includes('callback')) {
      // Handle callback request
      if (formData.fullName && formData.contact && formData.phone) {
        // Use existing details
        await addBotMessage(`Perfect! I'll have our team call you at ${formData.phone}. Is there a specific reason you'd like us to call or a particular question you have?`);
        
        // Show callback form with pre-filled data
        setCallbackData({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.contact,
          reason: '',
          timing: ''
        });
        setCurrentCallbackField(2); // Skip name and phone, start with reason
        setShowCallbackForm(true);
        setShowTreatmentChat(false);
      } else {
        // Start fresh callback flow
        await addBotMessage(callbackGreeting);
        setCurrentCallbackField(0);
        setShowCallbackForm(true);
        setShowTreatmentChat(false);
      }
      
    } else {
      // General questions - keep in treatment chat
      if (!testMode) {
        try {
          const response = await fetch('https://n8n.flipthatpdf.site/webhook/ai-agent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              botId: botId,
              type: 'ai_question',
              treatment: selectedTreatment,
              userMessage: message,
              companyOwnerEmail: companyOwnerEmail,
              companyName: companyName
            })
          });
          
          const aiResponse = await response.json();
          
          setTimeout(async () => {
            await addBotMessage(aiResponse.message || `Thanks for your question about ${selectedTreatment.name}! Is there anything else you'd like to know?`);
          }, 1500);
        } catch (error) {
          console.error('Error getting AI response:', error);
          setTimeout(async () => {
            await addBotMessage(`Thanks for your question about ${selectedTreatment.name}! I'm having trouble processing that right now, but our team will be happy to help you with any questions. Is there anything else you'd like to know?`);
          }, 1500);
        }
      } else {
        // Test mode - just show a simple response
        setTimeout(async () => {
          await addBotMessage(`Thanks for your question about ${selectedTreatment.name}! In test mode, I can't process complex questions, but our team will be happy to help you with any questions. Is there anything else you'd like to know?`);
        }, 1500);
      }
    }
  };

  // Callback form handler
  const handleCallbackSubmit = async (fieldName, value) => {
    const newCallbackData = { ...callbackData, [fieldName]: value };
    setCallbackData(newCallbackData);
    
    // IMMEDIATELY hide the current field and move to next
    setCurrentCallbackField(-1);
    
    // Add user's input to chat
    setVisibleMessages(prev => [...prev, {
      id: `callback-input-${fieldName}`,
      text: value,
      showAvatar: false,
      isBot: false,
      isUser: true
    }]);
    
    scrollToBottom();
    
    // Conversational responses based on field
    if (fieldName === 'name') {
      await addBotMessage(`Thanks ${value}! 😊`);
      await addBotMessage(`What's the best phone number to reach you?`);
      setCurrentCallbackField(1);
    } else if (fieldName === 'phone') {
      await addBotMessage(`Perfect! I've got your contact info.`);
      await addBotMessage(callbackFollowUp);
      setCurrentCallbackField(2);
    } else if (fieldName === 'reason') {
      await addBotMessage(`Got it! ${value} is a great reason to call.`);
      await addBotMessage(callbackTiming);
      setCurrentCallbackField(3);
    } else if (fieldName === 'timing') {
      await addBotMessage(`Excellent! We've scheduled your callback for ${value}.`);
      await addBotMessage(callbackConfirmation.replace('[chosen time]', value));
      
      // Send callback request to Gmail webhook (only in production, not test mode)
      if (!testMode) {
        try {
          const response = await fetch('https://n8n.flipthatpdf.site/webhook/gmail-callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // Bot identification
              botId: botId,
              botName: botName || 'Bot',
              timestamp: new Date().toISOString(),
              
              // Request type
              type: 'callback_request',
              
              // Customer information
              customer: {
                name: newCallbackData.name,
                phone: newCallbackData.phone,
                email: newCallbackData.email || '',
                message: `Callback requested for: ${newCallbackData.reason}`
              },
              
              // Callback details
              callback: {
                reason: newCallbackData.reason,
                preferredTime: value,
                urgency: 'Normal',
                status: 'pending'
              },
              
              // Company information
              company: {
                name: companyName,
                ownerEmail: companyOwnerEmail,
                phone: companyPhone || '',
                website: companyWebsite || ''
              },
              
              // Legacy fields for compatibility
              customerName: newCallbackData.name,
              customerPhone: newCallbackData.phone,
              customerEmail: newCallbackData.email || '',
              callbackReason: newCallbackData.reason,
              preferredTime: value,
              companyOwnerEmail: companyOwnerEmail,
              companyName: companyName,
              companyPhone: companyPhone,
              companyWebsite: companyWebsite,
              customerMessage: `Callback requested for: ${newCallbackData.reason}`,
              urgency: 'Normal'
            })
          });
          
          const result = await response.json();
          console.log('Callback request sent:', result);
        } catch (error) {
          console.error('Error sending callback request:', error);
          await addBotMessage(`I've saved your callback request. There was a temporary issue sending it, but our team will contact you shortly at ${newCallbackData.phone}.`);
        }
      } else {
        console.log('Test mode: Gmail callback webhook call skipped');
      }
      
      setShowCallbackForm(false);
      setCurrentCallbackField(-1);
      
      // Show options again after callback completion
      setTimeout(() => {
        setShowOptions(true);
      }, 1000);
    }
  };

  // Callback input handler
  const handleCallbackInputSubmit = async (message) => {
    if (!message.trim()) return;
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('callback')) {
      // Reset other UI states first
      resetUIStates();
      
      // Use existing customer details from treatment form
      if (formData.fullName && formData.contact && formData.phone) {
        await addBotMessage(`Perfect! I'll have our team call you at ${formData.phone}. Is there a specific reason you'd like us to call or a particular question you have?`);
        
        // Show callback form with pre-filled data
        setCallbackData({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.contact,
          reason: '',
          timing: ''
        });
        setCurrentCallbackField(2); // Skip name and phone, start with reason
        setShowCallbackForm(true);
      } else {
        // Start fresh callback flow
        await addBotMessage(callbackGreeting);
        setCurrentCallbackField(0);
        setShowCallbackForm(true);
      }
    } else {
      // If not callback, show options
      await addBotMessage(`I didn't quite catch that. Type "callback" if you'd like us to call you back, or feel free to ask any other questions!`);
      setTimeout(() => {
        setShowOptions(true);
      }, 1000);
    }
    
    setCallbackInput('');
    setShowCallbackInput(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex space-x-8 relative">
              <button 
                onClick={() => setActiveTab('builder')}
                className={`px-2 py-3 font-medium transition-all duration-300 relative ${
                  activeTab === 'builder' 
                    ? 'text-flossy-green' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Builder
                {activeTab === 'builder' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#8FE3A8' }}
                  />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('embed')}
                className={`px-2 py-3 font-medium transition-all duration-300 relative ${
                  activeTab === 'embed' 
                    ? 'text-flossy-green' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Add to website
                {activeTab === 'embed' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#8FE3A8' }}
                  />
                )}
              </button>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={testMode ? exitTestMode : startTestMode}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                  testMode 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {testMode ? 'Exit Test' : 'Test Bot'}
              </button>
            
              <button 
                onClick={saveBot}
                className="px-6 py-2.5 bg-flossy-green text-white rounded-full font-medium hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                Save
              </button>
        </div>
      </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === 'builder' && (
              <div className="grid grid-cols-2 gap-6 h-full">
                {/* Left Column - Bot Settings Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
            <h2 className="text-xl font-semibold text-flossy-text mb-6">Bot Settings</h2>
            
            <div className="space-y-4">
              {/* Basic Settings Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleAccordion('basicSettings')}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Basic Settings</span>
                  </div>
                  {accordionStates.basicSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {accordionStates.basicSettings && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
              {/* Bot Name */}
              <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                  placeholder="Enter bot name"
                />
              </div>

              {/* Company Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                  placeholder="Enter your company name"
                />
                <p className="text-xs text-gray-500 mt-1 text-left">This will replace [Company Name] in opening messages</p>
              </div>

                    {/* Company Owner Email */}
              <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                        Company Owner Email
                      </label>
                          <input
                        type="email"
                        value={companyOwnerEmail}
                        onChange={(e) => setCompanyOwnerEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                        placeholder="owner@yourcompany.com"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-left">Used for brochure requests and notifications</p>
                    </div>

                    {/* Company Phone */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                        Company Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-left">Will be included in brochure emails</p>
                    </div>

                    {/* Company Website */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                        Company Website (Optional)
                      </label>
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                        placeholder="https://yourcompany.com"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-left">Will be included in brochure emails</p>
                    </div>


                    {/* Theme Color */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                        Bot Theme Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>
              </div>

              {/* Avatar Selection */}
              <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                  Select Avatar
                </label>
                      <div className="flex space-x-2 flex-wrap">
                  {avatars.map((avatar) => (
                    <div key={avatar.id} className="relative">
                      {avatar.id === 'upload' ? (
                        <label className="cursor-pointer">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-all border-2 ${
                            selectedAvatar === avatar.id 
                                    ? 'ring-2 ring-flossy-green ring-offset-2 border-flossy-green' 
                                    : 'border-gray-300 hover:border-flossy-green'
                                }`}>
                            {uploadedAvatar ? (
                              <img 
                                src={uploadedAvatar} 
                                alt="Uploaded Avatar"
                                className="w-8 h-8 rounded-md object-cover"
                              />
                            ) : (
                              <img 
                                src={avatar.avatar} 
                                alt={avatar.name}
                                className="w-8 h-8 rounded-md"
                              />
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      ) : (
                    <button
                      onClick={() => setSelectedAvatar(avatar.id)}
                            className={`w-10 h-10 rounded-md flex items-center justify-center transition-all border-2 ${
                        selectedAvatar === avatar.id 
                                ? 'ring-2 ring-flossy-green ring-offset-2 border-flossy-green' 
                                : 'border-gray-300 hover:border-flossy-green'
                            }`}
                          >
                            <img 
                              src={avatar.avatar} 
                              alt={avatar.name}
                            className="w-8 h-8 rounded-md object-cover"
                            />
                    </button>
                      )}
                    </div>
                  ))}
                </div>
                    </div>

                    {/* Privacy Policy URL */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                        Privacy Policy URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={privacyPolicyUrl}
                        onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                        placeholder="https://yoursite.com/privacy-policy"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-left">If provided, bot will mention privacy policy after collecting email</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Opening Messages Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                  onClick={() => toggleAccordion('appointmentFlow')}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Opening Messages</span>
                  </div>
                  {accordionStates.appointmentFlow ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {accordionStates.appointmentFlow && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Configure opening messages</span>
                      <button
                        onClick={addOpeningMessage}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                      >
                        + Add Message
                  </button>
                </div>
                
                <div className="space-y-3">
                      {openingMessages.map((message, index) => (
                        <div key={message.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-600">Message {index + 1}</span>
                            {openingMessages.length > 1 && (
                          <button
                                onClick={() => removeOpeningMessage(message.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                          <div className="space-y-2">
                            <textarea
                              value={message.text}
                              onChange={(e) => updateOpeningMessage(message.id, 'text', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                              rows="2"
                              placeholder="Enter message text"
                            />
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`avatar-${message.id}`}
                                checked={message.showAvatar}
                                onChange={(e) => updateOpeningMessage(message.id, 'showAvatar', e.target.checked)}
                                className="mr-2"
                              />
                              <label htmlFor={`avatar-${message.id}`} className="text-xs text-gray-600">
                                Show bot avatar
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                  </div>
                )}
              </div>




              {/* Appointment Greeting */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-700 mb-2 text-left">
                  Appointment Booking Greeting
                </label>
                <textarea
                  value={appointmentGreeting}
                  onChange={(e) => setAppointmentGreeting(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                  rows="3"
                  placeholder="Message shown when user selects appointment booking"
                />
                <p className="text-xs text-gray-500 mt-1 text-left">This message appears when user clicks "Request an appointment"</p>
              </div>



              {/* Google Calendar Integration Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleAccordion('googleCalendar')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Google Calendar Integration</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    googleCalendarConnected 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                      {googleCalendarConnected ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
                  {accordionStates.googleCalendar ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {accordionStates.googleCalendar && (
                  <div className="p-4 space-y-4 border-t border-gray-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">

                {!googleCalendarConnected ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-gray-800 mb-2">🔗 Connect Your Google Calendar</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        When customers book appointments through your chatbot, they'll automatically be added to your Google Calendar.
                      </p>
                      <button
                        onClick={connectGoogleCalendar}
                        disabled={isConnecting || !botId}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                          isConnecting || !botId
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isConnecting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Connecting...</span>
                          </div>
                        ) : !botId ? (
                          'Save Bot First'
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <span>🔗</span>
                            <span>Connect Google Calendar</span>
                          </div>
                        )}
                      </button>
                      {!botId && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Please save your bot configuration first to get a Bot ID
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">✅ Google Calendar Connected</h4>
                          <p className="text-sm text-gray-600">
                            Appointments will be automatically added to your calendar
                          </p>
                          {calendarStatus && (
                            <p className="text-xs text-gray-500 mt-1">
                              Connected on: {new Date(calendarStatus.connectedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={disconnectGoogleCalendar}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-blue-500 text-lg">💡</div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800 mb-1">How it works</h4>
                          <ul className="text-xs text-blue-600 space-y-1">
                            <li>• Customers book appointments through your chatbot</li>
                            <li>• Appointments are automatically added to your Google Calendar</li>
                            <li>• You'll receive email reminders 24 hours before each appointment</li>
                            <li>• Customers get calendar invites with appointment details</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                  </div>
                )}
              </div>

              {/* Treatment Enquiry Workflow Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleAccordion('treatmentFlow')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Treatment Enquiry Workflow</span>
                  </div>
                  {accordionStates.treatmentFlow ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {accordionStates.treatmentFlow && (
                  <div className="p-4 space-y-4 border-t border-gray-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50">


                  <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Treatment Options</span>
                        <button
                          onClick={addTreatmentOption}
                          className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
                        >
                          + Add Treatment
                        </button>
                      </div>
                    
                      <div className="space-y-3">
                        {treatmentOptions.map((option, index) => (
                          <div key={option.id} className="border border-gray-200 rounded-md p-3 bg-white">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-gray-600">Treatment {index + 1}</span>
                              {treatmentOptions.length > 1 && (
                                <button
                                  onClick={() => removeTreatmentOption(option.id)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          
                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1 text-left">
                                  Treatment Name
                                </label>
                                <input
                                  type="text"
                                  value={option.name}
                                  onChange={(e) => updateTreatmentOption(option.id, 'name', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                                  placeholder="e.g., Teeth Whitening"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1 text-left">
                                  Description
                                </label>
                                <textarea
                                  value={option.description}
                                  onChange={(e) => updateTreatmentOption(option.id, 'description', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                                  rows="2"
                                  placeholder="Brief description of the treatment"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1 text-left">
                                  Brochure URL (Optional)
                                </label>
                                <input
                                  type="url"
                                  value={option.brochureUrl}
                                  onChange={(e) => updateTreatmentOption(option.id, 'brochureUrl', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-flossy-green focus:border-flossy-green transition-all"
                                  placeholder="https://yoursite.com/brochure.pdf"
                                />
                                <p className="text-xs text-gray-500 mt-1 text-left">PDF or document URL to send to users</p>
                              </div>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  </div>
                )}
              </div>



              {/* Save Bot Button */}
              <div className="pt-4">
                <button
                  onClick={saveBot}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Save Bot
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
              {testMode && (
                <div className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 animate-pulse">
                  🤖 Interactive Mode Active
                </div>
              )}
            </div>
            
            {/* Chat Widget Preview */}
            <div className="relative">
              {/* Chat Window */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-sm mx-auto" style={{ height: '500px' }}>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: themeColor }}>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={getCurrentAvatar()} 
                        alt={avatars.find(a => a.id === selectedAvatar)?.name || 'Bot'}
                        className="w-10 h-10 rounded-full ring-2 ring-white/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg text-left">
                      {botName || 'Bot Name'}
                    </h3>
                      <p className="text-sm text-white/80 text-left">Online now</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="chat-messages-container p-6 space-y-4 bg-gray-50/30" style={{ height: 'calc(100% - 165px)', overflowY: 'auto' }}>
                  {testMode ? (
                    <>
                      {/* Test Mode - Animated Messages */}
                      {visibleMessages.map((message, index) => (
                        <div 
                          key={message.id} 
                          className={`flex items-start space-x-3 animate-slideInUp ${message.isUser ? 'flex-row-reverse' : ''}`}
                          style={{ 
                            animation: `slideInUp 0.3s ease-out ${index * 0.05}s both`,
                          }}
                        >
                          {message.isUser ? (
                            <div className="w-8 h-8 flex-shrink-0"></div>
                          ) : (
                            <>
                              {message.showAvatar && (
                                <img 
                                  src={getCurrentAvatar()} 
                                  alt="Bot"
                                  className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                              )}
                              {!message.showAvatar && <div className="w-8 h-8 flex-shrink-0"></div>}
                            </>
                          )}
                          <div 
                            className={`rounded-2xl px-4 py-3 shadow-sm border max-w-xs transform transition-all duration-300 hover:shadow-md ${
                              message.isUser 
                                ? 'bg-blue-500 text-white rounded-tr-sm border-blue-500' 
                                : 'bg-white rounded-tl-sm border-gray-100 text-gray-800'
                            }`}
                            style={message.isUser ? { backgroundColor: themeColor } : {}}
                          >
                            <p 
                              className="text-sm leading-relaxed text-left"
                              dangerouslySetInnerHTML={{ 
                                __html: message.isUser 
                                  ? message.text 
                                  : message.text.replace('[Company Name]', companyName || 'Your Company')
                              }}
                            />
                            <p className={`text-xs mt-1 text-left ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                              Just now
                            </p>
                            
                            {/* Message Options */}
                            {message.showOptions && message.options && (
                              <div className="space-y-2 mt-3">
                                {message.options.map((option, optionIndex) => (
                                  <div
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option)}
                                    className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer hover:shadow-md transform hover:scale-[1.02] animate-slideInLeft"
                                    style={{ 
                                      backgroundColor: '#f8fafc',
                                      animation: `slideInLeft 0.3s ease-out ${optionIndex * 0.05}s both`
                                    }}
                                  >
                                    <div 
                                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                      style={{ borderColor: themeColor }}
                                    >
                                      <div 
                                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                          selectedTreatmentOption === option.id 
                                            ? 'opacity-100 scale-100' 
                                            : 'opacity-0 scale-0 hover:opacity-100 hover:scale-100'
                                        }`}
                                        style={{ backgroundColor: themeColor }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-800 font-medium">{option.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex items-start space-x-3 animate-fadeIn">
                          <img 
                            src={getCurrentAvatar()} 
                            alt="Bot"
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive Options */}
                      {showOptions && (
                        <div className="space-y-3 mt-4 animate-slideInUp" style={{ animation: 'slideInUp 0.6s ease-out both' }}>
                          <div className="text-sm text-gray-600 text-left px-3 animate-fadeIn">Please select an option:</div>
                          {appointmentOptions.filter(opt => opt.text.trim()).map((option, index) => (
                            <div
                              key={option.id}
                              onClick={() => handleOptionSelect(option)}
                              className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer hover:shadow-md transform hover:scale-[1.02] animate-slideInLeft"
                              style={{ 
                                backgroundColor: '#f8fafc',
                                animation: `slideInLeft 0.3s ease-out ${index * 0.05}s both`
                              }}
                            >
                              <div 
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                                style={{ borderColor: themeColor }}
                              >
                                <div 
                                  className="w-3 h-3 rounded-full transition-all duration-200 opacity-0 scale-0 hover:opacity-100 hover:scale-100"
                                  style={{ backgroundColor: themeColor }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-800 font-medium">{option.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactive Form */}
                      {showForm && (
                        <div className="mt-4 animate-slideInUp" style={{ animation: 'slideInUp 0.6s ease-out both' }}>
                          {[
                            { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
                            { name: 'contact', label: 'Email Address', type: 'email', placeholder: 'Enter your email address' },
                            { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
                            { name: 'preferredDate', label: 'Preferred Date', type: 'date', placeholder: '' },
                            { name: 'preferredTime', label: 'Preferred Time', type: 'time', placeholder: '' }
                          ].map((field, index) => (
                            index === currentFormField && currentFormField >= 0 && (
                              <div 
                                key={field.name}
                                className="mb-4 animate-slideInUp"
                                style={{ 
                                  animation: `slideInUp 0.3s ease-out 0s both`
                                }}
                              >
                                {field.type === 'date' || field.type === 'time' ? (
                                  <div className="flex space-x-2">
                                <input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                      className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 transform focus:scale-[1.01] text-sm"
                                  style={{ 
                                    borderColor: themeColor,
                                        boxShadow: `0 0 0 2px ${themeColor}20`
                                  }}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                      handleFormSubmit(field.name, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                      onChange={(e) => {
                                        // Auto-submit when date/time is selected
                                        if (e.target.value) {
                                          setTimeout(() => {
                                            handleFormSubmit(field.name, e.target.value);
                                          }, 300);
                                        }
                                      }}
                                  autoFocus={true}
                                />
                                    <button
                                      onClick={(e) => {
                                        const input = e.target.parentElement.querySelector('input');
                                        if (input && input.value.trim()) {
                                          handleFormSubmit(field.name, input.value);
                                          input.value = '';
                                        }
                                      }}
                                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-white"
                                      style={{ backgroundColor: themeColor }}
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(90 12 12)" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex space-x-2">
                                    <input
                                      type={field.type}
                                      placeholder={field.placeholder}
                                      className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 transform focus:scale-[1.01] text-sm"
                                      style={{ 
                                        borderColor: themeColor,
                                        boxShadow: `0 0 0 2px ${themeColor}20`
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                          handleFormSubmit(field.name, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                      autoFocus={true}
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Button clicked for field:', field.name);
                                        const input = e.target.parentElement.querySelector('input');
                                        console.log('Button clicked, input found:', input, 'value:', input?.value);
                                        if (input && input.value.trim()) {
                                          console.log('Submitting form with field:', field.name, 'value:', input.value);
                                          handleFormSubmit(field.name, input.value);
                                          input.value = '';
                                        } else {
                                          console.log('No input found or empty value');
                                        }
                                      }}
                                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-white"
                                      style={{ backgroundColor: themeColor }}
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(90 12 12)" />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      )}

                      {/* Treatment Options */}
                      {showTreatmentOptions && (
                        <div className="mt-4 animate-slideInUp" style={{ animation: 'slideInUp 0.6s ease-out both' }}>
                          <div className="text-sm text-gray-600 text-left px-3 mb-3 animate-fadeIn">Please select a treatment:</div>
                          {treatmentOptions.filter(opt => opt.name.trim()).map((option, index) => (
                            <div
                              key={option.id}
                              onClick={() => handleTreatmentSelect(option)}
                              className="flex items-start space-x-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer hover:shadow-md transform hover:scale-[1.02] animate-slideInLeft mb-2"
                              style={{ 
                                backgroundColor: '#f8fafc',
                                animation: `slideInLeft 0.3s ease-out ${index * 0.05}s both`
                              }}
                            >
                              <div 
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
                                style={{ borderColor: themeColor }}
                              >
                                <div 
                                  className="w-3 h-3 rounded-full transition-all duration-200 opacity-0 scale-0 hover:opacity-100 hover:scale-100"
                                  style={{ backgroundColor: themeColor }}
                                ></div>
                              </div>
                              <div className="flex-1 text-left">
                                <span className="text-sm text-gray-800 font-medium block text-left">{option.name}</span>
                                <span className="text-xs text-gray-500 block mt-1 text-left">{option.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Treatment Chat */}
                      {showTreatmentChat && (
                        <div className="mt-4 animate-slideInUp" style={{ animation: 'slideInUp 0.6s ease-out both' }}>
                          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                            <div className="text-sm text-gray-600 text-left mb-3">
                              💬 Ask me anything about {selectedTreatment?.name} or type your choice:
                            </div>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={treatmentChatInput}
                                onChange={(e) => setTreatmentChatInput(e.target.value)}
                                placeholder="Type your message here..."
                                className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 transform focus:scale-[1.01] text-sm"
                                style={{ 
                                  borderColor: themeColor,
                                  boxShadow: `0 0 0 2px ${themeColor}20`
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && e.target.value.trim()) {
                                    handleTreatmentChatSubmit(e.target.value);
                                  }
                                }}
                                autoFocus={true}
                              />
                              <button
                                onClick={() => treatmentChatInput.trim() && handleTreatmentChatSubmit(treatmentChatInput)}
                                disabled={!treatmentChatInput.trim()}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-white ${
                                  treatmentChatInput.trim() 
                                    ? 'opacity-100 translate-y-0' 
                                    : 'opacity-0 translate-y-2 pointer-events-none'
                                }`}
                                style={{ backgroundColor: themeColor }}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(90 12 12)" />
                                </svg>
                              </button>
                            </div>
                            <div className="mt-3 text-xs text-gray-500 text-left">
                              💡 Try: "Send me the brochure" or "I'd like to schedule a consultation"
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Callback Form */}
                      {showCallbackForm && (
                        <div className="mt-4 animate-slideInUp" style={{ animation: 'slideInUp 0.6s ease-out both' }}>
                          {[
                            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
                            { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
                            { name: 'reason', label: 'Reason for Callback', type: 'text', placeholder: 'What would you like to discuss?' },
                            { name: 'timing', label: 'Preferred Time', type: 'text', placeholder: 'e.g., morning, afternoon, or specific time' }
                          ].map((field, index) => (
                            index === currentCallbackField && currentCallbackField >= 0 && (
                              <div 
                                key={field.name}
                                className="mb-4 animate-slideInUp"
                                style={{ 
                                  animation: `slideInUp 0.3s ease-out 0s both`
                                }}
                              >
                                <div className="flex space-x-2">
                                <input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                    className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 transform focus:scale-[1.01] text-sm"
                                  style={{ 
                                    borderColor: themeColor,
                                      boxShadow: `0 0 0 2px ${themeColor}20`
                                  }}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                      handleCallbackSubmit(field.name, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                  autoFocus={true}
                                />
                                  <button
                                    onClick={(e) => {
                                      const input = e.target.parentElement.querySelector('input');
                                      if (input && input.value.trim()) {
                                        handleCallbackSubmit(field.name, input.value);
                                        input.value = '';
                                      }
                                    }}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-white"
                                    style={{ backgroundColor: themeColor }}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(90 12 12)" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}

                      {/* Callback Input */}
                      {showCallbackInput && (
                        <div className="mt-4 animate-slideInUp" style={{ animation: 'slideInUp 0.6s ease-out both' }}>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Type 'callback' to request a call back"
                              value={callbackInput}
                              onChange={(e) => setCallbackInput(e.target.value)}
                              className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 transform focus:scale-[1.01] text-sm"
                              style={{ 
                                borderColor: themeColor,
                                boxShadow: `0 0 0 2px ${themeColor}20`
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  handleCallbackInputSubmit(e.target.value);
                                }
                              }}
                              autoFocus={true}
                            />
                            <button
                              onClick={() => {
                                if (callbackInput.trim()) {
                                  handleCallbackInputSubmit(callbackInput);
                                }
                              }}
                              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-white"
                              style={{ backgroundColor: themeColor }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(90 12 12)" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Static Preview Mode */}
                      {openingMessages.map((message, index) => (
                        <div key={message.id} className="flex items-start space-x-3">
                          {message.showAvatar && (
                    <img 
                      src={getCurrentAvatar()} 
                      alt="Bot"
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                          )}
                          {!message.showAvatar && <div className="w-8 h-8 flex-shrink-0"></div>}
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 max-w-xs">
                      <p className="text-sm text-gray-800 leading-relaxed text-left">
                              {message.text.replace('[Company Name]', companyName || 'Your Company')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 text-left">Just now</p>
                    </div>
                  </div>
                      ))}

                      {/* Static Options Preview */}
                      {appointmentOptions.filter(opt => opt.text.trim()).length > 0 && (
                        <div className="space-y-3 mt-4">
                          <div className="text-sm text-gray-600 text-left px-3">Please select an option:</div>
                          {appointmentOptions.filter(opt => opt.text.trim()).map((option, index) => (
                            <div
                          key={option.id}
                              className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-sm"
                              style={{ backgroundColor: '#f8fafc' }}
                            >
                              <div 
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                style={{ borderColor: themeColor }}
                              >
                                {index === 0 && (
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: themeColor }}
                                  ></div>
                                )}
                              </div>
                              <span className="text-sm text-gray-800 font-medium">{option.text}</span>
                            </div>
                      ))}
                        </div>
                  )}

                      {/* Static Treatment Options Preview */}
                      {treatmentOptions.filter(opt => opt.name.trim()).length > 0 && (
                        <div className="space-y-3 mt-4">
                          <div className="text-sm text-gray-600 text-left px-3">Please select a treatment:</div>
                          {treatmentOptions.filter(opt => opt.name.trim()).map((option, index) => (
                            <div
                              key={option.id}
                              className="flex items-start space-x-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer hover:shadow-sm"
                              style={{ backgroundColor: '#f8fafc' }}
                            >
                              <div 
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5"
                                style={{ borderColor: themeColor }}
                              >
                                <div 
                                  className="w-3 h-3 rounded-full transition-all duration-200 opacity-0 scale-0"
                                  style={{ backgroundColor: themeColor }}
                                ></div>
                              </div>
                              <div className="flex-1 text-left">
                                <span className="text-sm text-gray-800 font-medium block text-left">{option.name}</span>
                                <span className="text-xs text-gray-500 block mt-1 text-left">{option.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {appointmentOptions.filter(opt => opt.text.trim()).length === 0 && treatmentOptions.filter(opt => opt.name.trim()).length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                          <p className="text-gray-500 text-sm text-left">Add appointment options to see them here</p>
                    </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Chat Input Area - Hidden in test mode */}
                {!testMode && (
                <div className="px-6 py-4 m bg-white border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
                      <p className="text-sm text-gray-500 text-left">Type a message...</p>
                    </div>
                    <button 
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: themeColor }}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(90 12 12)" />
                      </svg>
                    </button>
                  </div>
                  </div>
                )}
              </div>
              
              {/* Floating Chat Bubble - Bottom Right */}
              <div 
                className="absolute bottom-4 right-4 w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 animate-pulse-custom"
                style={{ backgroundColor: themeColor }}
                onClick={testMode ? undefined : startTestMode}
              >
                <svg className="w-8 h-8 text-white transition-transform duration-200 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-xs text-white font-bold">1</span>
                </div>
              </div>
            </div>
          </div>
              </div>
            )}

            {activeTab === 'embed' && (
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Add your Chatbot to your website</h2>
                    <p className="text-gray-600 text-lg mb-4">
                      Copy and paste this code before the <code className="bg-gray-100 px-2 py-1 rounded text-sm">&lt;/body&gt;</code> tag on your website
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400 text-sm">embed-code.html</span>
                    </div>
                    <pre className="text-green-400 text-sm overflow-x-auto leading-relaxed">
                      <code>{generatedScript || `<!-- Click "Save" in Builder tab to generate your script -->\n<script>\n  window.flossyConfig = {/* Your bot config */};\n  (function(d,s,id){\n    var js,fjs=d.getElementsByTagName(s)[0];\n    if(d.getElementById(id))return;\n    js=d.createElement(s);js.id=id;\n    js.src="https://cdn.flossy.chat/widget.js";\n    fjs.parentNode.insertBefore(js,fjs);\n  }(document,"script","flossy-widget"));\n</script>`}</code>
                    </pre>
                    <button 
                      onClick={copyToClipboard}
                      className={`absolute top-4 right-4 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md text-sm font-medium ${
                        copySuccess 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {copySuccess ? '✅ Copied!' : '📋 Copy Code'}
                    </button>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={generateFreshCode}
                      className="px-6 py-3 bg-flossy-green text-white rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-medium"
                    >
                      🔄 Generate Fresh Code
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Bot Position Control */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">🎯 Position Controls</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Desktop & Tablet Position</label>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setBotPosition('left')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                              botPosition === 'left' 
                                ? 'border-flossy-green bg-green-50 text-green-700' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            ⬅️ Left Side
                          </button>
                          <button
                            onClick={() => setBotPosition('right')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                              botPosition === 'right' 
                                ? 'border-flossy-green bg-green-50 text-green-700' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            Right Side ➡️
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">📱 Mobile position is always bottom right</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Side Spacing</label>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="range"
                            min="10"
                            max="100"
                            value={sideSpacing}
                            onChange={(e) => setSideSpacing(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #8FE3A8 0%, #8FE3A8 ${(sideSpacing-10)/90*100}%, #e5e7eb ${(sideSpacing-10)/90*100}%, #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex items-center space-x-2">
                            <input 
                              type="number"
                              value={sideSpacing}
                              onChange={(e) => setSideSpacing(parseInt(e.target.value))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm"
                            />
                            <span className="text-sm text-gray-500">px</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Bottom Spacing</label>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="range"
                            min="10"
                            max="100"
                            value={bottomSpacing}
                            onChange={(e) => setBottomSpacing(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #8FE3A8 0%, #8FE3A8 ${(bottomSpacing-10)/90*100}%, #e5e7eb ${(bottomSpacing-10)/90*100}%, #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex items-center space-x-2">
                            <input 
                              type="number"
                              value={bottomSpacing}
                              onChange={(e) => setBottomSpacing(parseInt(e.target.value))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm"
                            />
                            <span className="text-sm text-gray-500">px</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bot Behavior Control */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">⚙️ Display Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Show the bot on:</label>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                🖥️
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-800">Desktop & Tablet</span>
                                <p className="text-xs text-gray-500">Show on larger screens</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowDesktop(!showDesktop)}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                                showDesktop ? 'bg-flossy-green shadow-lg' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                  showDesktop ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                📱
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-800">Mobile Devices</span>
                                <p className="text-xs text-gray-500">Show on phones & small tablets</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowMobile(!showMobile)}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                                showMobile ? 'bg-flossy-green shadow-lg' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                  showMobile ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default BotBuilder;