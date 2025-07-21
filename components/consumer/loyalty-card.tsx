"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface LoyaltyCardProps {
  loyaltyData: {
    points: number
    tier: string
  }
}

export function LoyaltyCard({ loyaltyData }: LoyaltyCardProps) {
  const { user } = useAuth()

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {loyaltyData?.tier} Member
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{loyaltyData?.points.toLocaleString()}</p>
            <p className="text-purple-100">Points</p>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-purple-100 text-sm">Member Since</p>
            <p className="font-semibold">Jan 2024</p>
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-sm">Card Number</p>
            <p className="font-mono">**** **** **** 1234</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
