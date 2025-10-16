// Test file for Bot Configuration API
// This demonstrates the payload structure for saveBotConfig API

const testBotConfig = {
  botId: "test-bot-123",
  userId: 65,
  organizationId: 46,
  name: "Test Dental Bot",
  companyName: "Test Dental Practice",
  avatar: {
    type: "upload",
    url: "https://example.com/avatar.jpg"
  },
  openingMessages: [
    {
      id: "msg-1",
      text: "Welcome to Test Dental Practice",
      showAvatar: true
    },
    {
      id: "msg-2", 
      text: "How can I help you today?",
      showAvatar: true
    }
  ],
  appointmentGreeting: "Hello! 👋 I can help you book an appointment at our clinic.\nWhat's your full name?",
  privacyPolicyUrl: "https://example.com/privacy",
  companyOwnerEmail: "test@example.com",
  companyPhone: "+1234567890",
  companyWebsite: "https://example.com",
  webhookUrl: "https://n8n.flossly.ai/webhook/appointment-booking",
  gmailBrochureUrl: "https://n8n.flossly.ai/webhook/gmail-brochure",
  gmailCallbackUrl: "https://n8n.flossly.ai/webhook/gmail-callback",
  themeColor: "#3B82F6",
  position: "right",
  sideSpacing: 25,
  bottomSpacing: 25,
  showDesktop: true,
  showMobile: true,
  googleCalendarConnected: false,
  calendarStatus: null,
  appointmentFlow: {
    fields: [
      {
        name: "fullName",
        type: "text",
        label: "Full Name",
        required: true
      },
      {
        name: "contact",
        type: "email",
        label: "Email Address",
        required: true
      },
      {
        name: "phone",
        type: "tel",
        label: "Phone Number",
        required: true
      },
      {
        name: "preferredDate",
        type: "date",
        label: "Preferred Date",
        required: true
      },
      {
        name: "preferredTime",
        type: "time",
        label: "Preferred Time",
        required: true
      }
    ]
  },
  treatmentFlow: {
    options: [
      {
        id: "treatment-1",
        name: "Teeth Whitening",
        description: "Professional teeth whitening treatments for a brighter smile",
        brochureUrl: ""
      },
      {
        id: "treatment-2",
        name: "Invisalign",
        description: "Clear aligners for straightening teeth discreetly",
        brochureUrl: ""
      }
    ],
    webhookUrl: "https://n8n.flossly.ai/webhook/gmail-brochure"
  },
  callbackFlow: {
    fields: [
      {
        name: "name",
        type: "text",
        label: "Full Name",
        required: true
      },
      {
        name: "phone",
        type: "tel",
        label: "Phone Number",
        required: true
      },
      {
        name: "reason",
        type: "text",
        label: "Reason for Callback",
        required: true
      },
      {
        name: "timing",
        type: "text",
        label: "Preferred Time",
        required: true
      }
    ]
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Example API call
async function testSaveBotConfig() {
  try {
    const response = await fetch('https://dev.flossly.ai/api/crm/saveBotConfig', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBotConfig)
    });

    const data = await response.json();
    console.log('Save Bot Config Response:', data);
    
    if (data.Success && data.Code === 0) {
      console.log('✅ Bot configuration saved successfully!');
      console.log('Bot ID:', testBotConfig.botId);
    } else {
      console.error('❌ Failed to save bot configuration:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Example API call to get bot config
async function testGetBotConfig(botId) {
  try {
    const response = await fetch(`https://dev.flossly.ai/api/crm/getBotConfig?botId=${botId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log('Get Bot Config Response:', data);
    
    if (data.Success && data.Code === 0) {
      console.log('✅ Bot configuration retrieved successfully!');
      console.log('Configuration:', data.Data);
    } else {
      console.error('❌ Failed to get bot configuration:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testBotConfig,
    testSaveBotConfig,
    testGetBotConfig
  };
}

console.log('Bot Configuration API Test File Loaded');
console.log('Example payload structure:', JSON.stringify(testBotConfig, null, 2));

