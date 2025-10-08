// Complete payload test script for Flossy webhooks
import https from 'https';

// Test data for brochure request with brochure URL
const brochurePayloadWithUrl = {
  // Bot identification
  botId: "bot-12345",
  botName: "Bright Smile Dental Bot",
  timestamp: new Date().toISOString(),
  
  // Request type
  type: "brochure_request",
  
  // Treatment information
  treatment: {
    id: "treatment-uuid-123",
    name: "Teeth Whitening",
    description: "Professional teeth whitening treatments for a brighter smile",
    brochureUrl: "https://example.com/teeth-whitening-brochure.pdf",
    hasBrochureUrl: true
  },
  
  // Customer information
  customer: {
    email: "john.doe@example.com",
    name: "John Doe",
    phone: "+1 (555) 987-6543",
    message: "Requested brochure for Teeth Whitening treatment"
  },
  
  // Company information
  company: {
    name: "Bright Smile Dental Clinic",
    ownerEmail: "owner@brightsmile.com",
    phone: "+1 (555) 123-4567",
    website: "https://brightsmiledental.com",
    address: "123 Main St, City, State 12345",
    tagline: "Your Smile, Our Priority",
    logo: "https://brightsmiledental.com/logo.png"
  },
  
  // Legacy fields for compatibility
  userEmail: "john.doe@example.com",
  companyOwnerEmail: "owner@brightsmile.com",
  companyName: "Bright Smile Dental Clinic",
  companyPhone: "+1 (555) 123-4567",
  companyWebsite: "https://brightsmiledental.com",
  customerName: "John Doe",
  customerPhone: "+1 (555) 987-6543",
  customerMessage: "Requested brochure for Teeth Whitening treatment",
  hasBrochureUrl: true
};

// Test data for brochure request without brochure URL
const brochurePayloadWithoutUrl = {
  // Bot identification
  botId: "bot-67890",
  botName: "Elite Dental Bot",
  timestamp: new Date().toISOString(),
  
  // Request type
  type: "brochure_request",
  
  // Treatment information
  treatment: {
    id: "treatment-uuid-456",
    name: "Dental Implants",
    description: "Permanent tooth replacement solutions",
    brochureUrl: "",
    hasBrochureUrl: false
  },
  
  // Customer information
  customer: {
    email: "jane.smith@example.com",
    name: "Jane Smith",
    phone: "+1 (555) 987-6543",
    message: "Requested brochure for Dental Implants treatment"
  },
  
  // Company information
  company: {
    name: "Elite Dental Practice",
    ownerEmail: "owner@elitedental.com",
    phone: "+1 (555) 456-7890",
    website: "https://elitedental.com",
    address: "456 Oak Ave, City, State 54321",
    tagline: "Excellence in Dental Care",
    logo: "https://elitedental.com/logo.png"
  },
  
  // Legacy fields for compatibility
  userEmail: "jane.smith@example.com",
  companyOwnerEmail: "owner@elitedental.com",
  companyName: "Elite Dental Practice",
  companyPhone: "+1 (555) 456-7890",
  companyWebsite: "https://elitedental.com",
  customerName: "Jane Smith",
  customerPhone: "+1 (555) 987-6543",
  customerMessage: "Requested brochure for Dental Implants treatment",
  hasBrochureUrl: false
};

// Test data for callback request
const callbackPayload = {
  // Bot identification
  botId: "bot-11111",
  botName: "Family Dental Bot",
  timestamp: new Date().toISOString(),
  
  // Request type
  type: "callback_request",
  
  // Customer information
  customer: {
    name: "Mike Johnson",
    phone: "+1 (555) 123-4567",
    email: "mike.johnson@example.com",
    message: "Callback requested for: Interested in orthodontic treatment"
  },
  
  // Callback details
  callback: {
    reason: "Interested in orthodontic treatment",
    preferredTime: "Afternoon",
    urgency: "Normal",
    status: "pending"
  },
  
  // Company information
  company: {
    name: "Family Dental Care",
    ownerEmail: "owner@familydental.com",
    phone: "+1 (555) 789-0123",
    website: "https://familydental.com",
    address: "789 Pine St, City, State 98765",
    tagline: "Caring for Your Family's Smiles",
    logo: "https://familydental.com/logo.png"
  },
  
  // Legacy fields for compatibility
  customerName: "Mike Johnson",
  customerPhone: "+1 (555) 123-4567",
  customerEmail: "mike.johnson@example.com",
  callbackReason: "Interested in orthodontic treatment",
  preferredTime: "Afternoon",
  companyOwnerEmail: "owner@familydental.com",
  companyName: "Family Dental Care",
  companyPhone: "+1 (555) 789-0123",
  companyWebsite: "https://familydental.com",
  customerMessage: "Callback requested for: Interested in orthodontic treatment",
  urgency: "Normal"
};

// Function to make POST request
function testWebhook(data, webhookUrl, testName) {
  const postData = JSON.stringify(data);
  
  const options = {
    hostname: 'n8n.flipthatpdf.site',
    port: 443,
    path: webhookUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(`\n🧪 Testing: ${testName}`);
  console.log('📤 Bot ID:', data.botId);
  console.log('📤 Company:', data.company.name);
  console.log('📤 Customer:', data.customer.email);
  console.log('🌐 URL: https://n8n.flipthatpdf.site' + webhookUrl);
  console.log('⏳ Making request...\n');

  const req = https.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('📥 Response:', responseData);
      
      if (res.statusCode === 200) {
        console.log('✅ SUCCESS: Webhook processed successfully!');
      } else if (res.statusCode === 404) {
        console.log('⚠️  Webhook not registered. Import the workflow in n8n first.');
      } else {
        console.log('❌ Error:', res.statusCode);
      }
      console.log('─'.repeat(60));
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request failed:', e.message);
  });

  req.write(postData);
  req.end();
}

// Run all tests
console.log('🚀 Flossy Webhook Payload Tests');
console.log('=' .repeat(60));

// Test 1: Brochure request with URL
testWebhook(brochurePayloadWithUrl, '/webhook-test/gmail-brochure', 'Brochure Request with URL');

// Wait 2 seconds between tests
setTimeout(() => {
  // Test 2: Brochure request without URL
  testWebhook(brochurePayloadWithoutUrl, '/webhook-test/gmail-brochure', 'Brochure Request without URL');
}, 2000);

setTimeout(() => {
  // Test 3: Callback request
  testWebhook(callbackPayload, '/webhook-test/gmail-callback', 'Callback Request');
}, 4000);

setTimeout(() => {
  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Summary:');
  console.log('• Bot-specific payloads with complete company information');
  console.log('• Structured data for easy n8n processing');
  console.log('• Legacy field compatibility maintained');
  console.log('• Professional email templates ready');
}, 6000);
