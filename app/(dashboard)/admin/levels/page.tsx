"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2, Award, Star, Crown, Diamond, Users, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { adminAPI } from "@/lib/api"

interface LoyaltyLevel {
  id: string
  name: string
  description: string
  pointsRequired: number
  color: string
  icon: string
  benefits: string[]
  multiplier: number
  isActive: boolean
  memberCount: number
  order: number
}

// Mock data for loyalty levels
const mockLevels: LoyaltyLevel[] = [
  {
    id: "1",
    name: "Bronze",
    description: "Entry level for new members",
    pointsRequired: 0,
    color: "#CD7F32",
    icon: "award",
    benefits: ["Basic rewards access", "Birthday bonus", "Member-only promotions"],
    multiplier: 1.0,
    isActive: true,
    memberCount: 1250,
    order: 1,
  },
  {
    id: "2",
    name: "Silver",
    description: "Intermediate level with enhanced benefits",
    pointsRequired: 1000,
    color: "#C0C0C0",
    icon: "star",
    benefits: [
      "All Bronze benefits",
      "Priority customer support",
      "Exclusive events access",
      "2x points on special days",
    ],
    multiplier: 1.2,
    isActive: true,
    memberCount: 850,
    order: 2,
  },
  {
    id: "3",
    name: "Gold",
    description: "Premium level with exclusive perks",
    pointsRequired: 5000,
    color: "#FFD700",
    icon: "crown",
    benefits: [
      "All Silver benefits",
      "Free shipping",
      "Personal account manager",
      "Early access to new products",
      "3x points multiplier",
    ],
    multiplier: 1.5,
    isActive: true,
    memberCount: 320,
    order: 3,
  },
  {
    id: "4",
    name: "Platinum",
    description: "Elite level with maximum benefits",
    pointsRequired: 15000,
    color: "#E5E4E2",
    icon: "diamond",
    benefits: [
      "All Gold benefits",
      "VIP customer service",
      "Exclusive platinum rewards",
      "Annual bonus points",
      "5x points multiplier",
      "Concierge service",
    ],
    multiplier: 2.0,
    isActive: true,
    memberCount: 85,
    order: 4,
  },
]

const iconMap = {
  award: Award,
  star: Star,
  crown: Crown,
  diamond: Diamond,
}

