"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

export default function SimulatePurchasePage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")

  useEffect(() => {
    // Fetch all users (for demo, you may want to filter by partner)
    fetch("http://localhost:5000/api/admin/members", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data.members || []))
      .catch(() => toast({ title: "Error", description: "Failed to load users", variant: "destructive" }))
  }, [])

  const handleSimulate = async () => {
    if (!selectedUserId || !amount) {
      toast({ title: "Error", description: "User and amount are required", variant: "destructive" })
      return
    }
    setLoading(true)
    setResult("")
    try {
      const res = await fetch("http://localhost:5000/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: parseInt(selectedUserId),
          amount: parseFloat(amount),
          type: "purchase"
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to simulate purchase")
      setResult(`Transaction successful! Points awarded: ${data.pointsAwarded}`)
      toast({ title: "Success", description: `Points awarded: ${data.pointsAwarded}` })
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to simulate purchase", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Simulate User Purchase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>User</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.firstName} {user.lastName} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Amount</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter purchase amount" />
          </div>
          <Button onClick={handleSimulate} disabled={loading} className="w-full">
            {loading ? "Simulating..." : "Simulate Purchase"}
          </Button>
          {result && <div className="text-green-600 font-semibold mt-2">{result}</div>}
        </CardContent>
      </Card>
    </div>
  )
} 