import Contentstack from 'contentstack'
import { ContentstackEntry, SearchFilters } from '@/types/contentstack'

// Initialize Contentstack delivery client
const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY || '',
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'development',
})

// Note: Management operations require the Contentstack Management SDK
// For now, we'll use demo data and provide a structure for future integration

// In-memory storage for demo purposes
// In production, you'd use a proper vector database like FAISS, Pinecone, or Weaviate
let searchIndex: Map<string, ContentstackEntry> = new Map()
let embeddingsIndex: Map<string, number[]> = new Map()

// Search index will be populated from Contentstack webhooks and API calls

/**
 * Search entries using semantic similarity
 * For now, this is a simple implementation that will be enhanced with embeddings
 */
export async function searchEntries(
  query: string, 
  filters: SearchFilters = {}
): Promise<ContentstackEntry[]> {
  try {
    // If no entries in index, try to fetch from Contentstack
    if (searchIndex.size === 0) {
      await initializeSearchIndex()
    }
    
    const allEntries = Array.from(searchIndex.values())
    let filteredEntries = allEntries

    // Apply filters
    if (filters.contentType) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.content_type_uid === filters.contentType
      )
    }

    if (filters.locale) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.locale === filters.locale
      )
    }

    // Simple text search (can be enhanced with vector similarity)
    const queryLower = query.toLowerCase()
    const scoredEntries = filteredEntries
      .map(entry => {
        const titleScore = entry.title.toLowerCase().includes(queryLower) ? 0.8 : 0
        const contentScore = searchInFields(entry.fields, queryLower) ? 0.6 : 0
        const totalScore = titleScore + contentScore
        
        return {
          ...entry,
          similarity_score: totalScore
        }
      })
      .filter(entry => entry.similarity_score > 0)
      .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))

    return scoredEntries.slice(0, filters.limit || 20)
  } catch (error) {
    console.error('Search error:', error)
    throw new Error('Failed to search entries')
  }
}

/**
 * Search within entry fields for demo purposes
 */
function searchInFields(fields: Record<string, any>, query: string): boolean {
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string' && value.toLowerCase().includes(query)) {
      return true
    }
    if (typeof value === 'object' && value !== null) {
      if (searchInFields(value, query)) {
        return true
      }
    }
  }
  return false
}

/**
 * Fetch entries from Contentstack and add to search index
 */
export async function fetchAndIndexEntries(contentType?: string) {
  try {
    if (!process.env.CONTENTSTACK_API_KEY || !process.env.CONTENTSTACK_DELIVERY_TOKEN) {
      console.log('Contentstack credentials not configured, skipping entry fetch')
      return 0
    }

    // For now, we'll rely on webhook updates to populate the index
    // This function can be enhanced later with proper Contentstack API calls
    console.log(`Contentstack integration ready for webhook updates`)
    
    return searchIndex.size
  } catch (error) {
    console.error('Failed to fetch entries from Contentstack:', error)
    throw error
  }
}

/**
 * Get all content types from the stack
 */
export async function getContentTypes() {
  try {
    // For demo purposes, return sample content types
    // In production, this would use the Contentstack Management SDK
    return [
      { uid: 'product', title: 'Product' },
      { uid: 'article', title: 'Article' },
      { uid: 'blog_post', title: 'Blog Post' },
      { uid: 'page', title: 'Page' }
    ]
  } catch (error) {
    console.error('Failed to fetch content types:', error)
    return []
  }
}

/**
 * Get all locales from the stack
 */
export async function getLocales() {
  try {
    // For demo purposes, return sample locales
    // In production, this would use the Contentstack Management SDK
    return [
      { code: 'en-us', name: 'English (US)' },
      { code: 'es-es', name: 'Spanish (Spain)' },
      { code: 'fr-fr', name: 'French (France)' }
    ]
  } catch (error) {
    console.error('Failed to fetch locales:', error)
    return []
  }
}

/**
 * Handle webhook updates to keep search index in sync
 */
export async function handleWebhookUpdate(webhookData: any) {
  try {
    const { event, data } = webhookData
    
    switch (event) {
      case 'entry.published':
      case 'entry.updated':
        // Update or add entry to index
        const entry: ContentstackEntry = {
          uid: data.entry.uid,
          title: data.entry.title || data.entry.uid,
          content_type_uid: data.content_type.uid,
          locale: data.entry.locale,
          url: data.entry.url || '',
          created_at: data.entry.created_at,
          updated_at: data.entry.updated_at,
          published_at: data.entry.published_at,
          fields: data.entry
        }
        
        searchIndex.set(entry.uid, entry)
        console.log(`Indexed entry: ${entry.uid}`)
        break
        
      case 'entry.unpublished':
      case 'entry.deleted':
        // Remove entry from index
        searchIndex.delete(data.entry.uid)
        embeddingsIndex.delete(data.entry.uid)
        console.log(`Removed entry from index: ${data.entry.uid}`)
        break
    }
  } catch (error) {
    console.error('Webhook handling error:', error)
  }
}

/**
 * Initialize the search index with existing content
 */
export async function initializeSearchIndex() {
  try {
    console.log('Initializing search index...')
    
    // Get all content types
    const contentTypes = await getContentTypes()
    
    // Index entries from each content type
    for (const contentType of contentTypes) {
      await fetchAndIndexEntries(contentType.uid)
    }
    
    console.log(`Search index initialized with ${searchIndex.size} entries`)
  } catch (error) {
    console.error('Failed to initialize search index:', error)
  }
}

/**
 * Get search index statistics
 */
export function getIndexStats() {
  return {
    totalEntries: searchIndex.size,
    totalEmbeddings: embeddingsIndex.size,
    contentTypes: Array.from(new Set(Array.from(searchIndex.values()).map(e => e.content_type_uid))),
    locales: Array.from(new Set(Array.from(searchIndex.values()).map(e => e.locale)))
  }
}
