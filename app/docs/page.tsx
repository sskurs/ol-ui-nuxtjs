"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Copy, Play, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ApiEndpoint {
  method: string
  path: string
  description: string
  auth: boolean
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  requestBody?: {
    type: string
    description: string
    example: string
  }
  response: {
    type: string
    description: string
    example: string
  }
}

const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate user and get JWT token',
    auth: false,
    requestBody: {
      type: 'application/json',
      description: 'Login credentials',
      example: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      }, null, 2)
    },
    response: {
      type: 'application/json',
      description: 'Login response with token',
      example: JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      }, null, 2)
    }
  },
  {
    method: 'GET',
    path: '/api/admin/analytics/customers',
    description: 'Get total customer count',
    auth: true,
    response: {
      type: 'application/json',
      description: 'Customer statistics',
      example: JSON.stringify({
        total: 3
      }, null, 2)
    }
  },
  {
    method: 'GET',
    path: '/api/admin/analytics',
    description: 'Get comprehensive system analytics',
    auth: true,
    response: {
      type: 'application/json',
      description: 'System analytics',
      example: JSON.stringify({
        totalMembers: 3,
        activePartners: 5,
        pointsCirculating: 2140,
        systemRevenue: 125000,
        monthlyGrowth: [
          { month: 'Jan', members: 1200, revenue: 10000 },
          { month: 'Feb', members: 1350, revenue: 12000 }
        ]
      }, null, 2)
    }
  },
  {
    method: 'GET',
    path: '/api/admin/members',
    description: 'Get paginated list of members',
    auth: true,
    parameters: [
      {
        name: 'page',
        type: 'integer',
        required: false,
        description: 'Page number (default: 1)'
      },
      {
        name: 'perPage',
        type: 'integer',
        required: false,
        description: 'Items per page (default: 10)'
      },
      {
        name: 'search',
        type: 'string',
        required: false,
        description: 'Search term'
      }
    ],
    response: {
      type: 'application/json',
      description: 'Paginated members list',
      example: JSON.stringify({
        members: [
          {
            id: 'demo-customer-002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            points: 1250,
            tier: 'Gold',
            status: 'active'
          }
        ],
        total: 3,
        page: 1,
        perPage: 10,
        totalPages: 1
      }, null, 2)
    }
  },
  {
    method: 'POST',
    path: '/api/admin/members',
    description: 'Create a new member',
    auth: true,
    requestBody: {
      type: 'application/json',
      description: 'Member data',
      example: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        gender: 'male',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        }
      }, null, 2)
    },
    response: {
      type: 'application/json',
      description: 'Created member',
      example: JSON.stringify({
        message: 'Member created successfully',
        member: {
          id: 'demo-customer-1234567890',
          name: 'John Doe',
          email: 'john.doe@example.com',
          points: 0,
          tier: 'Bronze',
          status: 'active'
        }
      }, null, 2)
    }
  }
]

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiEndpoints[0])
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const handleTestEndpoint = async () => {
    setIsLoading(true)
    setResponse('')

    try {
      const token = localStorage.getItem('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (selectedEndpoint.auth && token) {
        headers.Authorization = `Bearer ${token}`
      }

      const url = new URL(selectedEndpoint.path, window.location.origin)
      
      // Add query parameters if they exist
      if (selectedEndpoint.parameters) {
        selectedEndpoint.parameters.forEach(param => {
          if (param.name === 'page') url.searchParams.set('page', '1')
          if (param.name === 'perPage') url.searchParams.set('perPage', '10')
          if (param.name === 'search') url.searchParams.set('search', '')
        })
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers
      }

      if (selectedEndpoint.requestBody && requestBody) {
        options.body = requestBody
      }

      const res = await fetch(url.toString(), options)
      const data = await res.json()

      setResponse(JSON.stringify(data, null, 2))
      
      if (!res.ok) {
        toast({
          title: 'Error',
          description: `Request failed: ${res.status} ${res.statusText}`,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Success',
          description: 'Request completed successfully'
        })
      }
    } catch (error) {
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }, null, 2))
      toast({
        title: 'Error',
        description: 'Request failed',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
      toast({
        title: 'Copied',
        description: `${type} copied to clipboard`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive'
      })
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-blue-100 text-blue-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LoyaltyPro API Documentation
          </h1>
          <p className="text-gray-600">
            Interactive API documentation and testing interface
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Endpoint List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Select an endpoint to test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {apiEndpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEndpoint === endpoint
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedEndpoint(endpoint)
                      setRequestBody(endpoint.requestBody?.example || '')
                      setResponse('')
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      {endpoint.auth && (
                        <Badge variant="secondary" className="text-xs">
                          Auth
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-mono text-gray-600 mb-1">
                      {endpoint.path}
                    </div>
                    <div className="text-xs text-gray-500">
                      {endpoint.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Test Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{selectedEndpoint.method} {selectedEndpoint.path}</span>
                  <Badge className={getMethodColor(selectedEndpoint.method)}>
                    {selectedEndpoint.method}
                  </Badge>
                  {selectedEndpoint.auth && (
                    <Badge variant="secondary">
                      Requires Auth
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedEndpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="test" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="test">Test</TabsTrigger>
                    <TabsTrigger value="docs">Documentation</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                  </TabsList>

                  <TabsContent value="test" className="space-y-4">
                    {/* Parameters */}
                    {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                      <div>
                        <Label>Query Parameters</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {selectedEndpoint.parameters.map((param, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-mono">{param.name}</span>
                              <span className="text-gray-500 ml-2">({param.type})</span>
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Request Body */}
                    {selectedEndpoint.requestBody && (
                      <div>
                        <Label>Request Body</Label>
                        <div className="relative mt-2">
                          <Textarea
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            placeholder="Enter request body..."
                            className="font-mono text-sm"
                            rows={8}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(requestBody, 'Request body')}
                          >
                            {copied === 'request' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Test Button */}
                    <Button
                      onClick={handleTestEndpoint}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Test Endpoint
                        </>
                      )}
                    </Button>

                    {/* Response */}
                    {response && (
                      <div>
                        <Label>Response</Label>
                        <div className="relative mt-2">
                          <Textarea
                            value={response}
                            readOnly
                            className="font-mono text-sm bg-gray-50"
                            rows={10}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(response, 'Response')}
                          >
                            {copied === 'response' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="docs" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-gray-600">{selectedEndpoint.description}</p>
                    </div>

                    {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Parameters</h3>
                        <div className="space-y-2">
                          {selectedEndpoint.parameters.map((param, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-mono font-semibold">{param.name}</span>
                              <span className="text-gray-500 ml-2">({param.type})</span>
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                              <p className="text-gray-600 mt-1">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.auth && (
                      <div>
                        <h3 className="font-semibold mb-2">Authentication</h3>
                        <p className="text-sm text-gray-600">
                          This endpoint requires authentication. Include the JWT token in the Authorization header.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-4">
                    {selectedEndpoint.requestBody && (
                      <div>
                        <h3 className="font-semibold mb-2">Request Example</h3>
                        <div className="relative">
                          <Textarea
                            value={selectedEndpoint.requestBody.example}
                            readOnly
                            className="font-mono text-sm bg-gray-50"
                            rows={8}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(selectedEndpoint.requestBody!.example, 'Request example')}
                          >
                            {copied === 'request-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Response Example</h3>
                      <div className="relative">
                        <Textarea
                          value={selectedEndpoint.response.example}
                          readOnly
                          className="font-mono text-sm bg-gray-50"
                          rows={8}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(selectedEndpoint.response.example, 'Response example')}
                        >
                          {copied === 'response-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 