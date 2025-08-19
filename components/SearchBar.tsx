'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (query: string) => void
  onSearch: (query: string) => void
  isLoading: boolean
}

export default function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(inputValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for anything... (e.g., 'red high top sneakers with stripes')"
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg text-gray-900"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-500">
        <p>💡 Try natural language queries like:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>"shoes for running in the rain"</li>
          <li>"articles about healthy eating"</li>
          <li>"products under $50"</li>
        </ul>
      </div>
    </form>
  )
}
