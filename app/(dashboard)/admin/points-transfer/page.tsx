"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeftRight, Plus, Search, Filter, Download, AlertCircle, CheckCircle, Clock, X, Users } from "lucide-react"
import { toast } from "sonner"
import { partnerAPI } from "@/lib/api/partnerAPI"

export default function PointsTransferPage() {
  const [selectedFromMember, setSelectedFromMember] = useState("")
  const [selectedToMember, setSelectedToMember] = useState("")
  const [transferPoints, setTransferPoints] = useState("")
  const [transferReason, setTransferReason] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [bulkOperation, setBulkOperation] = useState("add")
  const [bulkPoints, setBulkPoints] = useState("")
  const [bulkReason, setBulkReason] = useState("")

  const queryClient = useQueryClient()

  // Remove mockMembers and mockTransferHistory
  // Use only data from API queries
  const { data: members, isLoading: membersLoading, isError: membersError } = useQuery({
    queryKey: ["members"],
    queryFn: () => partnerAPI.getMembers(), // Replace with actual API call
  })

  const { data: transferHistory, isLoading: historyLoading, isError: historyError } = useQuery({
    queryKey: ["transfer-history"],
    queryFn: () => partnerAPI.getTransferHistory(), // Replace with actual API call
  })

  // Mock mutations
  const transferPointsMutation = useMutation({
    mutationFn: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return data
    },
    onSuccess: () => {
      toast.success("Points transferred successfully!")
      setIsTransferDialogOpen(false)
      setSelectedFromMember("")
      setSelectedToMember("")
      setTransferPoints("")
      setTransferReason("")
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] })
      queryClient.invalidateQueries({ queryKey: ["members"] })
    },
    onError: () => {
      toast.error("Failed to transfer points")
    },
  })

  const bulkOperationMutation = useMutation({
    mutationFn: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return data
    },
    onSuccess: () => {
      toast.success("Bulk operation completed successfully!")
      setIsBulkDialogOpen(false)
      setBulkPoints("")
      setBulkReason("")
      queryClient.invalidateQueries({ queryKey: ["members"] })
    },
    onError: () => {
      toast.error("Failed to complete bulk operation")
    },
  })

  const handleTransfer = () => {
    if (!selectedFromMember || !selectedToMember || !transferPoints || !transferReason) {
      toast.error("Please fill in all required fields")
      return
    }

    if (selectedFromMember === selectedToMember) {
      toast.error("Cannot transfer points to the same member")
      return
    }

    const points = Number.parseInt(transferPoints)
    if (points <= 0) {
      toast.error("Transfer amount must be greater than 0")
      return
    }

    const fromMember = members.find((m) => m.id === selectedFromMember)
    if (fromMember && fromMember.points < points) {
      toast.error("Insufficient points in source account")
      return
    }

    transferPointsMutation.mutate({
      fromMemberId: selectedFromMember,
      toMemberId: selectedToMember,
      points,
      reason: transferReason,
    })
  }

  const handleBulkOperation = () => {
    if (!bulkPoints || !bulkReason) {
      toast.error("Please fill in all required fields")
      return
    }

    const points = Number.parseInt(bulkPoints)
    if (points <= 0) {
      toast.error("Points amount must be greater than 0")
      return
    }

    bulkOperationMutation.mutate({
      operation: bulkOperation,
      points,
      reason: bulkReason,
    })
  }

  const filteredHistory = transferHistory.filter((transfer) => {
    const matchesSearch =
      transfer.fromMember.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toMember.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || transfer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalPointsTransferred = transferHistory
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.points, 0)

  const pendingTransfers = transferHistory.filter((t) => t.status === "pending").length

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Points Transfer Management</h1>
            <p className="text-muted-foreground">Manage points transfers between members and bulk operations</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Transfer Points
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Transfer Points Between Members</DialogTitle>
                  <DialogDescription>
                    Transfer points from one member to another with proper tracking and validation.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fromMember">From Member *</Label>
                    <Select value={selectedFromMember} onValueChange={setSelectedFromMember}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.points} points)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="toMember">To Member *</Label>
                    <Select value={selectedToMember} onValueChange={setSelectedToMember}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.points} points)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="points">Points to Transfer *</Label>
                    <Input
                      id="points"
                      type="number"
                      placeholder="Enter points amount"
                      value={transferPoints}
                      onChange={(e) => setTransferPoints(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reason">Transfer Reason *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter reason for transfer"
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                    />
                  </div>
                  {selectedFromMember && transferPoints && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {(() => {
                          const fromMember = members.find((m) => m.id === selectedFromMember)
                          const points = Number.parseInt(transferPoints) || 0
                          if (fromMember && fromMember.points < points) {
                            return `Insufficient points! ${fromMember.name} only has ${fromMember.points} points.`
                          }
                          return `${fromMember?.name} will have ${(fromMember?.points || 0) - points} points remaining after transfer.`
                        })()}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTransfer} disabled={transferPointsMutation.isPending}>
                    {transferPointsMutation.isPending ? "Transferring..." : "Transfer Points"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Bulk Operations
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Bulk Points Operations</DialogTitle>
                  <DialogDescription>Add or deduct points from all members at once.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="operation">Operation Type *</Label>
                    <Select value={bulkOperation} onValueChange={setBulkOperation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Add Points to All Members</SelectItem>
                        <SelectItem value="deduct">Deduct Points from All Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bulkPoints">Points Amount *</Label>
                    <Input
                      id="bulkPoints"
                      type="number"
                      placeholder="Enter points amount"
                      value={bulkPoints}
                      onChange={(e) => setBulkPoints(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bulkReason">Operation Reason *</Label>
                    <Textarea
                      id="bulkReason"
                      placeholder="Enter reason for bulk operation"
                      value={bulkReason}
                      onChange={(e) => setBulkReason(e.target.value)}
                    />
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This operation will affect all {members.length} members in the system.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkOperation} disabled={bulkOperationMutation.isPending}>
                    {bulkOperationMutation.isPending ? "Processing..." : "Execute Operation"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transferHistory.length}</div>
              <p className="text-xs text-muted-foreground">All time transfers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Transferred</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPointsTransferred.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total points moved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTransfers}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground">Available for transfers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Transfer History</TabsTrigger>
            <TabsTrigger value="members">Member Points</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Transfer History</CardTitle>
                    <CardDescription>View and manage all points transfer transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search transfers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredHistory.map((transfer) => (
                    <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {transfer.fromMember} → {transfer.toMember}
                            </p>
                            <p className="text-sm text-muted-foreground">{transfer.reason}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{transfer.points.toLocaleString()} points</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transfer.date).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(transfer.status)}
                      </div>
                    </div>
                  ))}
                  {filteredHistory.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No transfers found matching your criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Member Points Overview</CardTitle>
                <CardDescription>View current points balance for all members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{member.tier}</Badge>
                        <div className="text-right">
                          <p className="font-medium">{member.points.toLocaleString()} points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
