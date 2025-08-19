import { NextRequest, NextResponse } from 'next/server'
import { initializeSearchIndex, getIndexStats } from '@/lib/contentstack'

export async function POST(request: NextRequest) {
  try {
    // Initialize the search index
    await initializeSearchIndex()
    
    // Get current stats
    const stats = getIndexStats()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Search index initialized successfully',
      stats
    })
  } catch (error) {
    console.error('Index initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize search index' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = getIndexStats()
    
    return NextResponse.json({ 
      success: true,
      stats
    })
  } catch (error) {
    console.error('Failed to get index stats:', error)
    return NextResponse.json(
      { error: 'Failed to get index stats' }, 
      { status: 500 }
    )
  }
}
