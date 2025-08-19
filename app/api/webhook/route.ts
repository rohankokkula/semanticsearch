import { NextRequest, NextResponse } from 'next/server'
import { handleWebhookUpdate } from '@/lib/contentstack'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature (you should implement proper verification)
    // const signature = request.headers.get('x-contentstack-signature')
    // if (!verifyWebhookSignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }
    
    // Handle the webhook update
    await handleWebhookUpdate(body)
    
    // Log webhook event
    console.log('Webhook received:', {
      event: body.event,
      contentType: body.data?.content_type?.uid,
      entryUid: body.data?.entry?.uid,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is active',
    status: 'ready'
  })
}
