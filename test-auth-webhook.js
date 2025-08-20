const axios = require('axios');

// Test webhook data simulating Contentstack entry updates
const testWebhookData = {
  module: "entry",
  api_key: "blt04b62eff2051e343",
  event: "publish",
  bulk: false,
  data: {
    locale: "en-us",
    status: "success",
    action: "publish",
    entry: {
      uid: "test_entry_001",
      title: "Test Entry with Auth",
      content_type: { uid: "blog_post", title: "Blog Post" }
    }
  }
};

// Authentication credentials
const username = 'username';
const password = 'password';

// Create base64 encoded credentials
const credentials = Buffer.from(`${username}:${password}`).toString('base64');

async function testAuthenticatedWebhook() {
  try {
    console.log('🔐 Testing Authenticated Webhook...');
    console.log('URL: https://semanticsearch.contentstackapps.com/api/webhook');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('==============================================');
    
    const response = await axios.post(
      'https://semanticsearch.contentstackapps.com/api/webhook',
      testWebhookData,
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Webhook sent successfully with authentication!');
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Error Response:', error.response.status);
      console.error('Error Message:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('🔒 Authentication failed. Check your username and password.');
      }
    } else {
      console.error('❌ Network Error:', error.message);
    }
  }
}

async function testUnauthenticatedWebhook() {
  try {
    console.log('\n🚫 Testing Unauthenticated Webhook...');
    console.log('This should fail with 401 Unauthorized');
    console.log('==============================================');
    
    const response = await axios.post(
      'https://semanticsearch.contentstackapps.com/api/webhook',
      testWebhookData,
      {
        headers: {
          'Content-Type': 'application/json'
          // No Authorization header
        }
      }
    );
    
    console.log('❌ This should have failed! Response:', response.data);
    
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected unauthenticated request (401 Unauthorized)');
      console.log('Response:', error.response.data);
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Tests...');
  console.log('Make sure your app is deployed and accessible');
  console.log('==============================================');
  
  // Test authenticated webhook
  await testAuthenticatedWebhook();
  
  // Test unauthenticated webhook
  await testUnauthenticatedWebhook();
  
  console.log('\n🎉 Authentication tests completed!');
  console.log('\n💡 To use in Contentstack:');
  console.log('1. Go to Settings > Webhooks');
  console.log('2. URL: https://semanticsearch.contentstackapps.com/api/webhook');
  console.log('3. Add Basic Auth with username: "username" and password: "password"');
}

// Main execution
runTests().catch(console.error);
