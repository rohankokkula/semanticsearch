'use client'

import { useState } from 'react'
import { ContentstackEntry } from '@/types/contentstack'

interface DemoDataProps {
  onDataLoaded: (entries: ContentstackEntry[]) => void
}

export default function DemoData({ onDataLoaded }: DemoDataProps) {
  const [isLoading, setIsLoading] = useState(false)

  const loadDemoData = () => {
    setIsLoading(true)
    
    // Simulate loading delay
    setTimeout(() => {
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

      onDataLoaded(demoEntries)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-semibold">💡</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Demo Mode Active
          </h3>
          <p className="text-blue-700 mb-4">
            This is a demonstration of the semantic search functionality. Load sample data to see how the search works with different types of content.
          </p>
          <button
            onClick={loadDemoData}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load Demo Data'}
          </button>
        </div>
      </div>
    </div>
  )
}
