"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { partnerAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Gift, TrendingUp, Users, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RewardsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingReward, setEditingReward] = useState<any>(null)
  const [rewardForm, setRewardForm] = useState({
    name: "",
    description: "",
    points: "",
    category: "",
    expiryDays: "",
    maxRedemptions: "",
    isActive: true,
    termsAndConditions: "",
  })
  const { toast } = useToast()

  // Remove mockRewards and use only API data
  const { data: rewards, isLoading, isError } = useQuery({
    queryKey: ["partner-rewards"],
    queryFn: partnerAPI.getRewards,
  })

  // Mock rewards data
  const mockRewards = [
    {
      id: 1,
      name: "10% Store Discount",
      description: "Get 10% off any purchase in our store",
      points: 500,
      category: "discount",
      redeemed: 125,
      available: 200,
      isActive: true,
      expiryDays: 30,
      createdDate: "2024-01-01",
      revenue: 2500.0,
      conversionRate: 38.5,
    },
    {
      id: 2,
      name: "Free Coffee",
      description: "Enjoy a complimentary coffee of your choice",
      points: 200,
      category: "food",
      redeemed: 89,
      available: 150,
      isActive: true,
      expiryDays: 7,
      createdDate: "2024-01-01",
      revenue: 890.0,
      conversionRate: 37.2,
    },
    {
      id: 3,
      name: "VIP Event Access",
      description: "Exclusive access to VIP events and member experiences",
      points: 2000,
      category: "experience",
      redeemed: 12,
      available: 50,
      isActive: false,
      expiryDays: 90,
      createdDate: "2023-12-15",
      revenue: 1200.0,
      conversionRate: 19.4,
    },
    {
      id: 4,
      name: "Free Shipping",
      description: "Free shipping on your next online order",
      points: 300,
      category: "shipping",
      redeemed: 67,
      available: 100,
      isActive: true,
      expiryDays: 14,
      createdDate: "2024-01-10",
      revenue: 670.0,
      conversionRate: 40.1,
    },
  ]

  const displayRewards = rewards || mockRewards

  const handleCreateReward = async () => {
    if (!rewardForm.name || !rewardForm.points || !rewardForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      await partnerAPI.createReward(rewardForm)
      toast({
        title: "Reward Created",
        description: `Successfully created reward: ${rewardForm.name}`,
      })
      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateReward = async () => {
    if (!editingReward) return

    try {
      await partnerAPI.updateReward(editingReward.id.toString(), rewardForm)
      toast({
        title: "Reward Updated",
        description: `Successfully updated reward: ${rewardForm.name}`,
      })
      setEditingReward(null)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteReward = async (rewardId: number, rewardName: string) => {
    try {
      await partnerAPI.deleteReward(rewardId.toString())
      toast({
        title: "Reward Deleted",
        description: `Successfully deleted reward: ${rewardName}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setRewardForm({
      name: "",
      description: "",
      points: "",
      category: "",
      expiryDays: "",
      maxRedemptions: "",
      isActive: true,
      termsAndConditions: "",
    })
  }

  const openEditDialog = (reward: any) => {
    setEditingReward(reward)
    setRewardForm({
      name: reward.name,
      description: reward.description,
      points: reward.points.toString(),
      category: reward.category,
      expiryDays: reward.expiryDays.toString(),
      maxRedemptions: reward.available.toString(),
      isActive: reward.isActive,
      termsAndConditions: reward.termsAndConditions || "",
    })
  }

  const totalRedemptions = displayRewards.reduce((sum, r) => sum + r.redeemed, 0)
  const totalRevenue = displayRewards.reduce((sum, r) => sum + r.revenue, 0)
  const avgConversionRate = displayRewards.reduce((sum, r) => sum + r.conversionRate, 0) / displayRewards.length

  if (isLoading) {
    return (
      <DashboardLayout role="partner">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Reward Management</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="partner">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reward Management</h1>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Reward
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayRewards.length}</div>
              <p className="text-xs text-muted-foreground">{displayRewards.filter((r) => r.isActive).length} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRedemptions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From redemptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Redemption rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Rewards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayRewards.map((reward) => (
            <Card key={reward.id} className={`${!reward.isActive ? "opacity-60" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <CardDescription className="mt-1">{reward.description}</CardDescription>
                  </div>
                  <Badge variant={reward.isActive ? "default" : "secondary"}>
                    {reward.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="font-bold">
                    {reward.points} points
                  </Badge>
                  <Badge variant="secondary">{reward.category}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{reward.redeemed}</p>
                    <p className="text-muted-foreground">Redeemed</p>
                  </div>
                  <div>
                    <p className="font-medium">{reward.available}</p>
                    <p className="text-muted-foreground">Available</p>
                  </div>
                  <div>
                    <p className="font-medium">${reward.revenue.toFixed(2)}</p>
                    <p className="text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="font-medium">{reward.conversionRate}%</p>
                    <p className="text-muted-foreground">Conversion</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => openEditDialog(reward)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleDeleteReward(reward.id, reward.name)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Reward Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Reward</DialogTitle>
              <DialogDescription>Add a new reward to your loyalty program</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Reward Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter reward name"
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points Required *</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="Enter points"
                    value={rewardForm.points}
                    onChange={(e) => setRewardForm((prev) => ({ ...prev, points: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter reward description"
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={rewardForm.category}
                    onValueChange={(value) => setRewardForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="merchandise">Merchandise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDays">Expiry (Days)</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    placeholder="Enter expiry days"
                    value={rewardForm.expiryDays}
                    onChange={(e) => setRewardForm((prev) => ({ ...prev, expiryDays: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxRedemptions">Max Redemptions</Label>
                  <Input
                    id="maxRedemptions"
                    type="number"
                    placeholder="Enter max redemptions"
                    value={rewardForm.maxRedemptions}
                    onChange={(e) => setRewardForm((prev) => ({ ...prev, maxRedemptions: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={rewardForm.isActive}
                    onCheckedChange={(checked) => setRewardForm((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Enter terms and conditions"
                  value={rewardForm.termsAndConditions}
                  onChange={(e) => setRewardForm((prev) => ({ ...prev, termsAndConditions: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReward}>Create Reward</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Reward Dialog */}
        <Dialog open={!!editingReward} onOpenChange={() => setEditingReward(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Reward</DialogTitle>
              <DialogDescription>Update reward details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Reward Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="Enter reward name"
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-points">Points Required *</Label>
                  <Input
                    id="edit-points"
                    type="number"
                    placeholder="Enter points"
                    value={rewardForm.points}
                    onChange={(e) => setRewardForm((prev) => ({ ...prev, points: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Enter reward description"
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={rewardForm.category}
                    onValueChange={(value) => setRewardForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="merchandise">Merchandise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="edit-isActive"
                    checked={rewardForm.isActive}
                    onCheckedChange={(checked) => setRewardForm((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="edit-isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingReward(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateReward}>Update Reward</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
