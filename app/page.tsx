'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'

import { ContentstackEntry } from '@/types/contentstack'
import { searchEntries } from '@/lib/contentstack'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ContentstackEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [contentTypes, setContentTypes] = useState<string[]>([])
  const [selectedContentType, setSelectedContentType] = useState<string>('all')
  const [locales, setLocales] = useState<string[]>([])
  const [selectedLocale, setSelectedLocale] = useState<string>('all')

  useEffect(() => {
    // Initialize with sample content types and locales
    // In production, these would come from Contentstack API
    setContentTypes(['blog_post', 'product', 'article', 'page'])
    setLocales(['en-us', 'es-es', 'fr-fr'])
  }, [])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      // For demo purposes, we'll do a simple search through loaded entries
      // In production, this would call the Contentstack search function
      const results = await searchEntries(query, {
        contentType: selectedContentType === 'all' ? undefined : selectedContentType,
        locale: selectedLocale === 'all' ? undefined : selectedLocale,
      })
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQueryChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      handleSearch(query)
    } else {
      setSearchResults([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contentstack Semantic Search
          </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find content using natural language. Our AI understands what you're looking for, 
          not just the exact words you type.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>🔗 Connected to Contentstack - Search your actual content in real-time</p>
        </div>
        
        {/* Test Data Section */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/test-data', { method: 'POST' })
                const data = await response.json()
                if (data.success) {
                  alert(`Added ${data.entries.length} test entries: ${data.entries.join(', ')}`)
                }
              } catch (error) {
                console.error('Failed to load test data:', error)
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Load Test Data
          </button>
          
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/entries')
                const data = await response.json()
                if (data.success) {
                  setSearchResults(data.entries)
                  setSearchQuery('All Entries')
                }
              } catch (error) {
                console.error('Failed to get entries:', error)
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            List All Entries
          </button>
          
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/test-webhook', { 
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    event: 'entry.published',
                    data: {
                      entry: {
                        uid: `webhook-test-${Date.now()}`,
                        title: 'Webhook Test Entry',
                        locale: 'en-us',
                        url: '/webhook-test',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        published_at: new Date().toISOString(),
                        content: 'This entry was created via webhook simulation.',
                        description: 'Testing webhook functionality',
                        category: 'webhook-test'
                      },
                      content_type: {
                        uid: 'webhook_test',
                        title: 'Webhook Test'
                      }
                    }
                  })
                })
                const data = await response.json()
                if (data.success) {
                  alert('Webhook test successful! Entry added to index.')
                }
              } catch (error) {
                console.error('Failed to test webhook:', error)
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Test Webhook
          </button>
          
          <span className="text-sm text-gray-500 self-center">
            (Use these buttons to test the search functionality)
          </span>
        </div>
        </div>



        {/* Search Interface */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <SearchBar 
            value={searchQuery}
            onChange={handleQueryChange}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          
          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Content Type:</label>
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Locale:</label>
              <select
                value={selectedLocale}
                onChange={(e) => setSelectedLocale(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Locales</option>
                {locales.map(locale => (
                  <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <SearchResults 
          results={searchResults}
          isLoading={isLoading}
          query={searchQuery}
        />
      </div>
    </div>
  )
}
