"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Ban, CheckCircle, ArrowLeft, User, Pencil, Trash, Plus } from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"

export default function MemberDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAddingPoints, setIsAddingPoints] = useState(false)
  const [isStatusChanging, setIsStatusChanging] = useState(false)
  const [rewards, setRewards] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [redeemedRewards, setRedeemedRewards] = useState<any[]>([])
  // Add state for dialog visibility and editing
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<any>(null)
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<any>(null)
  const [redeemedDialogOpen, setRedeemedDialogOpen] = useState(false)
  const [editingRedeemed, setEditingRedeemed] = useState<any>(null)
  // Add state for loading
  const [rewardLoading, setRewardLoading] = useState(false)
  const [achievementLoading, setAchievementLoading] = useState(false)
  const [redeemedLoading, setRedeemedLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: string, id: number } | null>(null)
  const [partners, setPartners] = useState<any[]>([]);

  // Add useForm hooks for each entity
  const rewardForm = useForm({ defaultValues: { name: '', fromDate: '', toDate: '', availability: 0 } })
  const achievementForm = useForm({ defaultValues: { name: '', progress: 0, completed: false } })
  const redeemedForm = useForm({ defaultValues: { name: '', redeemedDate: '', transactionId: '', status: '' } })

  // Pre-fill forms for edit
  useEffect(() => {
    if (editingReward) rewardForm.reset(editingReward)
  }, [editingReward])
  useEffect(() => {
    if (editingAchievement) achievementForm.reset(editingAchievement)
  }, [editingAchievement])
  useEffect(() => {
    if (editingRedeemed) redeemedForm.reset(editingRedeemed)
  }, [editingRedeemed])

  // Move fetch functions out of useEffect so they can be used elsewhere
  const fetchRewards = async () => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}/rewards`)
      if (res.ok) setRewards(await res.json())
    } catch {}
  }
  const fetchAchievements = async () => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}/achievements`)
      if (res.ok) setAchievements(await res.json())
    } catch {}
  }
  const fetchRedeemedRewards = async () => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}/redeemed-rewards`)
      if (res.ok) setRedeemedRewards(await res.json())
    } catch {}
  }

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/members/${memberId}`)
        if (!res.ok) throw new Error("Failed to fetch member")
        const data = await res.json()
        setMember(data)
      } catch (e) {
        toast.error("Failed to load member details")
      } finally {
        setLoading(false)
      }
    }
    if (memberId) {
      fetchMember()
      fetchRewards()
      fetchAchievements()
      fetchRedeemedRewards()
    }
  }, [memberId])

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

  const handlePointsAdjustment = async (points: number) => {
    setIsAddingPoints(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch(`/api/admin/members/${memberId}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ points })
      })
      if (!response.ok) throw new Error('Failed to add points')
      toast.success(`Points added successfully`)
      // Refresh member data
      const res = await fetch(`/api/admin/members/${memberId}`)
      setMember(await res.json())
    } catch (error) {
      toast.error('Failed to add points')
    } finally {
      setIsAddingPoints(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsStatusChanging(true)
    try {
      const response = await fetch(`/api/admin/members/${memberId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      toast.success(`Member status updated to ${newStatus}`)
      // Refresh member data
      const res = await fetch(`/api/admin/members/${memberId}`)
      setMember(await res.json())
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setIsStatusChanging(false)
    }
  }

  // Handler functions for CRUD
  const handleRewardSubmit = async (data: any) => {
    setRewardLoading(true)
    const method = editingReward ? 'PUT' : 'POST'
    const url = editingReward ? `/api/admin/members/${memberId}/rewards/${editingReward.id}` : `/api/admin/members/${memberId}/rewards`
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setRewardDialogOpen(false)
        setEditingReward(null)
        await fetchRewards()
        toast.success(editingReward ? 'Reward updated' : 'Reward added')
      } else {
        toast.error('Failed to save reward')
      }
    } catch (error) {
      toast.error('Failed to save reward')
    } finally {
      setRewardLoading(false)
    }
  }
  const handleDeleteReward = async (id: number) => {
    setDeleteDialogOpen(true)
    setDeleteTarget({ type: 'reward', id })
  }
  // Repeat similar for achievements and redeemed rewards
  const handleAchievementSubmit = async (data: any) => {
    setAchievementLoading(true)
    const method = editingAchievement ? 'PUT' : 'POST'
    const url = editingAchievement ? `/api/admin/members/${memberId}/achievements/${editingAchievement.id}` : `/api/admin/members/${memberId}/achievements`
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setAchievementDialogOpen(false)
        setEditingAchievement(null)
        await fetchAchievements()
        toast.success(editingAchievement ? 'Achievement updated' : 'Achievement added')
      } else {
        toast.error('Failed to save achievement')
      }
    } catch (error) {
      toast.error('Failed to save achievement')
    } finally {
      setAchievementLoading(false)
    }
  }
  const handleDeleteAchievement = async (id: number) => {
    setDeleteDialogOpen(true)
    setDeleteTarget({ type: 'achievement', id })
  }
  const handleRedeemedSubmit = async (data: any) => {
    setRedeemedLoading(true)
    const method = editingRedeemed ? 'PUT' : 'POST'
    const url = editingRedeemed ? `/api/admin/members/${memberId}/redeemed-rewards/${editingRedeemed.id}` : `/api/admin/members/${memberId}/redeemed-rewards`
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setRedeemedDialogOpen(false)
        setEditingRedeemed(null)
        await fetchRedeemedRewards()
        toast.success(editingRedeemed ? 'Redeemed reward updated' : 'Redeemed reward added')
      } else {
        toast.error('Failed to save redeemed reward')
      }
    } catch (error) {
      toast.error('Failed to save redeemed reward')
    } finally {
      setRedeemedLoading(false)
    }
  }
  const handleDeleteRedeemed = async (id: number) => {
    setDeleteDialogOpen(true)
    setDeleteTarget({ type: 'redeemed', id })
  }

  if (loading) {
    return (
      <DashboardLayout role="admin" hideSidebar={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading member details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!member) {
    return (
      <DashboardLayout role="admin" hideSidebar={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600">Member Not Found</h3>
            <Button onClick={() => router.push('/admin/members')} className="mt-4" variant="outline">Back to Members</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin" hideSidebar={true}>
      <div className="w-full h-full min-h-screen flex flex-col">
        <div className="flex-shrink-0 p-4 sticky top-0 z-20 bg-background">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/members')} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Button>
        </div>
        <div className="flex-1 flex flex-col justify-center items-stretch px-0 pb-8">
          <div className="flex-1 flex flex-row gap-8 justify-center items-stretch">
            {/* Left: Member Overview */}
            <div className="w-full max-w-xs flex-shrink-0">
              <Card className="h-full flex flex-col shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Member Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm text-muted-foreground">{member.name || `${member.firstName || ""} ${member.lastName || ""}`}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Partner</Label>
                      <p className="text-sm text-muted-foreground">{getPartnerName(member.merchantId)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Member Since</Label>
                      <p className="text-sm text-muted-foreground">{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Current Points</Label>
                      <p className="text-sm text-muted-foreground">{member.points?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Spent</Label>
                      <p className="text-sm text-muted-foreground">${member.totalSpent?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Loyalty Card Number</Label>
                      <p className="text-sm text-muted-foreground">{member.loyaltyCardNumber || 'CD9898765654'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Registration Date</Label>
                      <p className="text-sm text-muted-foreground">{member.registrationDate ? new Date(member.registrationDate).toLocaleDateString() : (member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '-')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Segments</Label>
                      <div className="mb-2" />
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">One or more orders</span>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right: Tabs */}
            <div className="flex-1 min-w-0">
              <Tabs defaultValue="personal" className="w-full flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-8 mb-4">
                  <TabsTrigger value="personal">Personal Dashboard</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  <TabsTrigger value="redeemedRewards">Redeemed Rewards</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions" className="space-y-4 flex-1">
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Transaction Id</th>
                          <th className="px-4 py-2 text-left font-medium">Transaction Type</th>
                          <th className="px-4 py-2 text-left font-medium">Transaction Date</th>
                          <th className="px-4 py-2 text-left font-medium">Transaction Value</th>
                          <th className="px-4 py-2 text-left font-medium">Channel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(member.transactionsList ?? []).length > 0 ? (
                          member.transactionsList.map((tx: any) => (
                            <tr key={tx.id} className="border-b">
                              <td className="px-4 py-2">{tx.id}</td>
                              <td className="px-4 py-2">{tx.type}</td>
                              <td className="px-4 py-2">{tx.date ? new Date(tx.date).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-2">{typeof tx.value === 'number' ? `$${tx.value.toFixed(2)}` : tx.value}</td>
                              <td className="px-4 py-2">{tx.channel || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">No transactions found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="achievements" className="space-y-4 flex-1">
                  <div className="flex justify-end mb-4">
                    <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setEditingReward(null)} className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add New Reward
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingReward ? 'Edit Reward' : 'Add New Reward'}</DialogTitle>
                        </DialogHeader>
                        <Form {...rewardForm}>
                          <form onSubmit={rewardForm.handleSubmit(handleRewardSubmit)} className="space-y-4">
                            <FormItem>
                              <FormLabel>Reward Name</FormLabel>
                              <FormControl>
                                <input
                                  type="text"
                                  {...rewardForm.register('name', { required: 'Reward name is required' })}
                                  className="w-full"
                                  placeholder="e.g., Free Coffee"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormItem>
                              <FormLabel>From Date</FormLabel>
                              <FormControl>
                                <input
                                  type="date"
                                  {...rewardForm.register('fromDate', { required: 'From date is required' })}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormItem>
                              <FormLabel>To Date</FormLabel>
                              <FormControl>
                                <input
                                  type="date"
                                  {...rewardForm.register('toDate', { required: 'To date is required' })}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <input
                                  type="number"
                                  {...rewardForm.register('availability', {
                                    required: 'Availability is required',
                                    min: 0,
                                    max: 100,
                                  })}
                                  className="w-full"
                                  placeholder="e.g., 80"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <DialogFooter>
                              <Button type="submit" disabled={rewardLoading}>
                                {rewardLoading ? 'Saving...' : editingReward ? 'Update Reward' : 'Add Reward'}
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Reward Name</th>
                          <th className="px-4 py-2 text-left font-medium">From Date</th>
                          <th className="px-4 py-2 text-left font-medium">To Date</th>
                          <th className="px-4 py-2 text-left font-medium">Availability</th>
                          <th className="px-4 py-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rewards.length > 0 ? (
                          rewards.map((reward: any, idx: number) => (
                            <tr key={reward.id || idx} className="border-b">
                              <td className="px-4 py-2">{reward.name}</td>
                              <td className="px-4 py-2">{reward.fromDate ? new Date(reward.fromDate).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-2">{reward.toDate ? new Date(reward.toDate).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 min-w-[100px]">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${reward.availability ?? 0}%` }}></div>
                                    </div>
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground">{reward.availability ?? 0}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-2 flex items-center gap-2">
                                <Dialog open={rewardDialogOpen && editingReward?.id === reward.id} onOpenChange={setRewardDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingReward(reward)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Reward</DialogTitle>
                                    </DialogHeader>
                                    <Form {...rewardForm}>
                                      <form onSubmit={rewardForm.handleSubmit(handleRewardSubmit)} className="space-y-4">
                                        <FormItem>
                                          <FormLabel>Reward Name</FormLabel>
                                          <FormControl>
                                            <input
                                              type="text"
                                              {...rewardForm.register('name', { required: 'Reward name is required' })}
                                              className="w-full"
                                              placeholder="e.g., Free Coffee"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <FormItem>
                                          <FormLabel>From Date</FormLabel>
                                          <FormControl>
                                            <input
                                              type="date"
                                              {...rewardForm.register('fromDate', { required: 'From date is required' })}
                                              className="w-full"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <FormItem>
                                          <FormLabel>To Date</FormLabel>
                                          <FormControl>
                                            <input
                                              type="date"
                                              {...rewardForm.register('toDate', { required: 'To date is required' })}
                                              className="w-full"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <FormItem>
                                          <FormLabel>Availability</FormLabel>
                                          <FormControl>
                                            <input
                                              type="number"
                                              {...rewardForm.register('availability', {
                                                required: 'Availability is required',
                                                min: 0,
                                                max: 100,
                                              })}
                                              className="w-full"
                                              placeholder="e.g., 80"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <DialogFooter>
                                          <Button type="submit" disabled={rewardLoading}>
                                            {rewardLoading ? 'Updating...' : 'Update Reward'}
                                          </Button>
                                          <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                          </DialogClose>
                                        </DialogFooter>
                                      </form>
                                    </Form>
                                  </DialogContent>
                                </Dialog>
                                <Dialog open={deleteDialogOpen && deleteTarget?.id === reward.id && deleteTarget?.type === 'reward'} onOpenChange={setDeleteDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteReward(reward.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will permanently delete your reward.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                      <Button variant="destructive" onClick={() => {
                                        handleDeleteReward(reward.id);
                                        setDeleteDialogOpen(false);
                                      }} disabled={rewardLoading}>
                                        {rewardLoading ? 'Deleting...' : 'Delete Reward'}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">No rewards found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="redeemedRewards" className="space-y-4 flex-1">
                  <div className="flex justify-end mb-4">
                    <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setEditingRedeemed(null)} className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add New Redeemed Reward
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingRedeemed ? 'Edit Redeemed Reward' : 'Add New Redeemed Reward'}</DialogTitle>
                        </DialogHeader>
                        <Form {...redeemedForm}>
                          <form onSubmit={redeemedForm.handleSubmit(handleRedeemedSubmit)} className="space-y-4">
                            <FormItem>
                              <FormLabel>Reward Name</FormLabel>
                              <FormControl>
                                <input
                                  type="text"
                                  {...redeemedForm.register('name', { required: 'Reward name is required' })}
                                  className="w-full"
                                  placeholder="e.g., Free Coffee"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormItem>
                              <FormLabel>Redeemed Date</FormLabel>
                              <FormControl>
                                <input
                                  type="date"
                                  {...redeemedForm.register('redeemedDate', { required: 'Redeemed date is required' })}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormItem>
                              <FormLabel>Transaction Id</FormLabel>
                              <FormControl>
                                <input
                                  type="text"
                                  {...redeemedForm.register('transactionId', { required: 'Transaction ID is required' })}
                                  className="w-full"
                                  placeholder="e.g., TRX123456789"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <input
                                  type="text"
                                  {...redeemedForm.register('status', { required: 'Status is required' })}
                                  className="w-full"
                                  placeholder="e.g., Redeemed"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <DialogFooter>
                              <Button type="submit" disabled={redeemedLoading}>
                                {redeemedLoading ? 'Saving...' : editingRedeemed ? 'Update Redeemed Reward' : 'Add Redeemed Reward'}
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Reward Name</th>
                          <th className="px-4 py-2 text-left font-medium">Redeemed Date</th>
                          <th className="px-4 py-2 text-left font-medium">Transaction Id</th>
                          <th className="px-4 py-2 text-left font-medium">Status</th>
                          <th className="px-4 py-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {redeemedRewards.length > 0 ? (
                          redeemedRewards.map((reward: any, idx: number) => (
                            <tr key={reward.id || idx} className="border-b">
                              <td className="px-4 py-2">{reward.name}</td>
                              <td className="px-4 py-2">{reward.redeemedDate ? new Date(reward.redeemedDate).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-2">{reward.transactionId}</td>
                              <td className="px-4 py-2">{reward.status}</td>
                              <td className="px-4 py-2 flex items-center gap-2">
                                <Dialog open={rewardDialogOpen && editingRedeemed?.id === reward.id} onOpenChange={setRewardDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingRedeemed(reward)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Redeemed Reward</DialogTitle>
                                    </DialogHeader>
                                    <Form {...redeemedForm}>
                                      <form onSubmit={redeemedForm.handleSubmit(handleRedeemedSubmit)} className="space-y-4">
                                        <FormItem>
                                          <FormLabel>Reward Name</FormLabel>
                                          <FormControl>
                                            <input
                                              type="text"
                                              {...redeemedForm.register('name', { required: 'Reward name is required' })}
                                              className="w-full"
                                              placeholder="e.g., Free Coffee"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <FormItem>
                                          <FormLabel>Redeemed Date</FormLabel>
                                          <FormControl>
                                            <input
                                              type="date"
                                              {...redeemedForm.register('redeemedDate', { required: 'Redeemed date is required' })}
                                              className="w-full"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <FormItem>
                                          <FormLabel>Transaction Id</FormLabel>
                                          <FormControl>
                                            <input
                                              type="text"
                                              {...redeemedForm.register('transactionId', { required: 'Transaction ID is required' })}
                                              className="w-full"
                                              placeholder="e.g., TRX123456789"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <FormItem>
                                          <FormLabel>Status</FormLabel>
                                          <FormControl>
                                            <input
                                              type="text"
                                              {...redeemedForm.register('status', { required: 'Status is required' })}
                                              className="w-full"
                                              placeholder="e.g., Redeemed"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                        <DialogFooter>
                                          <Button type="submit" disabled={redeemedLoading}>
                                            {redeemedLoading ? 'Updating...' : 'Update Redeemed Reward'}
                                          </Button>
                                          <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                          </DialogClose>
                                        </DialogFooter>
                                      </form>
                                    </Form>
                                  </DialogContent>
                                </Dialog>
                                <Dialog open={deleteDialogOpen && deleteTarget?.id === reward.id && deleteTarget?.type === 'redeemed'} onOpenChange={setDeleteDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteRedeemed(reward.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will permanently delete your redeemed reward.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                      <Button variant="destructive" onClick={() => {
                                        handleDeleteRedeemed(reward.id);
                                        setDeleteDialogOpen(false);
                                      }} disabled={redeemedLoading}>
                                        {redeemedLoading ? 'Deleting...' : 'Delete Redeemed Reward'}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">No redeemed rewards found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="campaigns" className="space-y-4 flex-1">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Campaign Name</th>
                          <th className="px-4 py-2 text-left font-medium">Campaign Type</th>
                          <th className="px-4 py-2 text-left font-medium">Active From</th>
                          <th className="px-4 py-2 text-left font-medium">Active To</th>
                          <th className="px-4 py-2 text-left font-medium">Unit Limits</th>
                          <th className="px-4 py-2 text-left font-medium">Campaign Completion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(member.campaigns ?? []).length > 0 ? (
                          member.campaigns.map((campaign: any, idx: number) => (
                            <tr key={campaign.id || idx} className="border-b">
                              <td className="px-4 py-2">{campaign.name}</td>
                              <td className="px-4 py-2">{campaign.type}</td>
                              <td className="px-4 py-2">{campaign.activeFrom ? new Date(campaign.activeFrom).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-2">{campaign.activeTo ? new Date(campaign.activeTo).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-2">{campaign.unitLimits}</td>
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 min-w-[100px]">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${campaign.completion ?? 0}%` }}></div>
                                    </div>
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground">{campaign.completion ?? 0}%</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">No campaigns found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="space-y-4 flex-1">
                  <div>
                    <label className="text-sm font-medium">Last Activity</label>
                    <p className="text-sm text-muted-foreground">{member.lastActivity ? new Date(member.lastActivity).toLocaleString() : "No recent activity"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Transactions</label>
                    <p className="text-sm text-muted-foreground">{member.transactions || 0}</p>
                  </div>
                </TabsContent>
                <TabsContent value="actions" className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePointsAdjustment(100)}
                      disabled={isAddingPoints}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {isAddingPoints ? 'Adding...' : 'Add 100 Points'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handlePointsAdjustment(-50)}
                      disabled={isAddingPoints}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      Deduct 50 Points
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange("suspended")}
                      disabled={isStatusChanging}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange("active")}
                      disabled={isStatusChanging}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="personal" className="space-y-4 flex-1">
                  {/* Tier Section as horizontal row */}
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-medium text-base">Total Spending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${member.totalSpent?.toFixed(2) || '0.00'}</div>
                        <div className="text-muted-foreground text-sm">All time</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-medium text-base">Purchase Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{member.purchaseTransactions ?? member.transactions ?? 0}</div>
                        <div className="text-muted-foreground text-sm">All time</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-medium text-base">Avg. Purchase Transaction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {member.purchaseTransactions && member.totalSpent ? `$${(member.totalSpent / member.purchaseTransactions).toFixed(2)}` : '$0.00'}
                        </div>
                        <div className="text-muted-foreground text-sm">All time</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-medium text-base">Total Returns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{member.totalReturns ?? 0}</div>
                        <div className="text-muted-foreground text-sm">All time</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-medium text-base">Return Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{member.returnTransactions ?? 0}</div>
                        <div className="text-muted-foreground text-sm">All time</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-medium text-base">Days Since Last Transaction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {member.lastActivity ? Math.floor((Date.now() - new Date(member.lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}
                        </div>
                        <div className="text-muted-foreground text-sm">Days</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mb-6 border rounded-lg p-4">
                    <div className="font-medium text-base mb-2">Tier</div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Last leveling system</label>
                        <div className="text-sm">{member.lastLevelingSystem || 'Default'}</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Last Promotion</label>
                        <div className="text-sm">{member.lastPromotion ? new Date(member.lastPromotion).toLocaleDateString() : '16th July 2025'}</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Last down grade</label>
                        <div className="text-sm">{member.lastDowngrade ? new Date(member.lastDowngrade).toLocaleDateString() : '-'}</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Next recalculation</label>
                        <div className="text-sm">{member.nextRecalculation ? new Date(member.nextRecalculation).toLocaleDateString() : '-'}</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Current progress</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-[100px]">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${member.tierProgress ?? 50}%` }}></div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{member.tierProgress ?? 50}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Digital Wallets Section */}
                  <div className="mb-6 border rounded-lg p-4">
                    <div className="font-medium text-base mb-2">Digital wallets</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Total Points</label>
                        <div className="text-sm">{member.points?.toLocaleString() ?? 0}</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Spent points</label>
                        <div className="text-sm">{member.spentPoints?.toLocaleString() ?? 0}</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Expired Points</label>
                        <div className="text-sm">{member.expiredPoints?.toLocaleString() ?? 0}</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Total earned points</label>
                        <div className="text-sm">{member.earnedPoints?.toLocaleString() ?? 0}</div>
                      </div>
                    </div>
                  </div>

                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 