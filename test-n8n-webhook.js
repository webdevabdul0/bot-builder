/**
 * Test n8n Webhook Integration
 * This script tests the complete flow from chatbot to n8n to Google Calendar
 */

const axios = require('axios');

const N8N_WEBHOOK_URL = 'https://n8n.flipthatpdf.site/webhook/appointment-booking';
const TEST_BOT_ID = '8501e93b-21f5-4b7b-8b3e-a8efc823014d'; // Use your actual bot ID

async function testN8nWebhook() {
  console.log('🧪 Testing n8n Webhook Integration\n');
  
  const testData = {
    botId: TEST_BOT_ID,
    type: 'appointment',
    userSelection: 'Request an appointment',
    timestamp: new Date().toISOString(),
    formData: {
      fullName: 'John Doe',
      contact: 'john@example.com',
      phone: '+1234567890',
      preferredDate: '2024-01-20',
      preferredTime: '14:00'
    }
  };

  console.log('📤 Sending test appointment to n8n...');
  console.log('   Webhook URL:', N8N_WEBHOOK_URL);
  console.log('   Bot ID:', TEST_BOT_ID);
  console.log('   Customer:', testData.formData.fullName);
  console.log('   Email:', testData.formData.contact);
  console.log('   Date:', testData.formData.preferredDate);
  console.log('   Time:', testData.formData.preferredTime);
  console.log('');

  try {
    const response = await axios.post(N8N_WEBHOOK_URL, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('✅ n8n Webhook Response:');
    console.log('   Status:', response.status);
    console.log('   Success:', response.data.success);
    console.log('   Message:', response.data.message);
    
    if (response.data.calendarEvent) {
      console.log('   Calendar Event ID:', response.data.calendarEvent.eventId);
      console.log('   Calendar Link:', response.data.calendarEvent.eventLink);
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('   Check your Google Calendar for the new appointment.');

  } catch (error) {
    console.log('❌ Test failed:');
    
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   Error: Cannot connect to n8n');
      console.log('   Make sure n8n is running on https://n8n.flipthatpdf.site/');
    } else {
      console.log('   Error:', error.message);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure n8n is running: https://n8n.flipthatpdf.site/');
    console.log('   2. Check if the webhook URL is correct');
    console.log('   3. Verify the workflow is active in n8n');
    console.log('   4. Check n8n execution logs for errors');
  }
}

// Run the test
if (require.main === module) {
  testN8nWebhook().catch(console.error);
}

module.exports = { testN8nWebhook };
