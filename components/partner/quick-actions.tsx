"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, BarChart3, Gift } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Issue Points",
      description: "Award points to customers",
      icon: Plus,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Issue points"),
    },
    {
      title: "Validate Redemption",
      description: "Confirm reward redemptions",
      icon: CheckCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Validate redemption"),
    },
    {
      title: "Create Reward",
      description: "Add new rewards",
      icon: Gift,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Create reward"),
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: BarChart3,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("View analytics"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used partner tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                onClick={action.action}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
