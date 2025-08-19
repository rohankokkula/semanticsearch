import { NextRequest, NextResponse } from 'next/server'
import { getIndexStats, getAllEntries, getEntriesByType, getEntriesByLocale } from '@/lib/contentstack'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('contentType')
    const locale = searchParams.get('locale')
    
    let entries
    if (contentType && contentType !== 'all') {
      entries = getEntriesByType(contentType)
    } else if (locale && locale !== 'all') {
      entries = getEntriesByLocale(locale)
    } else {
      entries = getAllEntries()
    }
    
    const stats = getIndexStats()
    
    return NextResponse.json({ 
      success: true,
      entries,
      stats,
      message: 'Entries retrieved successfully'
    })
  } catch (error) {
    console.error('Failed to get entries:', error)
    return NextResponse.json(
      { error: 'Failed to get entries' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, contentType, locale } = body
    
    if (action === 'list') {
      let entries
      if (contentType && contentType !== 'all') {
        entries = getEntriesByType(contentType)
      } else if (locale && locale !== 'all') {
        entries = getEntriesByLocale(locale)
      } else {
        entries = getAllEntries()
      }
      
      const stats = getIndexStats()
      
      return NextResponse.json({ 
        success: true,
        entries,
        stats,
        message: 'Entries retrieved successfully'
      })
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Invalid action' 
    })
  } catch (error) {
    console.error('Failed to process request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    )
  }
}
