/**
 * Test OAuth Configuration
 * This script tests the Google OAuth setup
 */

const { google } = require('googleapis');

// Your OAuth credentials - Replace with your actual credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:3001/oauth2/callback';

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

async function testOAuthConfig() {
  console.log('🔍 Testing Google OAuth Configuration...\n');
  
  console.log('📋 Configuration:');
  console.log(`   Client ID: ${GOOGLE_CLIENT_ID}`);
  console.log(`   Client Secret: ${GOOGLE_CLIENT_SECRET.substring(0, 10)}...`);
  console.log(`   Redirect URI: ${REDIRECT_URI}\n`);
  
  // Test 1: Generate OAuth URL
  console.log('1️⃣ Testing OAuth URL generation...');
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
      prompt: 'consent',
      state: 'test-bot-123'
    });
    console.log('✅ OAuth URL generated successfully');
    console.log(`   URL: ${authUrl}\n`);
  } catch (error) {
    console.log('❌ Failed to generate OAuth URL:', error.message);
    return;
  }
  
  // Test 2: Test with a dummy authorization code (this will fail but show us the error)
  console.log('2️⃣ Testing token exchange with dummy code...');
  try {
    const { tokens } = await oauth2Client.getToken('dummy-code');
    console.log('✅ Token exchange successful (unexpected!)');
  } catch (error) {
    console.log('✅ Token exchange failed as expected (dummy code)');
    console.log(`   Error type: ${error.code || 'Unknown'}`);
    console.log(`   Error message: ${error.message}`);
    
    // Check if it's a redirect URI mismatch
    if (error.message.includes('redirect_uri_mismatch')) {
      console.log('\n❌ REDIRECT URI MISMATCH!');
      console.log('   The redirect URI in Google Cloud Console does not match:');
      console.log(`   Expected: ${REDIRECT_URI}`);
      console.log('   Please check your Google Cloud Console settings.');
    } else if (error.message.includes('invalid_grant')) {
      console.log('\n❌ INVALID GRANT!');
      console.log('   This usually means the authorization code is invalid or expired.');
      console.log('   This is normal for a dummy code.');
    } else if (error.message.includes('invalid_client')) {
      console.log('\n❌ INVALID CLIENT!');
      console.log('   Check your Client ID and Client Secret in Google Cloud Console.');
    }
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Make sure the redirect URI is configured in Google Cloud Console');
  console.log('   2. Try the OAuth flow again with a real authorization code');
  console.log('   3. Check the server logs for detailed error information');
}

// Run the test
if (require.main === module) {
  testOAuthConfig().catch(console.error);
}

module.exports = { testOAuthConfig };
