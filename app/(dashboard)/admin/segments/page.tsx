"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, Edit, Trash2, Users, Target, TrendingUp, Filter, Eye, Mail, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Segment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria[]
  memberCount: number
  status: "active" | "inactive" | "draft"
  createdAt: string
  lastUpdated: string
  color: string
}

interface SegmentCriteria {
  id: string
  field: string
  operator: string
  value: string
  logicalOperator?: "AND" | "OR"
}

export default function SegmentsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch segments from backend
  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:5000/api/segments", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setSegments(data.segments || []))
      .catch(() => toast({ title: "Error", description: "Failed to load segments", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [])

  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    criteria: [{ id: "1", field: "", operator: "", value: "", logicalOperator: undefined }] as SegmentCriteria[],
    color: "#10B981",
  })

  const filteredSegments = segments.filter((segment) => {
    const matchesSearch =
      segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || segment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateSegment = async () => {
    if (!newSegment.name.trim()) {
      toast({ title: "Error", description: "Segment name is required", variant: "destructive" })
      return
    }
    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/api/segments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: newSegment.name,
          description: newSegment.description,
          criteria: JSON.stringify(newSegment.criteria),
          memberCount: 0,
          status: "draft",
          color: newSegment.color,
        }),
      })
      if (!res.ok) throw new Error("Failed to create segment")
      const created = await res.json()
      setSegments([...segments, created])
      setNewSegment({ name: "", description: "", criteria: [{ id: "1", field: "", operator: "", value: "", logicalOperator: undefined }], color: "#10B981" })
      setIsCreateDialogOpen(false)
      toast({ title: "Success", description: "Segment created successfully" })
    } catch {
      toast({ title: "Error", description: "Failed to create segment", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleEditSegment = async () => {
    if (!selectedSegment) return
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:5000/api/segments/${selectedSegment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...selectedSegment,
          criteria: JSON.stringify(selectedSegment.criteria),
        }),
      })
      if (!res.ok) throw new Error("Failed to update segment")
      const updated = await res.json()
      setSegments(segments.map(s => s.id === updated.id ? updated : s))
      setIsEditDialogOpen(false)
      setSelectedSegment(null)
      toast({ title: "Success", description: "Segment updated successfully" })
    } catch {
      toast({ title: "Error", description: "Failed to update segment", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSegment = async (segmentId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:5000/api/segments/${segmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (!res.ok) throw new Error("Failed to delete segment")
      setSegments(segments.filter(s => s.id !== segmentId))
      toast({ title: "Success", description: "Segment deleted successfully" })
    } catch {
      toast({ title: "Error", description: "Failed to delete segment", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = (segmentId: string) => {
    setSegments(
      segments.map((segment) =>
        segment.id === segmentId
          ? {
              ...segment,
              status: segment.status === "active" ? "inactive" : "active",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : segment,
      ),
    )
  }

  const addCriteria = (criteriaList: SegmentCriteria[], setCriteriaList: (criteria: SegmentCriteria[]) => void) => {
    const newCriteria: SegmentCriteria = {
      id: Date.now().toString(),
      field: "",
      operator: "",
      value: "",
      logicalOperator: "AND",
    }
    setCriteriaList([...criteriaList, newCriteria])
  }

  const removeCriteria = (
    criteriaId: string,
    criteriaList: SegmentCriteria[],
    setCriteriaList: (criteria: SegmentCriteria[]) => void,
  ) => {
    setCriteriaList(criteriaList.filter((c) => c.id !== criteriaId))
  }

  const updateCriteria = (
    criteriaId: string,
    field: string,
    value: any,
    criteriaList: SegmentCriteria[],
    setCriteriaList: (criteria: SegmentCriteria[]) => void,
  ) => {
    setCriteriaList(criteriaList.map((c) => (c.id === criteriaId ? { ...c, [field]: value } : c)))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      draft: "bg-yellow-100 text-yellow-800",
    }
    return variants[status as keyof typeof variants] || variants.draft
  }

  const totalSegments = segments.length
  const activeSegments = segments.filter((s) => s.status === "active").length
  const totalMembers = segments.reduce((sum, s) => sum + s.memberCount, 0)
  const avgMembersPerSegment = totalSegments > 0 ? Math.round(totalMembers / totalSegments) : 0

  return (
    <DashboardLayout role="admin">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Segments</h1>
          <p className="text-muted-foreground">Create and manage customer segments for targeted marketing</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Segment</DialogTitle>
              <DialogDescription>Define criteria to automatically group customers into segments</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="criteria">Criteria</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Segment Name *</Label>
                  <Input
                    id="name"
                    value={newSegment.name}
                    onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                    placeholder="Enter segment name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSegment.description}
                    onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                    placeholder="Describe this segment"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Segment Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="color"
                      value={newSegment.color}
                      onChange={(e) => setNewSegment({ ...newSegment, color: e.target.value })}
                      className="w-12 h-8 rounded border"
                    />
                    <span className="text-sm text-muted-foreground">{newSegment.color}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="criteria" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Segment Criteria</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addCriteria(newSegment.criteria, (criteria) => setNewSegment({ ...newSegment, criteria }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Criteria
                    </Button>
                  </div>
                  {newSegment.criteria.map((criteria, index) => (
                    <div key={criteria.id} className="border rounded-lg p-4 space-y-3">
                      {index > 0 && (
                        <div className="flex items-center space-x-2">
                          <Select
                            value={criteria.logicalOperator}
                            onValueChange={(value) =>
                              updateCriteria(criteria.id, "logicalOperator", value, newSegment.criteria, (criteria) =>
                                setNewSegment({ ...newSegment, criteria }),
                              )
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-3">
                        <Select
                          value={criteria.field}
                          onValueChange={(value) =>
                            updateCriteria(criteria.id, "field", value, newSegment.criteria, (criteria) =>
                              setNewSegment({ ...newSegment, criteria }),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="totalSpent">Total Spent</SelectItem>
                            <SelectItem value="transactionCount">Transaction Count</SelectItem>
                            <SelectItem value="pointsBalance">Points Balance</SelectItem>
                            <SelectItem value="tier">Loyalty Tier</SelectItem>
                            <SelectItem value="joinDate">Join Date</SelectItem>
                            <SelectItem value="lastPurchase">Last Purchase</SelectItem>
                            <SelectItem value="birthMonth">Birth Month</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={criteria.operator}
                          onValueChange={(value) =>
                            updateCriteria(criteria.id, "operator", value, newSegment.criteria, (criteria) =>
                              setNewSegment({ ...newSegment, criteria }),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="=">=</SelectItem>
                            <SelectItem value="!=">!=</SelectItem>
                            <SelectItem value=">">{">"}</SelectItem>
                            <SelectItem value=">=">{">="}=</SelectItem>
                            <SelectItem value="<">{"<"}</SelectItem>
                            <SelectItem value="<=">{"<="}</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex space-x-2">
                          <Input
                            value={criteria.value}
                            onChange={(e) =>
                              updateCriteria(criteria.id, "value", e.target.value, newSegment.criteria, (criteria) =>
                                setNewSegment({ ...newSegment, criteria }),
                              )
                            }
                            placeholder="Value"
                          />
                          {newSegment.criteria.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeCriteria(criteria.id, newSegment.criteria, (criteria) =>
                                  setNewSegment({ ...newSegment, criteria }),
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSegment}>Create Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSegments}</div>
            <p className="text-xs text-muted-foreground">{activeSegments} active segments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all segments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Segment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMembersPerSegment}</div>
            <p className="text-xs text-muted-foreground">Members per segment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSegments}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeSegments / totalSegments) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search segments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p>Loading segments...</p>
          </div>
        ) : filteredSegments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No segments found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first customer segment to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Segment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredSegments.map((segment) => (
            <Card key={segment.id} className="relative">
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                style={{ backgroundColor: segment.color }}
              />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                    <CardDescription className="mt-1">{segment.description}</CardDescription>
                  </div>
                  <Badge className={getStatusBadge(segment.status)}>{segment.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Members</span>
                  </div>
                  <span className="font-semibold">{segment.memberCount.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>Created: {new Date(segment.createdAt).toLocaleDateString()}</div>
                  <div>Updated: {new Date(segment.lastUpdated).toLocaleDateString()}</div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-1">
                    <Switch
                      checked={segment.status === "active"}
                      onCheckedChange={() => handleToggleStatus(segment.id)}
                    
                    />
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSegment(segment)
                        setIsViewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSegment(segment)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSegment(segment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Segment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: selectedSegment?.color }} />
              <span>{selectedSegment?.name}</span>
            </DialogTitle>
            <DialogDescription>{selectedSegment?.description}</DialogDescription>
          </DialogHeader>
          {selectedSegment && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="criteria">Criteria</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge className={getStatusBadge(selectedSegment.status)}>{selectedSegment.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Member Count</Label>
                    <div className="text-2xl font-bold">{selectedSegment.memberCount.toLocaleString()}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Created</Label>
                    <div>{new Date(selectedSegment.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <div>{new Date(selectedSegment.lastUpdated).toLocaleDateString()}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="criteria" className="space-y-4">
                <div className="space-y-3">
                  {selectedSegment.criteria.map((criteria, index) => (
                    <div key={criteria.id} className="border rounded-lg p-3">
                      {index > 0 && criteria.logicalOperator && (
                        <div className="text-sm font-medium text-muted-foreground mb-2">{criteria.logicalOperator}</div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">{criteria.field}</span>{" "}
                        <span className="text-muted-foreground">{criteria.operator}</span>{" "}
                        <span className="font-medium">{criteria.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email Campaign
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Gift className="h-4 w-4 mr-2" />
                    Create Targeted Offer
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    View Member List
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Export Analytics
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Segment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Segment</DialogTitle>
            <DialogDescription>Update segment information and criteria</DialogDescription>
          </DialogHeader>
          {selectedSegment && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="criteria">Criteria</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Segment Name *</Label>
                  <Input
                    id="edit-name"
                    value={selectedSegment.name}
                    onChange={(e) => setSelectedSegment({ ...selectedSegment, name: e.target.value })}
                    placeholder="Enter segment name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedSegment.description}
                    onChange={(e) => setSelectedSegment({ ...selectedSegment, description: e.target.value })}
                    placeholder="Describe this segment"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Segment Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="edit-color"
                      value={selectedSegment.color}
                      onChange={(e) => setSelectedSegment({ ...selectedSegment, color: e.target.value })}
                      className="w-12 h-8 rounded border"
                    />
                    <span className="text-sm text-muted-foreground">{selectedSegment.color}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="criteria" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Segment Criteria</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addCriteria(selectedSegment.criteria, (criteria) =>
                          setSelectedSegment({ ...selectedSegment, criteria }),
                        )
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Criteria
                    </Button>
                  </div>
                  {selectedSegment.criteria.map((criteria, index) => (
                    <div key={criteria.id} className="border rounded-lg p-4 space-y-3">
                      {index > 0 && (
                        <div className="flex items-center space-x-2">
                          <Select
                            value={criteria.logicalOperator}
                            onValueChange={(value) =>
                              updateCriteria(
                                criteria.id,
                                "logicalOperator",
                                value,
                                selectedSegment.criteria,
                                (criteria) => setSelectedSegment({ ...selectedSegment, criteria }),
                              )
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-3">
                        <Select
                          value={criteria.field}
                          onValueChange={(value) =>
                            updateCriteria(criteria.id, "field", value, selectedSegment.criteria, (criteria) =>
                              setSelectedSegment({ ...selectedSegment, criteria }),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="totalSpent">Total Spent</SelectItem>
                            <SelectItem value="transactionCount">Transaction Count</SelectItem>
                            <SelectItem value="pointsBalance">Points Balance</SelectItem>
                            <SelectItem value="tier">Loyalty Tier</SelectItem>
                            <SelectItem value="joinDate">Join Date</SelectItem>
                            <SelectItem value="lastPurchase">Last Purchase</SelectItem>
                            <SelectItem value="birthMonth">Birth Month</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={criteria.operator}
                          onValueChange={(value) =>
                            updateCriteria(criteria.id, "operator", value, selectedSegment.criteria, (criteria) =>
                              setSelectedSegment({ ...selectedSegment, criteria }),
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="=">=</SelectItem>
                            <SelectItem value="!=">!=</SelectItem>
                            <SelectItem value=">">{">"}</SelectItem>
                            <SelectItem value=">=">{">="}=</SelectItem>
                            <SelectItem value="<">{"<"}</SelectItem>
                            <SelectItem value="<=">{"<="}</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex space-x-2">
                          <Input
                            value={criteria.value}
                            onChange={(e) =>
                              updateCriteria(
                                criteria.id,
                                "value",
                                e.target.value,
                                selectedSegment.criteria,
                                (criteria) => setSelectedSegment({ ...selectedSegment, criteria }),
                              )
                            }
                            placeholder="Value"
                          />
                          {selectedSegment.criteria.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeCriteria(criteria.id, selectedSegment.criteria, (criteria) =>
                                  setSelectedSegment({ ...selectedSegment, criteria }),
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSegment}>Update Segment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DashboardLayout>
  )
}
