"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Plus,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Merchant {
  id: string
  name: string
  owner: string // Owner
  address: string // Address
  state: string // State
  city: string // City
  zipcode: string // Zipcode
  category: string // Category
  taxId: string // TaxId
  description: string // Description
  website: string // Website
  status: "active" | "pending" | "suspended" | "rejected" // Status
  commisionRate: number // CommisionRate
  email: string
  phone: string
  zipCode: string
  totalRevenue: number
  totalCustomers: number
  pointsIssued: number
  commissionRate: number
}



const categories = [
  "Food & Beverage",
  "Fashion & Apparel",
  "Electronics",
  "Health & Beauty",
  "Home & Garden",
  "Sports & Recreation",
  "Automotive",
  "Services",
  "Other",
]

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load merchants from API
  useEffect(() => {
    const loadMerchants = async () => {
      setIsLoading(true)
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`/api/admin/merchants?page=1&limit=100&search=${searchTerm}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch merchants')
        }
        const data = await response.json()
        setMerchants(data.merchants || [])
      } catch (error) {
        console.error('Error loading merchants:', error)
        toast({
          title: "Error",
          description: "Failed to load merchants. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadMerchants()
  }, [searchTerm, toast])

  const [newMerchant, setNewMerchant] = useState<Partial<Merchant>>({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    category: "",
    status: "pending",
    commissionRate: 5.0,
    description: "",
    website: "",
    taxId: "",
  })

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      (merchant.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (merchant.owner || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (merchant.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter
    const matchesCategory = categoryFilter === "all" || merchant.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    totalMerchants: merchants.length,
    activeMerchants: merchants.filter((m) => m.status === "active").length,
    pendingMerchants: merchants.filter((m) => m.status === "pending").length,
    totalRevenue: merchants.reduce((sum, m) => sum + m.totalRevenue, 0),
  }

  const handleCreateMerchant = async () => {
    setIsLoading(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          Name: newMerchant.name,
          Email: newMerchant.email,
          Phone: newMerchant.phone,
          Address: newMerchant.address,
          State: newMerchant.state,
          City: newMerchant.city,
          Zipcode: newMerchant.zipCode || newMerchant.zipcode,
          Category: newMerchant.category,
          TaxId: newMerchant.taxId,
          Description: newMerchant.description,
          Website: newMerchant.website,
          CommisionRate: newMerchant.commissionRate,
          Status: newMerchant.status,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to create merchant')
      }
      const result = await response.json()
      // Refresh merchants list
      const merchantsResponse = await fetch(`/api/admin/merchants?page=1&limit=100&search=${searchTerm}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (merchantsResponse.ok) {
        const data = await merchantsResponse.json()
        setMerchants(data.merchants || [])
      }
      setIsCreateDialogOpen(false)
      setNewMerchant({
        name: "",
        owner: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        category: "",
        status: "pending",
        commissionRate: 5.0,
        description: "",
        website: "",
        taxId: "",
      })
      toast({
        title: "Merchant Created",
        description: "New merchant has been successfully added to the system.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create merchant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMerchant = async () => {
    if (!selectedMerchant) return
    setIsLoading(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      // Only include fields that are not null/empty/blank
      const payload: Record<string, any> = {};
      if (selectedMerchant.name && selectedMerchant.name.trim() !== "") payload.Name = selectedMerchant.name;
      if (selectedMerchant.email && selectedMerchant.email.trim() !== "") payload.Email = selectedMerchant.email;
      if (selectedMerchant.phone && selectedMerchant.phone.trim() !== "") payload.Phone = selectedMerchant.phone;
      if (selectedMerchant.address && selectedMerchant.address.trim() !== "") payload.Address = selectedMerchant.address;
      if (selectedMerchant.state && selectedMerchant.state.trim() !== "") payload.State = selectedMerchant.state;
      if (selectedMerchant.city && selectedMerchant.city.trim() !== "") payload.City = selectedMerchant.city;
      if (selectedMerchant.zipCode && selectedMerchant.zipCode.trim() !== "") payload.Zipcode = selectedMerchant.zipCode;
      if (selectedMerchant.category && selectedMerchant.category.trim() !== "") payload.Category = selectedMerchant.category;
      if (selectedMerchant.taxId && selectedMerchant.taxId.trim() !== "") payload.TaxId = selectedMerchant.taxId;
      if (selectedMerchant.description && selectedMerchant.description.trim() !== "") payload.Description = selectedMerchant.description;
      if (selectedMerchant.website && selectedMerchant.website.trim() !== "") payload.Website = selectedMerchant.website;
      if (selectedMerchant.commissionRate !== undefined && selectedMerchant.commissionRate !== null) payload.CommisionRate = selectedMerchant.commissionRate;
      if (selectedMerchant.status && selectedMerchant.status.trim() !== "") payload.Status = selectedMerchant.status;
      const response = await fetch(`/api/admin/merchants/${selectedMerchant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error('Failed to update merchant')
      }
      // Refresh merchants list
      const merchantsResponse = await fetch(`/api/admin/merchants?page=1&limit=100&search=${searchTerm}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (merchantsResponse.ok) {
        const data = await merchantsResponse.json()
        setMerchants(data.merchants || [])
      }
      setIsEditDialogOpen(false)
      setSelectedMerchant(null)
      toast({
        title: "Merchant Updated",
        description: "Merchant information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (merchantId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      const merchant = merchants.find(m => m.id === merchantId)
      if (!merchant) return
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`/api/admin/merchants/${merchantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...merchant, status: newStatus }),
      })
      if (!response.ok) {
        throw new Error('Failed to update merchant status')
      }
      // Refresh merchants list
      const merchantsResponse = await fetch(`/api/admin/merchants?page=1&limit=100&search=${searchTerm}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (merchantsResponse.ok) {
        const data = await merchantsResponse.json()
        setMerchants(data.merchants || [])
      }
      toast({
        title: "Status Updated",
        description: `Merchant status has been changed to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMerchant = async (merchantId: string) => {
    setIsLoading(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`/api/admin/merchants/${merchantId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete merchant')
      }
      // Refresh merchants list
      const merchantsResponse = await fetch(`/api/admin/merchants?page=1&limit=100&search=${searchTerm}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (merchantsResponse.ok) {
        const data = await merchantsResponse.json()
        setMerchants(data.merchants || [])
      }
      toast({
        title: "Merchant Deleted",
        description: "Merchant has been successfully removed from the system.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete merchant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout role="admin">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchants Management</h1>
          <p className="text-muted-foreground">Manage merchant partners and their business relationships</p>
        </div>
        <Link href="/admin/merchants/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Merchant
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMerchants}</div>
            <p className="text-xs text-muted-foreground">All registered merchants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMerchants}</div>
            <p className="text-xs text-muted-foreground">Currently active partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMerchants}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalRevenue ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all merchants</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Directory</CardTitle>
          <CardDescription>Search and filter merchants by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search merchants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Merchants List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-muted-foreground/10">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Business Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Owner</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">City/State</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Revenue</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Customers</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Points Issued</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{merchant.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{merchant.owner}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{merchant.city}, {merchant.state}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{merchant.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{getStatusBadge(merchant.status)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">₹{(merchant.totalRevenue ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">{merchant.totalCustomers}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">{(merchant.pointsIssued ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMerchant(merchant)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Link href={`/admin/merchants/${merchant.id}/edit`} passHref legacyBehavior>
                          <span>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </span>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMerchant(merchant.id)}
                          disabled={merchant.status === "active"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No merchants found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or add a new merchant.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Merchant Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Merchant Details</DialogTitle>
            <DialogDescription>Complete information about {selectedMerchant?.name}</DialogDescription>
          </DialogHeader>
          {selectedMerchant && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Business Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Owner</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.owner}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedMerchant.status)}</div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedMerchant.address}
                    <br />
                    {selectedMerchant.city}, {selectedMerchant.state} {selectedMerchant.zipCode}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedMerchant.description}</p>
                </div>
                {selectedMerchant.website && (
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.website}</p>
                  </div>
                )}
                {selectedMerchant.taxId && (
                  <div>
                    <Label className="text-sm font-medium">Tax ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.taxId}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${(selectedMerchant.totalRevenue ?? 0).toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedMerchant.totalCustomers}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Points Issued</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{(selectedMerchant.pointsIssued ?? 0).toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Commission Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedMerchant.commissionRate}%</div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Label className="text-sm font-medium">Join Date</Label>
                  <p className="text-sm text-muted-foreground">
                    -
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Change Status</Label>
                    <Select
                      value={selectedMerchant.status}
                      onValueChange={(value) => handleStatusChange(selectedMerchant.id, value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Merchant
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Merchant Dialog */}
      {/* This dialog is no longer needed as editing is handled by Link */}
    </div>
    </DashboardLayout>
  )
}
