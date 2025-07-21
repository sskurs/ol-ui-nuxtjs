"use client"

import { useQuery } from "@tanstack/react-query"
import { partnerAPI } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Gift } from "lucide-react"

export function RewardPerformance() {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ["partner-rewards"],
    queryFn: partnerAPI.getRewards,
  })

  // Mock data fallback
  const mockRewards = [
    {
      id: 1,
      name: "10% Store Discount",
      description: "Get 10% off any purchase",
      points: 500,
      redeemed: 125,
      available: 200,
      trend: "up",
      change: "+15%",
    },
    {
      id: 2,
      name: "Free Coffee",
      description: "Enjoy a complimentary coffee",
      points: 200,
      redeemed: 89,
      available: 150,
      trend: "up",
      change: "+8%",
    },
    {
      id: 3,
      name: "VIP Event Access",
      description: "Exclusive access to VIP events",
      points: 2000,
      redeemed: 12,
      available: 50,
      trend: "down",
      change: "-3%",
    },
  ]

  const displayRewards = rewards || mockRewards

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reward Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Performance</CardTitle>
        <CardDescription>How your rewards are performing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayRewards.map((reward: any) => {
            const redemptionRate = (reward.redeemed / (reward.redeemed + reward.available)) * 100
            const isPositiveTrend = reward.trend === "up"

            return (
              <div key={reward.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium">{reward.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isPositiveTrend ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${isPositiveTrend ? "text-green-600" : "text-red-600"}`}>
                      {reward.change}
                    </span>
                  </div>
                </div>

                <Progress value={redemptionRate} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">{reward.redeemed} redeemed</span>
                    <span className="text-muted-foreground">{reward.available} available</span>
                  </div>
                  <Badge variant="secondary">{reward.points} pts</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
