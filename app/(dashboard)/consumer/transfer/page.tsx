"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowRightLeft } from "lucide-react"

export default function TransferPointsPage() {
    const { toast } = useToast()
    const [members, setMembers] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [senderBalance, setSenderBalance] = useState(0)
    const [recipient, setRecipient] = useState<any>(null)
    const [recipientBalance, setRecipientBalance] = useState(0)
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem("token")
                const userStr = localStorage.getItem("user")
                if (!token || !userStr) throw new Error("Authentication failed")
                
                const user = JSON.parse(userStr)
                setCurrentUser(user)

                // Fetch all members
                const membersRes = await fetch(`http://localhost:5000/api/customer/all`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                if (!membersRes.ok) throw new Error("Failed to fetch members")
                const allMembers = await membersRes.json()
                setMembers(allMembers.filter((m: any) => m.id !== user.id))

                // Fetch sender balance
                const balanceRes = await fetch(`http://localhost:5000/api/points?userId=${user.id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                if (!balanceRes.ok) throw new Error("Failed to fetch balance")
                const balanceData = await balanceRes.json()
                setSenderBalance(balanceData.points ?? 0)
            } catch (e: any) {
                setError(e.message)
                toast({ title: "Error", description: e.message, variant: "destructive" })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [toast])

    const handleRecipientChange = async (recipientId: string) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return
            
            const selected = members.find(m => m.id.toString() === recipientId)
            setRecipient(selected)

            const balanceRes = await fetch(`http://localhost:5000/api/points?userId=${recipientId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const balanceData = await balanceRes.json()
            setRecipientBalance(balanceData.points ?? 0)
        } catch (e: any) {
            toast({ title: "Error", description: "Failed to fetch recipient balance", variant: "destructive"})
        }
    }

    const handleTransfer = async () => {
        if (!recipient || !amount) {
            toast({ title: "Validation Error", description: "Please select a recipient and enter an amount.", variant: "destructive"})
            return
        }
        const transferAmount = parseFloat(amount)
        if (transferAmount <= 0 || transferAmount > senderBalance) {
            toast({ title: "Validation Error", description: "Invalid transfer amount.", variant: "destructive"})
            return
        }

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`http://localhost:5000/api/points/transfer`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ toUserId: recipient.id, amount: transferAmount })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Transfer failed")
            }
            const result = await res.json()
            setSenderBalance(result.newSenderBalance)
            setAmount("")
            setRecipient(null)
            setRecipientBalance(0)
            toast({ title: "Success", description: result.message })
        } catch (e: any) {
            toast({ title: "Transfer Error", description: e.message, variant: "destructive" })
        }
    }

    if (loading) return <DashboardLayout role="consumer"><div>Loading...</div></DashboardLayout>
    if (error) return <DashboardLayout role="consumer"><div className="text-red-500">{error}</div></DashboardLayout>

    return (
        <DashboardLayout role="consumer">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Transfer Points</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Transfer</CardTitle>
                        <CardDescription>Send points to another member.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Your Balance</Label>
                                <Input value={`${senderBalance.toLocaleString()} points`} disabled />
                            </div>
                            <div>
                                <Label htmlFor="recipient">Recipient</Label>
                                <Select onValueChange={handleRecipientChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map(member => (
                                            <SelectItem key={member.id} value={member.id.toString()}>
                                                {member.name} ({member.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {recipient && (
                            <div>
                                <Label>Recipient Balance</Label>
                                <Input value={`${recipientBalance.toLocaleString()} points`} disabled />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="amount">Amount to Transfer</Label>
                            <Input 
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g., 100"
                            />
                        </div>
                        <Button onClick={handleTransfer}>
                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                            Transfer
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
} 