// Test script for Gmail brochure webhook
import https from 'https';

// Test data for brochure request with brochure URL
const testDataWithBrochure = {
  botId: "test-bot-123",
  type: "brochure_request",
  treatment: {
    name: "Teeth Whitening",
    description: "Professional teeth whitening treatments for a brighter smile",
    brochureUrl: "https://example.com/teeth-whitening-brochure.pdf"
  },
  userEmail: "test.customer@example.com",
  companyOwnerEmail: "owner@dentalclinic.com",
  companyName: "Bright Smile Dental Clinic",
  companyPhone: "+1 (555) 123-4567",
  companyWebsite: "https://brightsmiledental.com",
  customerName: "John Doe",
  customerPhone: "+1 (555) 987-6543",
  customerMessage: "Requested brochure for Teeth Whitening treatment",
  hasBrochureUrl: true
};

// Test data for brochure request without brochure URL
const testDataWithoutBrochure = {
  botId: "test-bot-456",
  type: "brochure_request",
  treatment: {
    name: "Dental Implants",
    description: "Permanent tooth replacement solutions",
    brochureUrl: ""
  },
  userEmail: "jane.smith@example.com",
  companyOwnerEmail: "owner@dentalclinic.com",
  companyName: "Bright Smile Dental Clinic",
  companyPhone: "+1 (555) 123-4567",
  companyWebsite: "https://brightsmiledental.com",
  customerName: "Jane Smith",
  customerPhone: "+1 (555) 987-6543",
  customerMessage: "Requested brochure for Dental Implants treatment",
  hasBrochureUrl: false
};

// Function to make POST request
function testWebhook(data, testName) {
  const postData = JSON.stringify(data);
  
  const options = {
    hostname: 'n8n.flossly.ai',
    port: 443,
    path: '/webhook-test/gmail-brochure',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(`\n🧪 Testing: ${testName}`);
  console.log('📤 Sending data:', JSON.stringify(data, null, 2));
  console.log('🌐 URL: https://n8n.flossly.ai/webhook-test/gmail-brochure');
  console.log('⏳ Making request...\n');

  const req = https.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('📥 Response Body:', responseData);
      console.log('✅ Request completed successfully!\n');
    });
  });

  req.on('error', (e) => {
    console.error('❌ Error making request:', e.message);
  });

  req.write(postData);
  req.end();
}

// Run tests
console.log('🚀 Starting Gmail Brochure Webhook Tests');
console.log('=' .repeat(50));

// Test 1: Brochure request with URL
testWebhook(testDataWithBrochure, "Brochure Request with URL");

// Wait 2 seconds between tests
setTimeout(() => {
  // Test 2: Brochure request without URL
  testWebhook(testDataWithoutBrochure, "Brochure Request without URL");
}, 2000);
