"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Trophy, Gift, TrendingUp } from "lucide-react"
import { LoyaltyCard } from "@/components/consumer/loyalty-card"
import { RecentTransactions } from "@/components/consumer/recent-transactions"
import { AvailableRewards } from "@/components/consumer/available-rewards"

export default function ConsumerDashboard() {
  const [points, setPoints] = useState(0)
  const [tier, setTier] = useState("N/A")
  const [rewardsCount, setRewardsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate points earned this month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const [monthlyPoints, setMonthlyPoints] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) throw new Error("No token or user found")
        const user = JSON.parse(userStr)
        const userId = user.id

        // Fetch points directly from backend
        const pointsRes = await fetch(`http://localhost:5000/api/admin/members/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (!pointsRes.ok) throw new Error("Failed to fetch points")
        const pointsData = await pointsRes.json()
        setPoints(pointsData.Points ?? 0)

        // Fetch profile directly from backend
        const profileRes = await fetch(`http://localhost:5000/api/customer/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const profileData = await profileRes.json()
        setTier(profileData.tier || profileData.level?.name || "N/A")

        // Fetch transactions directly from backend
        const txRes = await fetch(`http://localhost:5000/api/transaction?userId=${userId}&limit=1000`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (!txRes.ok) throw new Error("Failed to fetch transactions")
        const txData = await txRes.json()
        setRewardsCount(txData.transactions?.length || 0)

        // Calculate points earned this month
        const monthPoints = (txData.transactions || [])
          .filter((tx: any) => {
            if (tx.type !== "points_earned") return false;
            const txDate = new Date(tx.date);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
          })
          .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
        setMonthlyPoints(monthPoints);
      } catch (e: any) {
        setError(e.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout role="consumer">
        <div>Loading...</div>
      </DashboardLayout>
    )
  }
  if (error) {
    return (
      <DashboardLayout role="consumer">
        <div className="text-red-600">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="consumer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {tier} Member
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{points.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tier}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rewardsCount}</div>
              <p className="text-xs text-muted-foreground">Ready to redeem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Points earned</p>
            </CardContent>
          </Card>
        </div>
        <LoyaltyCard loyaltyData={{ points, tier }} />
        <div className="grid gap-6 md:grid-cols-2">
          <RecentTransactions />
          <AvailableRewards />
        </div>
      </div>
    </DashboardLayout>
  )
}
