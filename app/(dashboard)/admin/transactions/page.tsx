"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Search, Download, Eye, RefreshCw, CheckCircle, XCircle, Clock, DollarSign, TrendingUp } from "lucide-react"
import { Receipt } from "lucide-react" // Import Receipt icon
import { adminAPI } from "@/lib/api" // Assuming adminAPI is in this path
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface Transaction {
  id: string
  memberId: string
  memberName: string
  memberEmail: string
  partnerId: string
  partnerName: string
  type: "purchase" | "redemption" | "transfer" | "adjustment" | "refund"
  amount: number
  points: number
  status: "completed" | "pending" | "failed" | "refunded"
  description: string
  date: string
  reference: string
  metadata?: {
    orderId?: string
    location?: string
    category?: string
    paymentMethod?: string
  }
}

export default function TransactionsPage() {
  // Remove mockTransactions and use API data only
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    // Replace with actual API call
    adminAPI.getTransactions()
      .then((data: { transactions: Transaction[]; total: number; page: number; totalPages: number }) => {
        setTransactions(data.transactions)
        setFilteredTransactions(data.transactions)
      })
      .catch(() => setFilteredTransactions([]))
      .finally(() => setIsLoading(false))
  }, [])

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, statusFilter, typeFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      pending: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      failed: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
      refunded: { variant: "outline" as const, icon: RefreshCw, color: "text-blue-600" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      purchase: { color: "bg-green-100 text-green-800", label: "Purchase" },
      redemption: { color: "bg-blue-100 text-blue-800", label: "Redemption" },
      transfer: { color: "bg-purple-100 text-purple-800", label: "Transfer" },
      adjustment: { color: "bg-orange-100 text-orange-800", label: "Adjustment" },
      refund: { color: "bg-red-100 text-red-800", label: "Refund" },
    }

    const config = typeConfig[type as keyof typeof typeConfig]

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
  }

  const handleRefund = async (transactionId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, status: "refunded" as const } : t)))

      toast.success("Transaction refunded successfully")
    } catch (error) {
      toast.error("Failed to refund transaction")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["ID", "Member", "Partner", "Type", "Amount", "Points", "Status", "Date", "Reference"].join(","),
      ...filteredTransactions.map((t) =>
        [
          t.id,
          t.memberName,
          t.partnerName,
          t.type,
          t.amount,
          t.points,
          t.status,
          new Date(t.date).toLocaleDateString(),
          t.reference,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success("Transactions exported successfully")
  }

  // Calculate statistics
  const stats = {
    total: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalPoints: transactions.reduce((sum, t) => sum + Math.abs(t.points), 0),
    pending: transactions.filter((t) => t.status === "pending").length,
  }

  return (
    <DashboardLayout role="admin">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transaction Management</h1>
          <p className="text-muted-foreground">Monitor and manage all loyalty program transactions</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Transaction value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Processed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total points activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Filters</CardTitle>
          <CardDescription>Search and filter transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by member, partner, ID, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="redemption">Redemption</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{transaction.id}</span>
                        {getTypeBadge(transaction.type)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.memberName} • {transaction.partnerName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{transaction.amount > 0 ? `₹${transaction.amount}` : "-"}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.points > 0 ? "+" : ""}
                        {transaction.points} pts
                      </div>
                    </div>

                    <div className="flex items-center gap-2">{getStatusBadge(transaction.status)}</div>

                    <div className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                          <DialogDescription>Complete information for transaction {transaction.id}</DialogDescription>
                        </DialogHeader>

                        {selectedTransaction && (
                          <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="member">Member</TabsTrigger>
                              <TabsTrigger value="actions">Actions</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Transaction ID</Label>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.id}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Reference</Label>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.reference}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Type</Label>
                                  <div className="mt-1">{getTypeBadge(selectedTransaction.type)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Amount</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedTransaction.amount > 0 ? `₹${selectedTransaction.amount}` : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Points</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedTransaction.points > 0 ? "+" : ""}
                                    {selectedTransaction.points}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Date</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(selectedTransaction.date).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Partner</Label>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.partnerName}</p>
                                </div>
                              </div>

                              <Separator />

                              <div>
                                <Label className="text-sm font-medium">Description</Label>
                                <p className="text-sm text-muted-foreground mt-1">{selectedTransaction.description}</p>
                              </div>

                              {selectedTransaction.metadata && (
                                <>
                                  <Separator />
                                  <div>
                                    <Label className="text-sm font-medium">Additional Information</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      {selectedTransaction.metadata.orderId && (
                                        <div>
                                          <span className="text-xs text-muted-foreground">Order ID:</span>
                                          <p className="text-sm">{selectedTransaction.metadata.orderId}</p>
                                        </div>
                                      )}
                                      {selectedTransaction.metadata.location && (
                                        <div>
                                          <span className="text-xs text-muted-foreground">Location:</span>
                                          <p className="text-sm">{selectedTransaction.metadata.location}</p>
                                        </div>
                                      )}
                                      {selectedTransaction.metadata.category && (
                                        <div>
                                          <span className="text-xs text-muted-foreground">Category:</span>
                                          <p className="text-sm">{selectedTransaction.metadata.category}</p>
                                        </div>
                                      )}
                                      {selectedTransaction.metadata.paymentMethod && (
                                        <div>
                                          <span className="text-xs text-muted-foreground">Payment:</span>
                                          <p className="text-sm">{selectedTransaction.metadata.paymentMethod}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </TabsContent>

                            <TabsContent value="member" className="space-y-4">
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Member Name</Label>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.memberName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Email</Label>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.memberEmail}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Member ID</Label>
                                  <p className="text-sm text-muted-foreground">{selectedTransaction.memberId}</p>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="actions" className="space-y-4">
                              <div className="space-y-4">
                                {selectedTransaction.status === "completed" &&
                                  selectedTransaction.type === "purchase" && (
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Refund Transaction</Label>
                                      <p className="text-sm text-muted-foreground">
                                        Process a refund for this transaction. This will reverse the points and amount.
                                      </p>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleRefund(selectedTransaction.id)}
                                        disabled={isLoading}
                                        className="w-full"
                                      >
                                        {isLoading ? (
                                          <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Processing Refund...
                                          </>
                                        ) : (
                                          <>
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Process Refund
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  )}

                                {selectedTransaction.status === "pending" && (
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Pending Actions</Label>
                                    <p className="text-sm text-muted-foreground">
                                      This transaction is pending. You can approve or reject it.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button variant="default" className="flex-1">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button variant="destructive" className="flex-1">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Add Note</Label>
                                  <Textarea placeholder="Add administrative note..." />
                                  <Button variant="outline" className="w-full bg-transparent">
                                    Save Note
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}
