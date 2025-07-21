"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Coins, Gift, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  analytics: {
    totalCustomers: number
    pointsIssued: number
    rewardsRedeemed: number
    revenue: number
  }
}

export function PartnerStatsCards({ analytics }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Customers",
      value: analytics?.totalCustomers.toLocaleString() || "0",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Points Issued",
      value: analytics?.pointsIssued.toLocaleString() || "0",
      change: "+8%",
      icon: Coins,
      color: "text-green-600",
    },
    {
      title: "Rewards Redeemed",
      value: analytics?.rewardsRedeemed.toLocaleString() || "0",
      change: "+15%",
      icon: Gift,
      color: "text-purple-600",
    },
    {
      title: "Revenue Impact",
      value: `$${analytics?.revenue.toLocaleString() || "0"}`,
      change: "+23%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
