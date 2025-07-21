"use client"

import { useQuery } from "@tanstack/react-query"
import { loyaltyAPI } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function AvailableRewards() {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: loyaltyAPI.getRewards,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Available Rewards</CardTitle>
          <CardDescription>Redeem your points for great rewards</CardDescription>
        </div>
        <Link href="/consumer/rewards">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rewards?.slice(0, 3).map((reward: any) => (
            <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{reward.name}</h4>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
                <Badge variant="secondary" className="mt-1">
                  {reward.points} points
                </Badge>
              </div>
              <Button size="sm">Redeem</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
