const axios = require('axios');

// Test webhook data simulating Contentstack entry updates
const testWebhooks = [
  {
    event_type: 'entry.published',
    content_type_uid: 'blog_post',
    entry_uid: 'test_entry_001',
    data: {
      title: 'Test Blog Post 1',
      description: 'This is a test blog post for webhook testing',
      author: 'Test Author',
      publish_date: '2024-01-01'
    }
  },
  {
    event_type: 'entry.updated',
    content_type_uid: 'blog_post',
    entry_uid: 'test_entry_002',
    data: {
      title: 'Updated Blog Post',
      description: 'This post was updated via webhook',
      author: 'Test Author',
      last_modified: '2024-01-01T12:00:00Z'
    }
  },
  {
    event_type: 'entry.unpublished',
    content_type_uid: 'blog_post',
    entry_uid: 'test_entry_003',
    data: {
      title: 'Unpublished Post',
      description: 'This post was unpublished',
      author: 'Test Author',
      unpublished_at: '2024-01-01T15:00:00Z'
    }
  }
];

async function testWebhook(webhookData, index) {
  try {
    console.log(`\n--- Testing Webhook ${index + 1} ---`);
    console.log('Event Type:', webhookData.event_type);
    console.log('Content Type:', webhookData.content_type_uid);
    console.log('Entry UID:', webhookData.entry_uid);
    
    const response = await axios.post('http://localhost:3001/webhook', webhookData);
    
    console.log('✅ Webhook sent successfully');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error sending webhook:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Webhook Tests...');
  console.log('Make sure your server is running on port 3001');
  console.log('==============================================');
  
  // Test each webhook with a delay
  for (let i = 0; i < testWebhooks.length; i++) {
    await testWebhook(testWebhooks[i], i);
    
    // Wait 2 seconds between webhooks
    if (i < testWebhooks.length - 1) {
      console.log('⏳ Waiting 2 seconds before next webhook...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎉 All webhook tests completed!');
  console.log('Check your React app to see the received webhook data.');
}

// Check if server is running before starting tests
async function checkServer() {
  try {
    const response = await axios.get('http://localhost:3001/health');
    console.log('✅ Server is running and healthy');
    console.log('Server status:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server is not running or not accessible');
    console.error('Make sure to start the server with: npm run server');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    await runTests();
  } else {
    console.log('\n💡 To start the server:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start the server: npm run server');
    console.log('3. Run tests again: node test-webhook.js');
  }
}

main().catch(console.error);
