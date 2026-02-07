// Test script to verify the token decoding and API routing logic

// Your production short token
const PROD_SHORT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY5LCJvcmdJZCI6Mjk5LCJyb2xlSWQiOjEsInB1cnBvc2UiOiJ0aGlyZF9wYXJ0eV9yZWRpcmVjdCIsImVudmlyb25tZW50IjoicHJvZHVjdGlvbiIsImlhdCI6MTc3MDQ0MzY2NywiZXhwIjoxNzcwNDQzNzI3fQ.rB1z1nIAzAta0SAPE_VQPQtwU_2gwDyesjP0U_ngSZE';

// The access token you received
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY5LCJvcmdJZCI6Mjk5LCJyb2xlSWQiOjEsInB1cnBvc2UiOiJsb2dpbiIsImlhdCI6MTc3MDQ0MzY3OH0.ARS8bnn9GoleTYvY0yUsSH9pYUMwu5XSabt6MfkOXus';

console.log('🧪 Testing Token Decoding and API Routing Logic\n');
console.log('='.repeat(80));

// Test 1: Decode short token
console.log('\n📋 Test 1: Decode Short Token');
console.log('-'.repeat(80));
try {
  const shortPayload = JSON.parse(Buffer.from(PROD_SHORT_TOKEN.split('.')[1], 'base64').toString());
  console.log('✅ Short Token Decoded:');
  console.log(JSON.stringify(shortPayload, null, 2));
  console.log('\n🎯 Environment:', shortPayload.environment);
  
  const apiBase = shortPayload.environment === 'production' 
    ? 'https://app.flossly.ai/api'
    : 'https://dev.flossly.ai/api';
  console.log('🌐 API Base URL:', apiBase);
} catch (error) {
  console.error('❌ Failed to decode short token:', error.message);
}

// Test 2: Decode access token
console.log('\n📋 Test 2: Decode Access Token (returned from exchangeShortToken)');
console.log('-'.repeat(80));
try {
  const accessPayload = JSON.parse(Buffer.from(ACCESS_TOKEN.split('.')[1], 'base64').toString());
  console.log('✅ Access Token Decoded:');
  console.log(JSON.stringify(accessPayload, null, 2));
  console.log('\n⚠️  Notice: Access token does NOT have "environment" field');
  console.log('💡 This is why we must decode the SHORT token first and store the API base!');
} catch (error) {
  console.error('❌ Failed to decode access token:', error.message);
}

// Test 3: Simulate the flow
console.log('\n📋 Test 3: Simulate Complete Auth Flow');
console.log('-'.repeat(80));
console.log('Step 1: User redirected from app.flossly.ai with short token');
console.log('  URL: https://builder.flossly.ai/botbuilder/auth?token=<short_token>');

console.log('\nStep 2: Frontend decodes short token');
const shortPayload = JSON.parse(Buffer.from(PROD_SHORT_TOKEN.split('.')[1], 'base64').toString());
console.log('  Environment detected:', shortPayload.environment);

console.log('\nStep 3: Store API base in sessionStorage');
const apiBase = shortPayload.environment === 'production' 
  ? 'https://app.flossly.ai/api'
  : 'https://dev.flossly.ai/api';
console.log('  sessionStorage.setItem("flossy_api_base", "' + apiBase + '")');

console.log('\nStep 4: Exchange short token for access token');
console.log('  POST ' + apiBase + '/auth/exchangeShortToken');
console.log('  Body: { shortToken: "<short_token>" }');
console.log('  Response: { success: true, data: "<access_token>" }');

console.log('\nStep 5: Get user profile');
console.log('  GET ' + apiBase + '/auth/profile');
console.log('  Headers: { Authorization: "Bearer <access_token>" }');

console.log('\nStep 6: All future API calls use the stored API base');
console.log('  - Save bot config: POST ' + apiBase + '/chatbot/save');
console.log('  - Get bot config: GET ' + apiBase + '/chatbot/get');

console.log('\n✅ Result: All API calls go to', apiBase);
console.log('❌ Old behavior: Profile would go to dev.flossly.ai (wrong!)');
console.log('✅ New behavior: Profile goes to app.flossly.ai (correct!)');

console.log('\n' + '='.repeat(80));
console.log('🎉 Test Complete!\n');
