'use client'

import { ContentstackEntry } from '@/types/contentstack'
import { Calendar, Globe, FileText, Star, ExternalLink } from 'lucide-react'

interface SearchResultsProps {
  results: ContentstackEntry[]
  isLoading: boolean
  query: string
}

export default function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Searching for "{query}"...</p>
      </div>
    )
  }

  if (!query.trim()) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Search className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search</h3>
        <p className="text-gray-600">Enter a query above to find relevant content</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FileText className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">
          We couldn't find any content matching "{query}". Try different keywords or check your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Search Results ({results.length})
        </h2>
        <p className="text-sm text-gray-500">
          Showing results for "{query}"
        </p>
      </div>

      <div className="space-y-4">
        {results.map((entry, index) => (
          <SearchResultCard key={entry.uid} entry={entry} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

function SearchResultCard({ entry, rank }: { entry: ContentstackEntry; rank: number }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getContentPreview = (fields: Record<string, any>) => {
    // Try to get content from common field names
    const contentFields = ['content', 'body', 'description', 'summary', 'text']
    for (const field of contentFields) {
      if (fields[field] && typeof fields[field] === 'string') {
        return fields[field].substring(0, 200) + '...'
      }
    }
    return 'Content preview not available'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            {rank}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {entry.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span className="capitalize">{entry.content_type_uid.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{entry.locale}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(entry.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {entry.similarity_score && (
          <div className="flex items-center space-x-1 text-sm">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium text-gray-700">
              {Math.round(entry.similarity_score * 100)}%
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">
        {getContentPreview(entry.fields)}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            UID: {entry.uid}
          </span>
          {entry.published_at && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Published
            </span>
          )}
        </div>
        
        <a
          href={entry.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          <span>View Entry</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

// Import Search icon for the no query state
import { Search } from 'lucide-react'
