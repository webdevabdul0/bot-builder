// Simple test for Gmail brochure webhook
import https from 'https';

const testData = {
  botId: "test-bot-123",
  type: "brochure_request",
  treatment: {
    name: "Teeth Whitening",
    description: "Professional teeth whitening treatments",
    brochureUrl: "https://example.com/brochure.pdf"
  },
  userEmail: "test@example.com",
  companyOwnerEmail: "owner@company.com",
  companyName: "Test Dental Clinic",
  companyPhone: "+1 (555) 123-4567",
  companyWebsite: "https://testdental.com",
  customerName: "Test Customer",
  customerPhone: "+1 (555) 987-6543",
  customerMessage: "Test brochure request",
  hasBrochureUrl: true
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'n8n.flipthatpdf.site',
  port: 443,
  path: '/webhook-test/gmail-brochure',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing Gmail Brochure Webhook');
console.log('📤 Data:', JSON.stringify(testData, null, 2));
console.log('⏳ Making request...\n');

const req = https.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('📥 Response:', responseData);
    
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: Webhook is working!');
    } else if (res.statusCode === 404) {
      console.log('⚠️  Webhook not registered. Import the workflow in n8n first.');
    } else {
      console.log('❌ Error:', res.statusCode);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.write(postData);
req.end();

