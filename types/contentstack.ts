export interface ContentstackEntry {
  uid: string
  title: string
  content_type_uid: string
  locale: string
  url: string
  created_at: string
  updated_at: string
  published_at?: string
  similarity_score?: number
  fields: Record<string, any>
}

export interface SearchFilters {
  contentType?: string
  locale?: string
  limit?: number
  skip?: number
}

export interface SearchResult {
  entry: ContentstackEntry
  score: number
  highlights?: string[]
}

export interface WebhookPayload {
  event: 'entry.published' | 'entry.unpublished' | 'entry.deleted' | 'entry.updated'
  data: {
    entry: ContentstackEntry
    content_type: {
      uid: string
      title: string
    }
  }
  environment: string
  timestamp: string
}

export interface EmbeddingData {
  entry_uid: string
  content_type_uid: string
  locale: string
  embedding: number[]
  text_content: string
  last_updated: string
}
