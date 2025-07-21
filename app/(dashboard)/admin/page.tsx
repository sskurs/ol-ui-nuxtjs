"use client"

import { useQuery } from "@tanstack/react-query"
import { adminAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AdminStatsCards } from "@/components/admin/stats-cards"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { SystemActivity } from "@/components/admin/system-activity"
import { MemberGrowth } from "@/components/admin/member-growth"

export default function AdminDashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminAPI.getAnalytics,
  })

  const { data: customersStats, isLoading: customersLoading } = useQuery({
    queryKey: ["admin-customers-stats"],
    queryFn: adminAPI.getCustomersStats,
  })

  // Log the correct analytics fields for debugging
  if (analytics) {
    console.log(`Returning real-time analytics: totalMembers=${analytics.totalMembers}, pointsCirculating=${analytics.pointsCirculating}, systemRevenue=${analytics.systemRevenue}, totalSpent=${analytics.totalSpent}, totalTransactions=${analytics.totalTransactions}`);
  }
  if (customersStats) {
    console.log(`Returning real-time customer stats: total=${customersStats.total}, active=${customersStats.active}, inactive=${customersStats.inactive}`);
  }

  if (analyticsLoading || customersLoading) {
    return (
      <DashboardLayout role="admin">
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  // Use real-time analytics data
  const combinedAnalytics = {
    totalMembers: analytics?.totalMembers || customersStats?.total || 0,
    activePartners: analytics?.activePartners || 0,
    pointsCirculating: analytics?.pointsCirculating || 0,
    systemRevenue: analytics?.systemRevenue || 0,
    averagePointsPerMember: analytics?.averagePointsPerMember || 0,
    totalSpent: analytics?.totalSpent || 0,
    totalTransactions: analytics?.totalTransactions || 0,
    tierDistribution: analytics?.tierDistribution || { bronze: 0, silver: 0, gold: 0, platinum: 0 },
    topMembers: analytics?.topMembers || [],
    recentActivity: analytics?.recentActivity || [],
    monthlyGrowth: analytics?.monthlyGrowth || []
  }

  console.log("Combined analytics:", combinedAnalytics);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Overview</h1>
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards analytics={combinedAnalytics} />

        {/* Analytics Dashboard */}
        <AnalyticsDashboard analytics={combinedAnalytics} />

        <div className="grid gap-6 md:grid-cols-2">
          {/* System Activity */}
          <SystemActivity />

          {/* Member Growth */}
          <MemberGrowth />
        </div>
      </div>
    </DashboardLayout>
  )
}
