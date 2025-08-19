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

// Demo data for testing
const demoEntries: ContentstackEntry[] = [
  {
    uid: 'demo-1',
    title: 'Red High Top Sneakers with Stripes',
    content_type_uid: 'product',
    locale: 'en-us',
    url: '#',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    published_at: '2024-01-15T10:00:00Z',
    fields: {
      title: 'Red High Top Sneakers with Stripes',
      description: 'Stylish red high top sneakers featuring bold white stripes. Perfect for casual wear and street style.',
      price: 89.99,
      category: 'footwear',
      colors: ['red', 'white'],
      sizes: ['7', '8', '9', '10', '11'],
      brand: 'StreetStyle',
      material: 'canvas',
      features: ['breathable', 'durable', 'stylish']
    }
  },
  {
    uid: 'demo-2',
    title: 'Healthy Eating Guide for Beginners',
    content_type_uid: 'article',
    locale: 'en-us',
    url: '#',
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    published_at: '2024-01-14T14:30:00Z',
    fields: {
      title: 'Healthy Eating Guide for Beginners',
      content: 'Starting your healthy eating journey can be overwhelming. This comprehensive guide covers the basics of nutrition, meal planning, and sustainable habits.',
      author: 'Dr. Sarah Johnson',
      category: 'health',
      tags: ['nutrition', 'beginners', 'healthy-living', 'meal-planning'],
      reading_time: '8 min read',
      difficulty: 'beginner'
    }
  },
  {
    uid: 'demo-3',
    title: 'Budget-Friendly Home Decor Under $50',
    content_type_uid: 'blog_post',
    locale: 'en-us',
    url: '#',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    published_at: '2024-01-13T09:15:00Z',
    fields: {
      title: 'Budget-Friendly Home Decor Under $50',
      summary: 'Transform your living space without breaking the bank. Discover affordable decor ideas that look expensive but cost less than $50.',
      content: 'Decorating your home doesn\'t have to be expensive. With some creativity and smart shopping, you can create a beautiful space on a budget.',
      author: 'Emma Chen',
      category: 'home-decor',
      price_range: 'under-50',
      difficulty: 'easy',
      time_required: '2-4 hours'
    }
  },
  {
    uid: 'demo-4',
    title: 'Running Shoes for Rainy Weather',
    content_type_uid: 'product',
    locale: 'en-us',
    url: '#',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    published_at: '2024-01-12T16:45:00Z',
    fields: {
      title: 'Running Shoes for Rainy Weather',
      description: 'Waterproof running shoes designed specifically for wet conditions. Features include water-resistant upper, slip-resistant sole, and quick-dry technology.',
      price: 129.99,
      category: 'athletic-footwear',
      colors: ['black', 'blue', 'gray'],
      sizes: ['6', '7', '8', '9', '10', '11', '12'],
      brand: 'RunTech',
      material: 'synthetic',
      features: ['waterproof', 'slip-resistant', 'quick-dry', 'breathable'],
      weather_conditions: ['rain', 'wet', 'damp']
    }
  },
  {
    uid: 'demo-5',
    title: 'Getting Started with Content Management',
    content_type_uid: 'page',
    locale: 'en-us',
    url: '#',
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z',
    published_at: '2024-01-11T11:20:00Z',
    fields: {
      title: 'Getting Started with Content Management',
      content: 'Learn the fundamentals of content management systems. This guide covers content creation, organization, publishing workflows, and best practices.',
      audience: 'beginners',
      category: 'content-management',
      difficulty: 'beginner',
      estimated_time: '15 minutes',
      prerequisites: 'none',
      learning_objectives: ['Understand CMS basics', 'Learn content workflows', 'Master publishing processes']
    }
  }
]

// Initialize demo data
demoEntries.forEach(entry => {
  searchIndex.set(entry.uid, entry)
})

/**
 * Search entries using semantic similarity
 * For now, this is a simple implementation that will be enhanced with embeddings
 */
export async function searchEntries(
  query: string, 
  filters: SearchFilters = {}
): Promise<ContentstackEntry[]> {
  try {
    // For demo purposes, we'll do a simple text search
    // In production, this would use vector similarity search
    
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

    // Simple text search for demo
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
    // For demo purposes, we'll use the existing demo data
    // In production, this would use the Contentstack Delivery API
    console.log(`Would fetch entries for content type: ${contentType || 'all'}`)
    
    // Return the count of already indexed demo entries
    return searchIndex.size
  } catch (error) {
    console.error('Failed to fetch entries:', error)
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
