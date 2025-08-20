const axios = require('axios');

// Webhook.site URL for testing
const WEBHOOK_SITE_URL = 'https://webhook.site/87b06a47-37af-4d23-805d-f407d3299858';

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
    console.log('Sending to:', WEBHOOK_SITE_URL);
    
    const response = await axios.post(WEBHOOK_SITE_URL, webhookData);
    
    console.log('✅ Webhook sent successfully');
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    
  } catch (error) {
    console.error('❌ Error sending webhook:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Webhook Tests to Webhook.site...');
  console.log('Webhook URL:', WEBHOOK_SITE_URL);
  console.log('==============================================');
  
  // Test each webhook with a delay
  for (let i = 0; i < testWebhooks.length; i++) {
    await testWebhook(testWebhooks[i], i);
    
    // Wait 3 seconds between webhooks
    if (i < testWebhooks.length - 1) {
      console.log('⏳ Waiting 3 seconds before next webhook...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🎉 All webhook tests completed!');
  console.log('📱 Check your webhook.site page to see the received webhook data:');
  console.log(WEBHOOK_SITE_URL);
  console.log('\n💡 You can now:');
  console.log('1. View the webhook data on webhook.site');
  console.log('2. Copy the data structure to understand the format');
  console.log('3. Use this data to test your local React app manually');
}

// Main execution
runTests().catch(console.error);
