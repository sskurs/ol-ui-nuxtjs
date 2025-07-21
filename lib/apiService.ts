// lib/database.ts
// -----------------------------------------------------------
// Database service that routes through backend API to PostgreSQL
// -----------------------------------------------------------

interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

class ApiService {
  private config: DatabaseConfig
  private backendUrl: string
  private token: string | null = null
  private tokenPromise: Promise<string> | null = null

  constructor() {
    this.config = {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME || 'openloyalty',
      username: process.env.DATABASE_USER || 'openloyalty',
      password: process.env.DATABASE_PASSWORD || 'openloyalty'
    }
    
    // Route through backend API
    this.backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  }

  // Fetch and cache JWT token
  private async getToken(): Promise<string> {
    if (this.token) return this.token
    if (this.tokenPromise) return this.tokenPromise
    this.tokenPromise = fetch(`${this.backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice.admin@example.com', password: 'admin123' })
    })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to login for JWT token')
        const data = await res.json()
        if (!data.token) throw new Error('No token in login response')
        this.token = data.token
        return this.token as string
      })
      .finally(() => {
        this.tokenPromise = null
      }) as Promise<string>
    const token = await this.tokenPromise
    if (!token) throw new Error('Token fetch failed')
    return token
  }

  // Helper to add Authorization header
  private async fetchWithAuth(url: string, options: any = {}): Promise<Response> {
    const token = await this.getToken()
    options.headers = options.headers || {}
    options.headers['Authorization'] = `Bearer ${token}`
    return fetch(url, options)
  }

  // Get database connection info
  getConnectionInfo() {
    return {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      username: this.config.username,
      backendUrl: this.backendUrl,
      connected: true
    }
  }

  // Test backend API connection (which connects to database)
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/admin/login_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin@oloy.com', password: 'admin123' })
      })
      // 401 is expected for wrong credentials, but means backend is reachable
      return response.status === 401 || response.ok
    } catch (error) {
      console.error('Backend API connection test failed:', error)
      return false
    }
  }

  // Get members from backend API (which queries database)
  async getMembers(page: number = 1, perPage: number = 10, search: string = ''): Promise<{
    members: any[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString(), // backend expects 'limit' not 'perPage'
        search: search
      })
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/admin/members?${params}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch members from backend: ${response.status}`)
      }
      const data = await response.json()
      return {
        members: data.members || [],
        total: data.total || 0,
        page: data.page || page,
        totalPages: data.totalPages || Math.ceil((data.total || 0) / perPage)
      }
    } catch (error) {
      console.error('Error fetching members from backend API:', error)
      throw error
    }
  }

  // Get member by ID from backend API
  async getMemberById(id: string): Promise<any | null> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/admin/members/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Failed to fetch member from backend: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching member from backend API:', error)
      throw error
    }
  }

  // Create new member through backend API
  async createMember(memberData: any): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/admin/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      })
      if (!response.ok) {
        throw new Error(`Failed to create member through backend: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating member through backend API:', error)
      throw error
    }
  }

  // Update member through backend API
  async updateMember(id: string, memberData: any): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/admin/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      })
      if (!response.ok) {
        throw new Error(`Failed to update member through backend: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating member through backend API:', error)
      throw error
    }
  }

  // Delete member through backend API
  async deleteMember(id: string): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/admin/members/${id}`, {
        method: 'DELETE' })
      return response.ok
    } catch (error) {
      console.error('Error deleting member through backend API:', error)
      throw error
    }
  }

  // Get transfers from backend API (using points/transactions endpoints)
  async getTransfers(page: number = 1, perPage: number = 10, search: string = ''): Promise<{
    transfers: any[]
    total: number
    page: number
    totalPages: number
    stats: any
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString()
      })
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/transaction?${params}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch transfers from backend: ${response.status}`)
      }
      const data = await response.json()
      return {
        transfers: data.transactions || [],
        total: data.total || 0,
        page: page,
        totalPages: Math.ceil((data.total || 0) / perPage),
        stats: {
          totalTransfers: data.total || 0,
          totalPointsTransferred: data.totalPoints || 0,
          completedTransfers: data.completed || 0,
          pendingTransfers: data.pending || 0,
          failedTransfers: data.failed || 0,
          averageTransferAmount: data.averageAmount || 0
        }
      }
    } catch (error) {
      console.error('Error fetching transfers from backend API:', error)
      throw error
    }
  }

  // Execute transfer through backend API
  async executeTransfer(transferData: any): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to execute transfer through backend: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error executing transfer through backend API:', error)
      throw error
    }
  }

  // Execute bulk transfer operations through backend API
  async executeBulkTransfer(bulkData: any): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/transaction/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to execute bulk transfer through backend: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error executing bulk transfer through backend API:', error)
      throw error
    }
  }

  // Get analytics from backend API
  async getAnalytics(): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/analytics`)
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics from backend: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics from backend API:', error)
      throw error
    }
  }

  // Get customers stats from backend API
  async getCustomersStats(): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.backendUrl}/api/customer/registrations/daily`)
      if (!response.ok) {
        throw new Error(`Failed to fetch customers stats from backend: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching customers stats from backend API:', error)
      throw error
    }
  }
}

// Export singleton instance
export const apiService = new ApiService() 