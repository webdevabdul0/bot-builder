const axios = require('axios');

async function testProfileAPI() {
  console.log('🧪 Testing /api/auth/profile with X-Flossy-Environment header\n');
  
  // Your access token
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY5LCJvcmdJZCI6Mjk5LCJyb2xlSWQiOjEsInB1cnBvc2UiOiJsb2dpbiIsImlhdCI6MTc3MDQ0NzQwOX0.zBWhLDP2CyVHYrcS-2IOZyyE_R4CD3KazGll6JdqeLQ';
  
  console.log('Test 1: WITHOUT X-Flossy-Environment header (should go to dev)');
  console.log('═'.repeat(70));
  try {
    const response1 = await axios.get('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });
    console.log('Status:', response1.status);
    console.log('Response:', response1.data);
    console.log('');
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  console.log('\n━'.repeat(70));
  console.log('Test 2: WITH X-Flossy-Environment: production (should go to prod)');
  console.log('═'.repeat(70));
  try {
    const response2 = await axios.get('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Flossy-Environment': 'production'
      },
      validateStatus: () => true
    });
    console.log('Status:', response2.status);
    console.log('Response:', response2.data);
    console.log('');
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  console.log('\n✅ Check the server logs above for routing messages like:');
  console.log('   "🔵 [AUTH] Routing profile to PRODUCTION API (from header)"');
  console.log('   or');
  console.log('   "🟢 [AUTH] Routing profile to DEV API"');
}

testProfileAPI();
