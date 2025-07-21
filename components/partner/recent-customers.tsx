"use client"

import { useQuery } from "@tanstack/react-query"
import { partnerAPI } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Plus } from "lucide-react"
import Link from "next/link"

export function RecentCustomers() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["partner-customers"],
    queryFn: () => partnerAPI.getCustomers(1, 5),
  })

  const displayCustomers = customers?.customers || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>Latest customer activity</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
          <Link href="/partner/customers">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayCustomers.length === 0 ? (
            <div className="text-center text-muted-foreground">No customers found.</div>
          ) : (
            displayCustomers.slice(0, 5).map((customer: any) => (
              <div key={customer.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{customer.tier}</Badge>
                    <p className="text-sm font-medium">{customer.points?.toLocaleString()} pts</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Last visit: {customer.lastVisit}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
