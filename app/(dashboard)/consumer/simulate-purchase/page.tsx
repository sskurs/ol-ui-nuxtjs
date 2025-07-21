"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { loyaltyAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

export default function SimulatePurchasePage() {
  const [amount, setAmount] = useState("")
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const handleSimulate = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    setEarnedPoints(null)
    try {
      const response = await fetch("http://localhost:5000/api/transaction/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(amount),
          type: "purchase",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to simulate purchase");
      }
      setEarnedPoints(data.pointsEarned)
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Could not simulate the purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePurchase = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(amount),
          type: "purchase",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to complete purchase");
      }
      toast({
        title: "Purchase Successful",
        description: `You have earned ${data.pointsEarned} points.`,
      })
      router.push("/consumer/transactions")
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Could not complete the purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="consumer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Simulate Purchase</h1>
        <Card>
          <CardHeader>
            <CardTitle>Enter Purchase Amount</CardTitle>
            <CardDescription>See how many points you would earn for a purchase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 50.00"
              />
            </div>
            <Button onClick={handleSimulate} disabled={isLoading || !amount}>
              {isLoading ? "Simulating..." : "Simulate"}
            </Button>
            {earnedPoints !== null && (
              <div className="pt-4">
                <p className="text-lg">
                  You would earn <span className="font-bold">{earnedPoints}</span> points.
                </p>
                <Button onClick={handleCreatePurchase} className="mt-2">
                  Complete Purchase
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 