// lib/transfer-storage.ts
// -----------------------------------------------------------
// Transfer storage utility using backend API and PostgreSQL
// -----------------------------------------------------------

import { apiService } from './apiService'

export interface Transfer {
  id: string
  fromMemberId: string
  fromMemberName: string
  toMemberId: string
  toMemberName: string
  points: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  completedAt?: string
  reason?: string
  notes?: string
}

export interface TransferStats {
  totalTransfers: number
  totalPointsTransferred: number
  completedTransfers: number
  pendingTransfers: number
  failedTransfers: number
  averageTransferAmount: number
}

export interface TransfersResponse {
  transfers: Transfer[]
  total: number
  page: number
  totalPages: number
  stats: TransferStats
}

export interface BulkTransferRequest {
  fromMemberId: string
  toMemberIds: string[]
  points: number
  reason?: string
  notes?: string
}

export interface BulkTransferResponse {
  success: boolean
  message: string
  results: {
    successful: number
    failed: number
    errors: string[]
  }
}

class TransferStorage {
  // Get all transfers with pagination and search
  async getTransfers(page: number = 1, perPage: number = 10, search: string = ''): Promise<TransfersResponse> {
    try {
      return await apiService.getTransfers(page, perPage, search)
    } catch (error) {
      console.error('Error fetching transfers:', error)
      throw error
    }
  }

  // Get transfer by ID
  async getTransferById(id: string): Promise<Transfer | null> {
    try {
      const response = await apiService.getTransfers(1, 1, `id:${id}`)
      return response.transfers[0] || null
    } catch (error) {
      console.error('Error fetching transfer by ID:', error)
      throw error
    }
  }

  // Execute a new transfer
  async executeTransfer(transferData: {
    fromMemberId: string
    toMemberId: string
    points: number
    reason?: string
    notes?: string
  }): Promise<Transfer> {
    try {
      return await apiService.executeTransfer(transferData)
    } catch (error) {
      console.error('Error executing transfer:', error)
      throw error
    }
  }

  // Execute bulk transfers
  async executeBulkTransfer(bulkData: BulkTransferRequest): Promise<BulkTransferResponse> {
    try {
      return await apiService.executeBulkTransfer(bulkData)
    } catch (error) {
      console.error('Error executing bulk transfer:', error)
      throw error
    }
  }

  // Get transfers by status
  async getTransfersByStatus(status: string, page: number = 1, perPage: number = 10): Promise<TransfersResponse> {
    try {
      return await apiService.getTransfers(page, perPage, `status:${status}`)
    } catch (error) {
      console.error('Error fetching transfers by status:', error)
      throw error
    }
  }

  // Get transfers by member
  async getTransfersByMember(memberId: string, page: number = 1, perPage: number = 10): Promise<TransfersResponse> {
    try {
      return await apiService.getTransfers(page, perPage, `member:${memberId}`)
    } catch (error) {
      console.error('Error fetching transfers by member:', error)
      throw error
    }
  }

  // Get recent transfers
  async getRecentTransfers(limit: number = 10): Promise<Transfer[]> {
    try {
      const response = await apiService.getTransfers(1, limit, 'sort:createdAt')
      return response.transfers
    } catch (error) {
      console.error('Error fetching recent transfers:', error)
      throw error
    }
  }

  // Get transfer statistics
  async getTransferStats(): Promise<TransferStats> {
    try {
      const response = await apiService.getTransfers(1, 1, '')
      return response.stats
    } catch (error) {
      console.error('Error fetching transfer statistics:', error)
      throw error
    }
  }

  // Search transfers
  async searchTransfers(query: string, page: number = 1, perPage: number = 10): Promise<TransfersResponse> {
    try {
      return await apiService.getTransfers(page, perPage, query)
    } catch (error) {
      console.error('Error searching transfers:', error)
      throw error
    }
  }

  // Get transfers by date range
  async getTransfersByDateRange(startDate: string, endDate: string, page: number = 1, perPage: number = 10): Promise<TransfersResponse> {
    try {
      return await apiService.getTransfers(page, perPage, `date:${startDate}-${endDate}`)
    } catch (error) {
      console.error('Error fetching transfers by date range:', error)
      throw error
    }
  }

  // Cancel a transfer
  async cancelTransfer(id: string, reason?: string): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181'}/api/admin/transfers/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      })

      return response.ok
    } catch (error) {
      console.error('Error cancelling transfer:', error)
      throw error
    }
  }

  // Approve a transfer
  async approveTransfer(id: string, notes?: string): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181'}/api/admin/transfers/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes })
      })

      return response.ok
    } catch (error) {
      console.error('Error approving transfer:', error)
      throw error
    }
  }
}

// Export singleton instance
export const transferStorage = new TransferStorage() 