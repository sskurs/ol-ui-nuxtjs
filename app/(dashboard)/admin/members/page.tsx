"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, Mail, Phone, Calendar, Coins, Gift, Ban, CheckCircle, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { adminAPI } from "@/lib/api"
import { useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { loyaltyAPI } from "@/lib/api"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  memberSince: string
  tier: string
  points: number
  totalSpent: number
  status: "active" | "inactive" | "suspended"
  lastActivity: string
  transactions: number
  role: string
}

export default function MembersPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [roles, setRoles] = useState([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const selectAllRef = useRef<HTMLInputElement>(null)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAddingPoints, setIsAddingPoints] = useState(false)
  const [partners, setPartners] = useState<any[]>([]);
  // Add state for partner association
  const [partnerAssociations, setPartnerAssociations] = useState<{ [memberId: string]: string }>({})

  useEffect(() => {
    fetch("/api/admin/roles")
      .then(res => res.json())
      .then(setRoles)
  }, [])

  useEffect(() => {
    // Fetch partners for display
    const fetchPartners = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/partners`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners || []);
      }
    };
    fetchPartners();
  }, []);

  const getPartnerName = (merchantId: number | string | undefined) => {
    if (!merchantId) return "-";
    const partner = partners.find((p: any) => p.id?.toString() === merchantId?.toString());
    return partner ? partner.name : "-";
  };

  // Real API call to backend
  const { data: membersData, isLoading, error } = useQuery({
    queryKey: ["admin-members", currentPage, pageSize, searchTerm, statusFilter, roleFilter],
    queryFn: () => adminAPI.getMembers(currentPage, pageSize, searchTerm),
    placeholderData: (previousData) => previousData,
  })

  // Combine firstName and lastName if name is missing
  const members = (membersData?.members || []).map((m: any) => ({
    ...m,
    name: m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim(),
  }))
  const totalMembers = membersData?.total || 0
  const totalPages = membersData?.totalPages || 1

  const filteredMembers = members.filter((member: Member) => {
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    const matchesTier = tierFilter === "all" || member.tier?.toLowerCase() === tierFilter.toLowerCase()
    return matchesStatus && matchesTier
  })

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "bronze":
        return "bg-amber-100 text-amber-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "platinum":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = async (memberId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      toast.success(`Member status updated to ${newStatus}`)
      queryClient.invalidateQueries({ queryKey: ["admin-members"] })
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handlePointsAdjustment = async (memberId: string, points: number) => {
    setIsAddingPoints(true)
    try {
      const response = await fetch(`/api/admin/members/${memberId}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points })
      })
      if (!response.ok) throw new Error('Failed to add points')
      toast.success(`Points added successfully`)
      queryClient.invalidateQueries({ queryKey: ["admin-members"] })
      setSelectedMember(null)
    } catch (error) {
      toast.error('Failed to add points')
    } finally {
      setIsAddingPoints(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    setMemberToDelete(members.find((m: Member) => m.id === memberId) || null)
  }
  const confirmDeleteMember = async () => {
    if (!memberToDelete) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/members/${memberToDelete.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete member')
      }
      toast.success('Member deleted successfully')
      queryClient.invalidateQueries({ queryKey: ["admin-members"] })
      setMemberToDelete(null)
    } catch (error) {
      console.error('Error deleting member:', error)
      toast.error('Failed to delete member')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSelect = (id: string) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])
  }
  const handleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredMembers.map((m: any) => m.id))
    }
  }
  const handleBulkStatus = async (status: string) => {
    await Promise.all(selectedIds.map(id => handleStatusChange(id, status)))
    setSelectedIds([])
  }
  const handleBulkRole = async (roleId: string) => {
    await Promise.all(selectedIds.map(async id => {
      await fetch(`/api/admin/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: parseInt(roleId) })
      })
    }))
    toast.success('Role updated for selected members')
    setSelectedIds([])
    queryClient.invalidateQueries({ queryKey: ["admin-members"] })
  }
  const handleBulkDelete = async () => {
    if (!confirm('Delete selected members?')) return
    await Promise.all(selectedIds.map(async id => {
      await handleDeleteMember(id)
    }))
    setSelectedIds([])
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600">Error Loading Members</h3>
            <p className="text-muted-foreground">Failed to load member data from backend</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isLoading && !membersData) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading members...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Member Management</h1>
            <p className="text-muted-foreground">Manage and monitor loyalty program members</p>
          </div>
          <Button onClick={() => router.push('/admin/members/add')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members.filter((m) => m.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalMembers > 0 ? Math.round((members.filter((m) => m.status === "active").length / totalMembers) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members.length > 0 
                  ? Math.round(members.reduce((acc, m) => acc + (m.points || 0), 0) / members.length).toLocaleString()
                  : "0"
                }
              </div>
              <p className="text-xs text-muted-foreground">Per member</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {members.reduce((acc, m) => acc + (m.points || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Circulating</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex gap-2 mb-2">
            <Select onValueChange={handleBulkStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Bulk Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Set Active</SelectItem>
                <SelectItem value="suspended">Set Suspended</SelectItem>
                <SelectItem value="pending">Set Pending</SelectItem>
                <SelectItem value="deleted">Set Deleted</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleBulkRole}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Bulk Role" /></SelectTrigger>
              <SelectContent>
                {roles.map((role: any) => (
                  <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="destructive" onClick={handleBulkDelete}>Delete Selected</Button>
          </div>
        )}

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Members ({filteredMembers.length} of {totalMembers})</CardTitle>
            <CardDescription>Manage loyalty program members</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No members found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input
                        type="checkbox"
                        ref={selectAllRef}
                        checked={selectedIds.length === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Associate Partner</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(member.id)}
                          onChange={() => handleSelect(member.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {(member.name || '').split(" ").map((n: string) => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <Badge className={getTierColor(member.tier)}>{member.tier}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                      </TableCell>
                      <TableCell>{getPartnerName(member.merchantId)}</TableCell>
                      <TableCell>
                        <select
                          value={partnerAssociations[member.id] || ""}
                          onChange={async (e) => {
                            const newPartnerId = e.target.value
                            setPartnerAssociations((prev) => ({ ...prev, [member.id]: newPartnerId }))
                            try {
                              await loyaltyAPI.associatePartner(member.id, parseInt(newPartnerId))
                              toast.success("Partner associated successfully")
                              queryClient.invalidateQueries({ queryKey: ["admin-members"] })
                            } catch (err: any) {
                              toast.error(err.message || "Failed to associate partner")
                            }
                          }}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="">Select a partner</option>
                          {partners.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/members/${member.id}`)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/members/${member.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalMembers)} of {totalMembers} members
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AlertDialog for delete confirmation */}
        {memberToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold text-red-600">Delete Member</h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete <b>{memberToDelete.name}</b>? This action cannot be undone.
              </p>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => setMemberToDelete(null)} disabled={isDeleting}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDeleteMember} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

