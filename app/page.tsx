'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'
import DemoData from '@/components/DemoData'
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
        </div>

        {/* Demo Data Section */}
        <DemoData onDataLoaded={(entries) => {
          // Store demo entries in local state for search
          // In production, this would be handled by the Contentstack integration
          console.log('Demo data loaded:', entries.length, 'entries')
        }} />

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
