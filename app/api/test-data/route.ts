import { NextRequest, NextResponse } from 'next/server'
import { handleWebhookUpdate } from '@/lib/contentstack'

export async function POST(request: NextRequest) {
  try {
    // Add some test entries to the search index
    const testEntries = [
      {
        event: 'entry.published',
        data: {
          entry: {
            uid: 'test-entry-1',
            title: 'Getting Started with Next.js',
            locale: 'en-us',
            url: '/blog/getting-started-nextjs',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            published_at: '2024-01-15T10:00:00Z',
            content: 'Learn how to build modern web applications with Next.js. This comprehensive guide covers everything from setup to deployment.',
            description: 'A complete guide to getting started with Next.js framework.',
            category: 'development',
            tags: ['nextjs', 'react', 'javascript', 'tutorial']
          },
          content_type: {
            uid: 'blog_post',
            title: 'Blog Post'
          }
        }
      },
      {
        event: 'entry.published',
        data: {
          entry: {
            uid: 'test-entry-2',
            title: 'Best Running Shoes for Beginners',
            locale: 'en-us',
            url: '/products/running-shoes-beginners',
            created_at: '2024-01-14T14:30:00Z',
            updated_at: '2024-01-14T14:30:00Z',
            published_at: '2024-01-14T14:30:00Z',
            description: 'Comfortable and affordable running shoes perfect for beginners. Features cushioned sole and breathable material.',
            price: 79.99,
            category: 'footwear',
            brand: 'SportMax',
            features: ['cushioned', 'breathable', 'lightweight'],
            sizes: ['7', '8', '9', '10', '11']
          },
          content_type: {
            uid: 'product',
            title: 'Product'
          }
        }
      },
      {
        event: 'entry.published',
        data: {
          entry: {
            uid: 'test-entry-3',
            title: 'Healthy Breakfast Ideas',
            locale: 'en-us',
            url: '/articles/healthy-breakfast-ideas',
            created_at: '2024-01-13T09:15:00Z',
            updated_at: '2024-01-13T09:15:00Z',
            published_at: '2024-01-13T09:15:00Z',
            content: 'Start your day right with these nutritious and delicious breakfast ideas. Perfect for busy mornings and healthy living.',
            author: 'Dr. Sarah Johnson',
            category: 'health',
            tags: ['nutrition', 'breakfast', 'healthy-living'],
            reading_time: '5 min read'
          },
          content_type: {
            uid: 'article',
            title: 'Article'
          }
        }
      }
    ]

    // Process each test entry through the webhook handler
    for (const entry of testEntries) {
      await handleWebhookUpdate(entry)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Added ${testEntries.length} test entries to search index`,
      entries: testEntries.map(e => e.data.entry.title)
    })
  } catch (error) {
    console.error('Test data creation error:', error)
    return NextResponse.json(
      { error: 'Failed to add test data' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test data endpoint is ready',
    info: 'POST to this endpoint to add test entries for immediate search testing'
  })
}
