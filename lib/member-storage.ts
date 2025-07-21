// lib/member-storage.ts
// -----------------------------------------------------------
// Member storage utility using backend API and PostgreSQL
// -----------------------------------------------------------

import { apiService } from './apiService'

export interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  points: number
  tier: string
  joinDate: string
  lastActivity: string
  status: 'active' | 'inactive' | 'suspended'
  totalSpent: number
  transactions: number
}

export interface MembersResponse {
  members: Member[]
  total: number
  page: number
  totalPages: number
}

class MemberStorage {
  // Get all members with pagination and search
  async getMembers(page: number = 1, perPage: number = 10, search: string = ''): Promise<MembersResponse> {
    try {
      return await apiService.getMembers(page, perPage, search)
    } catch (error) {
      console.error('Error fetching members:', error)
      throw error
    }
  }

  // Get member by ID
  async getMemberById(id: string): Promise<Member | null> {
    try {
      return await apiService.getMemberById(id)
    } catch (error) {
      console.error('Error fetching member by ID:', error)
      throw error
    }
  }

  // Create new member
  async createMember(memberData: Omit<Member, 'id'>): Promise<Member> {
    try {
      return await apiService.createMember(memberData)
    } catch (error) {
      console.error('Error creating member:', error)
      throw error
    }
  }

  // Update member
  async updateMember(id: string, memberData: Partial<Member>): Promise<Member> {
    try {
      return await apiService.updateMember(id, memberData)
    } catch (error) {
      console.error('Error updating member:', error)
      throw error
    }
  }

  // Delete member
  async deleteMember(id: string): Promise<boolean> {
    try {
      return await apiService.deleteMember(id)
    } catch (error) {
      console.error('Error deleting member:', error)
      throw error
    }
  }

  // Search members
  async searchMembers(query: string, page: number = 1, perPage: number = 10): Promise<MembersResponse> {
    try {
      return await apiService.getMembers(page, perPage, query)
    } catch (error) {
      console.error('Error searching members:', error)
      throw error
    }
  }

  // Get members by tier
  async getMembersByTier(tier: string, page: number = 1, perPage: number = 10): Promise<MembersResponse> {
    try {
      // Add tier filter to search
      return await apiService.getMembers(page, perPage, `tier:${tier}`)
    } catch (error) {
      console.error('Error fetching members by tier:', error)
      throw error
    }
  }

  // Get members by status
  async getMembersByStatus(status: string, page: number = 1, perPage: number = 10): Promise<MembersResponse> {
    try {
      // Add status filter to search
      return await apiService.getMembers(page, perPage, `status:${status}`)
    } catch (error) {
      console.error('Error fetching members by status:', error)
      throw error
    }
  }

  // Get top members by points
  async getTopMembers(limit: number = 10): Promise<Member[]> {
    try {
      const response = await apiService.getMembers(1, limit, 'sort:points')
      return response.members
    } catch (error) {
      console.error('Error fetching top members:', error)
      throw error
    }
  }

  // Get recent members
  async getRecentMembers(limit: number = 10): Promise<Member[]> {
    try {
      const response = await apiService.getMembers(1, limit, 'sort:joinDate')
      return response.members
    } catch (error) {
      console.error('Error fetching recent members:', error)
      throw error
    }
  }

  // Get members statistics
  async getMembersStats(): Promise<{
    totalMembers: number
    activeMembers: number
    inactiveMembers: number
    suspendedMembers: number
    totalPoints: number
    averagePoints: number
    tierDistribution: Record<string, number>
  }> {
    try {
      const stats = await apiService.getCustomersStats()
      return {
        totalMembers: stats.totalMembers || 0,
        activeMembers: stats.activeMembers || 0,
        inactiveMembers: stats.inactiveMembers || 0,
        suspendedMembers: stats.suspendedMembers || 0,
        totalPoints: stats.totalPoints || 0,
        averagePoints: stats.averagePoints || 0,
        tierDistribution: stats.tierDistribution || {}
      }
    } catch (error) {
      console.error('Error fetching members statistics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const memberStorage = new MemberStorage()
export const getMembers = memberStorage.getMembers.bind(memberStorage) 