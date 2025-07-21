"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  Upload,
  Users,
  Coins,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"

interface Transfer {
  id: string
  fromMemberId: string
  fromMemberName: string
  toMemberId: string
  toMemberName: string
  points: number
  reason: string
  status: "completed" | "pending" | "failed" | "cancelled"
  adminName: string
  date: string
  reference: string
  metadata?: {
    transferType: "member-to-member" | "system-to-member" | "member-to-system"
    notes?: string
  }
}

interface Member {
  id: string
  name: string
  email: string
  points: number
  tier: string
  joinDate: string
}

interface TransferStats {
  totalTransfers: number
  totalPointsTransferred: number
  completedTransfers: number
  pendingTransfers: number
  failedTransfers: number
  averageTransferAmount: number
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState<TransferStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [transferForm, setTransferForm] = useState({
    fromMemberId: "",
    toMemberId: "",
    points: "",
    reason: ""
  })
  const [bulkForm, setBulkForm] = useState({
    operation: "add",
    points: "",
    reason: "",
    memberIds: [] as string[]
  })
  const { toast } = useToast()

  // Fetch transfers and members
  useEffect(() => {
    fetchTransfers()
    fetchMembers()
  }, [currentPage, searchTerm])

  const fetchTransfers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: "10",
        search: searchTerm
      })
      
      const response = await fetch(`/api/admin/transfers?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setTransfers(data.transfers)
        setTotalPages(data.totalPages)
        setStats(data.stats)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch transfers",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transfers",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/members?perPage=1000")
      const data = await response.json()
      
      if (response.ok) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error("Failed to fetch members:", error)
    }
  }

  const executeTransfer = async () => {
    try {
      const response = await fetch("/api/admin/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...transferForm,
          adminName: "Admin"
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Transfer executed successfully",
        })
        setShowTransferDialog(false)
        setTransferForm({ fromMemberId: "", toMemberId: "", points: "", reason: "" })
        fetchTransfers()
      } else {
        toast({
          title: "Error",
          description: data.message || "Transfer failed",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute transfer",
        variant: "destructive"
      })
    }
  }

  const executeBulkOperation = async () => {
    try {
      const response = await fetch("/api/admin/transfers/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bulkForm,
          adminName: "Admin"
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Bulk operation completed: ${data.summary.successful} successful, ${data.summary.failed} failed`,
        })
        setShowBulkDialog(false)
        setBulkForm({ operation: "add", points: "", reason: "", memberIds: [] })
        fetchTransfers()
      } else {
        toast({
          title: "Error",
          description: data.message || "Bulk operation failed",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute bulk operation",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Points Transfer</h1>
          <p className="text-muted-foreground">Manage point transfers between members</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Operations
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Point Operations</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Operation</Label>
                  <Select 
                    value={bulkForm.operation} 
                    onValueChange={(value) => setBulkForm({...bulkForm, operation: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add Points</SelectItem>
                      <SelectItem value="deduct">Deduct Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={bulkForm.points}
                    onChange={(e) => setBulkForm({...bulkForm, points: e.target.value})}
                    placeholder="Enter points amount"
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
                    value={bulkForm.reason}
                    onChange={(e) => setBulkForm({...bulkForm, reason: e.target.value})}
                    placeholder="Reason for bulk operation"
                  />
                </div>
                <div>
                  <Label>Select Members</Label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    {members.map((member) => (
                      <label key={member.id} className="flex items-center space-x-2 p-1">
                        <input
                          type="checkbox"
                          checked={bulkForm.memberIds.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkForm({
                                ...bulkForm,
                                memberIds: [...bulkForm.memberIds, member.id]
                              })
                            } else {
                              setBulkForm({
                                ...bulkForm,
                                memberIds: bulkForm.memberIds.filter(id => id !== member.id)
                              })
                            }
                          }}
                        />
                        <span>{member.name} ({member.points} pts)</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button onClick={executeBulkOperation} className="w-full">
                  Execute Bulk Operation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Execute Point Transfer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>From Member</Label>
                  <Select 
                    value={transferForm.fromMemberId} 
                    onValueChange={(value) => setTransferForm({...transferForm, fromMemberId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.points} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To Member</Label>
                  <Select 
                    value={transferForm.toMemberId} 
                    onValueChange={(value) => setTransferForm({...transferForm, toMemberId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.points} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={transferForm.points}
                    onChange={(e) => setTransferForm({...transferForm, points: e.target.value})}
                    placeholder="Enter points amount"
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
                    value={transferForm.reason}
                    onChange={(e) => setTransferForm({...transferForm, reason: e.target.value})}
                    placeholder="Reason for transfer"
                  />
                </div>
                <Button onClick={executeTransfer} className="w-full">
                  Execute Transfer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransfers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Transferred</CardTitle>
              <Coins className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPointsTransferred.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalTransfers > 0 ? Math.round((stats.completedTransfers / stats.totalTransfers) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Transfer</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageTransferAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transfer History</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transfers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transfers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transfers found
              </div>
            ) : (
              <div className="space-y-2">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(transfer.status)}
                      <div>
                        <div className="font-medium">
                          {transfer.fromMemberName} → {transfer.toMemberName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transfer.points.toLocaleString()} points • {transfer.reason}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Ref: {transfer.reference} • {new Date(transfer.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(transfer.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
} 