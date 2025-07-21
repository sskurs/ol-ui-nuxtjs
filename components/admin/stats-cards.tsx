"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, Coins, DollarSign } from "lucide-react"

interface StatsCardsProps {
  analytics: {
    totalMembers: number
    activePartners: number
    pointsCirculating: number
    systemRevenue: number
  }
}

export function AdminStatsCards({ analytics }: StatsCardsProps) {
  console.log("Analytics data:", analytics);
  console.log("Analytics type:", typeof analytics);
  console.log("totalMembers value:", analytics?.totalMembers);
  console.log("totalMembers type  :", typeof analytics?.totalMembers);
  
  const stats = [
    {
      title: "Total Members",
      value: analytics?.totalMembers !== undefined ? analytics.totalMembers.toLocaleString() : "-",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Partners",
      value: analytics?.activePartners?.toLocaleString() || "89",
      change: "+5%",
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Points Circulating",
      value: analytics?.pointsCirculating?.toLocaleString() || "2,450,000",
      change: "+8%",
      icon: Coins,
      color: "text-purple-600",
    },
    {
      title: "System Revenue",
      value: `₹${analytics?.systemRevenue?.toLocaleString() || "10,500,000"}`,
      change: "+15%",
      icon: DollarSign,
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