export default function LevelsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<LoyaltyLevel | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pointsRequired: 0,
    color: "#000000",
    icon: "award",
    benefits: [""],
    multiplier: 1.0,
    isActive: true,
  })

  const queryClient = useQueryClient()

  // Remove mockLevels and use only API data
  const levels = mockLevels;
  const isLoading = false;
  const isError = false;

  // Mock mutation for creating level
  const createLevelMutation = useMutation({
    mutationFn: async (levelData: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { ...levelData, id: Date.now().toString(), memberCount: 0, order: levels.length + 1 }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-levels"] })
      setIsCreateDialogOpen(false)
      resetForm()
      toast.success("Loyalty level created successfully!")
    },
    onError: () => {
      toast.error("Failed to create loyalty level")
    },
  })

  // Mock mutation for updating level
  const updateLevelMutation = useMutation({
    mutationFn: async ({ id, ...levelData }: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { id, ...levelData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-levels"] })
      setIsEditDialogOpen(false)
      setSelectedLevel(null)
      resetForm()
      toast.success("Loyalty level updated successfully!")
    },
    onError: () => {
      toast.error("Failed to update loyalty level")
    },
  })

  // Mock mutation for deleting level
  const deleteLevelMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-levels"] })
      toast.success("Loyalty level deleted successfully!")
    },
    onError: () => {
      toast.error("Failed to delete loyalty level")
    },
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pointsRequired: 0,
      color: "#000000",
      icon: "award",
      benefits: [""],
      multiplier: 1.0,
      isActive: true,
    })
  }

  const handleCreateLevel = () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }
    createLevelMutation.mutate(formData)
  }

  const handleEditLevel = () => {
    if (!selectedLevel || !formData.name || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }
    updateLevelMutation.mutate({ id: selectedLevel.id, ...formData })
  }

  const handleDeleteLevel = (level: LoyaltyLevel) => {
    if (level.memberCount > 0) {
      toast.error("Cannot delete level with active members")
      return
    }
    if (confirm(`Are you sure you want to delete the ${level.name} level?`)) {
      deleteLevelMutation.mutate(level.id)
    }
  }

  const openEditDialog = (level: LoyaltyLevel) => {
    setSelectedLevel(level)
    setFormData({
      name: level.name,
      description: level.description,
      pointsRequired: level.pointsRequired,
      color: level.color,
      icon: level.icon,
      benefits: level.benefits,
      multiplier: level.multiplier,
      isActive: level.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }))
  }

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }

  const updateBenefit = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => (i === index ? value : benefit)),
    }))
  }

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Loyalty Levels</h1>
              <p className="text-muted-foreground">Manage loyalty program tiers and benefits</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Loyalty Levels</h1>
              <p className="text-muted-foreground">Manage loyalty program tiers and benefits</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Error Loading Levels</CardTitle>
                <CardDescription>Failed to fetch loyalty levels from the server.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Please try again later or contact support.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Loyalty Levels</h1>
            <p className="text-muted-foreground">Manage loyalty program tiers and benefits</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Level
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Loyalty Level</DialogTitle>
                <DialogDescription>Define a new loyalty level with its requirements and benefits.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Level Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Bronze, Silver, Gold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pointsRequired">Points Required *</Label>
                    <Input
                      id="pointsRequired"
                      type="number"
                      value={formData.pointsRequired}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, pointsRequired: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this loyalty level..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="color">Level Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="award">Award</SelectItem>
                        <SelectItem value="star">Star</SelectItem>
                        <SelectItem value="crown">Crown</SelectItem>
                        <SelectItem value="diamond">Diamond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="multiplier">Points Multiplier</Label>
                    <Input
                      id="multiplier"
                      type="number"
                      step="0.1"
                      value={formData.multiplier}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, multiplier: Number.parseFloat(e.target.value) || 1.0 }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Benefits</Label>
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => updateBenefit(index, e.target.value)}
                          placeholder="Enter benefit..."
                        />
                        {formData.benefits.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeBenefit(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Benefit
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active Level</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLevel} disabled={createLevelMutation.isPending}>
                  {createLevelMutation.isPending ? "Creating..." : "Create Level"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Levels</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{levels?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {levels?.filter((l) => l.isActive).length || 0} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {levels?.reduce((sum, level) => sum + level.memberCount, 0).toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">Across all levels</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {levels?.sort((a, b) => b.pointsRequired - a.pointsRequired)[0]?.name || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {levels?.sort((a, b) => b.pointsRequired - a.pointsRequired)[0]?.pointsRequired.toLocaleString() || "0"}
                points required
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Multiplier</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(levels?.reduce((sum, level) => sum + level.multiplier, 0) / (levels?.length || 1)).toFixed(1) || "0"}x
              </div>
              <p className="text-xs text-muted-foreground">Points multiplier</p>
            </CardContent>
          </Card>
        </div>

        {/* Levels Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {levels
            ?.sort((a, b) => a.order - b.order)
            .map((level) => {
              const IconComponent = iconMap[level.icon as keyof typeof iconMap] || Award
              return (
                <Card key={level.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${level.color}20`, color: level.color }}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{level.name}</CardTitle>
                          <CardDescription>{level.pointsRequired.toLocaleString()} points required</CardDescription>
                        </div>
                      </div>
                      <Badge variant={level.isActive ? "default" : "secondary"}>
                        {level.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{level.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Members:</span>
                        <div className="text-lg font-bold">{level.memberCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Multiplier:</span>
                        <div className="text-lg font-bold">{level.multiplier}x</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="font-medium text-sm">Benefits:</span>
                      <ul className="mt-2 space-y-1">
                        {level.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {benefit}
                          </li>
                        ))}
                        {level.benefits.length > 3 && (
                          <li className="text-sm text-muted-foreground">+{level.benefits.length - 3} more benefits</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(level)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLevel(level)}
                        disabled={level.memberCount > 0}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
           }
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Loyalty Level</DialogTitle>
              <DialogDescription>Update the loyalty level settings and benefits.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Level Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Bronze, Silver, Gold"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pointsRequired">Points Required *</Label>
                  <Input
                    id="edit-pointsRequired"
                    type="number"
                    value={formData.pointsRequired}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pointsRequired: Number.parseInt(e.target.value) || 0 }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this loyalty level..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-color">Level Color</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="award">Award</SelectItem>
                      <SelectItem value="star">Star</SelectItem>
                      <SelectItem value="crown">Crown</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-multiplier">Points Multiplier</Label>
                  <Input
                    id="edit-multiplier"
                    type="number"
                    step="0.1"
                    value={formData.multiplier}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, multiplier: Number.parseFloat(e.target.value) || 1.0 }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Benefits</Label>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        placeholder="Enter benefit..."
                      />
                      {formData.benefits.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeBenefit(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Benefit
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="edit-isActive">Active Level</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditLevel} disabled={updateLevelMutation.isPending}>
                {updateLevelMutation.isPending ? "Updating..." : "Update Level"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
