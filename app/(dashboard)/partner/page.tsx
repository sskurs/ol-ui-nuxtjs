"use client"

import { useQuery } from "@tanstack/react-query"
import { partnerAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Gift, DollarSign, BarChart3, Target, RefreshCw, PlusCircle, Activity } from "lucide-react"
import { useState } from "react"

export default function PartnerDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ["partner-analytics", timeRange],
    queryFn: () => partnerAPI.getAnalytics({ timeRange }),
  })

  if (isLoading) {
    return (
      <DashboardLayout role="partner">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (isError || !analytics) {
    return (
      <DashboardLayout role="partner">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <div className="text-red-500">Failed to load analytics data.</div>
        </div>
      </DashboardLayout>
    )
  }

  const data = analytics

  return (
    <DashboardLayout role="partner">
      <div className="space-y-8">
        {/* Header & Time Range */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <PlusCircle className="w-4 h-4" /> Add Reward
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.totalCustomers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{data.trends.customerGrowth}%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.pointsIssued.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{data.trends.pointsGrowthRate}%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.overview.revenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{data.trends.revenueGrowth}%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.rewardRedemptionRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">+{data.trends.redemptionGrowth}%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Segments & Top Rewards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Breakdown by loyalty tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.customerSegments.map((segment) => (
                  <div key={segment.tier} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{segment.tier}</Badge>
                        <span className="text-sm font-medium">{segment.count} customers</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Avg: ₹{segment.avgSpend}</span>
                    </div>
                    <Progress value={segment.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">{segment.percentage}% of total customers</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Rewards</CardTitle>
              <CardDescription>Most redeemed rewards this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topRewards.map((reward, index) => (
                  <div key={reward.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-sm text-muted-foreground">{reward.redemptions} redemptions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{reward.revenue}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Goals</CardTitle>
            <CardDescription>Track your progress towards monthly targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {data.goals.map((goal) => (
                <div key={goal.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{goal.name}</h4>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{goal.current.toLocaleString()}</span>
                      <span className="text-muted-foreground">{goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={goal.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {goal.percentage.toFixed(1)}% of target achieved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
              <CardDescription>Percentage of returning customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.overview.customerRetention}%</div>
              <Progress value={data.overview.customerRetention} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
              <CardDescription>Average spend per transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{data.overview.avgOrderValue}</div>
              <p className="text-sm text-muted-foreground mt-2">+5.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Customers</CardTitle>
              <CardDescription>Customers active this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.overview.activeCustomers}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {((data.overview.activeCustomers / data.overview.totalCustomers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{activity.description}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}