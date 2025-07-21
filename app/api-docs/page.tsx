"use client"

import { useEffect } from 'react'
import Head from 'next/head'

export default function ApiDocsPage() {
  useEffect(() => {
    // Load Swagger UI
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js'
    script.onload = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
      document.head.appendChild(link)

      // Initialize Swagger UI
      const ui = (window as any).SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          (window as any).SwaggerUIBundle.presets.apis,
          (window as any).SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: 'BaseLayout',
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'list',
        filter: true,
        tryItOutEnabled: true,
        requestInterceptor: (request: any) => {
          // Add authorization header if token exists
          const token = localStorage.getItem('token')
          if (token) {
            request.headers.Authorization = `Bearer ${token}`
          }
          return request
        }
      })
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src*="swagger-ui-dist"]')
      if (existingScript) {
        existingScript.remove()
      }
      const existingLink = document.querySelector('link[href*="swagger-ui-dist"]')
      if (existingLink) {
        existingLink.remove()
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>LoyaltyPro API Documentation</title>
        <meta name="description" content="API documentation for LoyaltyPro loyalty management system" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              LoyaltyPro API Documentation
            </h1>
            <p className="text-gray-600">
              Interactive API documentation for the LoyaltyPro loyalty management system
            </p>
          </div>
          
          <div id="swagger-ui" className="bg-white rounded-lg shadow-lg" />
        </div>
      </div>
    </>
  )
} 