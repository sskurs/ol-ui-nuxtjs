"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Building, Settings } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { adminAPI } from "@/lib/api"

export function SystemActivity() {
  const { data: activityData, isLoading, isError } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: adminAPI.getActivity,
  })
  const activities = activityData?.activities || [];

  if (isLoading) {
    return <Card><CardHeader><CardTitle>Recent System Activity</CardTitle><CardDescription>Loading...</CardDescription></CardHeader></Card>;
  }
  if (isError) {
    return <Card><CardHeader><CardTitle>Recent System Activity</CardTitle><CardDescription>Error loading data</CardDescription></CardHeader></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent System Activity</CardTitle>
        <CardDescription>Latest events across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.badge}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
