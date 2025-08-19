import { NextRequest, NextResponse } from 'next/server'
import { handleWebhookUpdate } from '@/lib/contentstack'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body
    
    // Simulate a Contentstack webhook call
    const webhookData = {
      event: event || 'entry.published',
      data: data || {
        entry: {
          uid: `test-${Date.now()}`,
          title: 'Test Entry from Webhook',
          locale: 'en-us',
          url: '/test-entry',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          content: 'This is a test entry created via webhook simulation.',
          description: 'Test entry for webhook functionality',
          category: 'test'
        },
        content_type: {
          uid: 'test_entry',
          title: 'Test Entry'
        }
      }
    }
    
    // Process the webhook
    await handleWebhookUpdate(webhookData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      webhookData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json(
      { error: 'Failed to process test webhook' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook test endpoint is ready',
    info: 'POST to this endpoint with event and data to simulate webhook calls',
    example: {
      event: 'entry.published',
      data: {
        entry: {
          uid: 'test-123',
          title: 'Test Entry',
          locale: 'en-us',
          content: 'Test content'
        },
        content_type: {
          uid: 'test_entry',
          title: 'Test Entry'
        }
      }
    }
  })
}
