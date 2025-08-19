import { NextRequest, NextResponse } from 'next/server'
import { clearSearchIndex, getIndexStats } from '@/lib/contentstack'

export async function POST(request: NextRequest) {
  try {
    // Clear the search index
    clearSearchIndex()
    
    // Get current stats (should be 0)
    const stats = getIndexStats()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Search index cleared successfully',
      stats
    })
  } catch (error) {
    console.error('Failed to clear index:', error)
    return NextResponse.json(
      { error: 'Failed to clear search index' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = getIndexStats()
    
    return NextResponse.json({ 
      success: true,
      stats,
      message: 'Current index statistics'
    })
  } catch (error) {
    console.error('Failed to get index stats:', error)
    return NextResponse.json(
      { error: 'Failed to get index stats' }, 
      { status: 500 }
    )
  }
}
