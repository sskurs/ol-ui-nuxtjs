"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building, Coins, DollarSign, TrendingUp, Activity, Award, Clock } from "lucide-react"

interface AnalyticsDashboardProps {
  analytics: {
    totalMembers: number
    activePartners: number
    pointsCirculating: number
    systemRevenue: number
    averagePointsPerMember: number
    totalSpent: number
    totalTransactions: number
    tierDistribution: {
      bronze: number
      silver: number
      gold: number
      platinum: number
    }
    topMembers: Array<{
      id: string
      name: string
      points: number
      tier: string
      totalSpent: number
    }>
    recentActivity: Array<{
      id: string
      name: string
      lastActivity: string
      points: number
    }>
    monthlyGrowth: Array<{
      month: string
      members: number
      revenue: number
      points: number
    }>
  }
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'bg-orange-100 text-orange-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'platinum': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active loyalty members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Circulating</CardTitle>
            <Coins className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pointsCirculating.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {analytics.averagePointsPerMember.toLocaleString()} per member
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.systemRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total spent by members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Points earned/spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Tier Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.tierDistribution.bronze}</div>
              <p className="text-sm text-muted-foreground">Bronze</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{analytics.tierDistribution.silver}</div>
              <p className="text-sm text-muted-foreground">Silver</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{analytics.tierDistribution.gold}</div>
              <p className="text-sm text-muted-foreground">Gold</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.tierDistribution.platinum}</div>
              <p className="text-sm text-muted-foreground">Platinum</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Members by Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topMembers.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">₹{member.totalSpent.toLocaleString()} spent</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{member.points.toLocaleString()} pts</div>
                    <Badge className={getTierColor(member.tier)}>{member.tier}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {activity.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(activity.lastActivity)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{activity.points.toLocaleString()} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {analytics.monthlyGrowth.slice(0, 6).map((month) => (
              <div key={month.month} className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold">{month.month}</div>
                <div className="text-sm text-muted-foreground">
                  {month.members} members
                </div>
                <div className="text-sm text-muted-foreground">
                  ₹{month.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {month.points.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 