"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuery } from "@tanstack/react-query"
import { adminAPI } from "@/lib/api"

export function MemberGrowth() {
  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminAPI.getAnalytics,
  })

  if (isLoading) {
    return <Card><CardHeader><CardTitle>Member Growth</CardTitle><CardDescription>Loading...</CardDescription></CardHeader></Card>;
  }
  if (isError || !analytics?.monthlyGrowth) {
    return <Card><CardHeader><CardTitle>Member Growth</CardTitle><CardDescription>Error loading data</CardDescription></CardHeader></Card>;
  }

  const growthData = analytics.monthlyGrowth;
  const currentMonth = growthData[growthData.length - 1];
  const previousMonth = growthData[growthData.length - 2] || { members: 0 };
  const monthlyGrowth = previousMonth.members > 0 ? ((currentMonth.members - previousMonth.members) / previousMonth.members) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Growth</CardTitle>
        <CardDescription>Monthly member acquisition trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{currentMonth.members.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">+{monthlyGrowth.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
          </div>

          <div className="space-y-3">
            {growthData.map((data, index) => (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{data.month}</span>
                  <span>
                    {data.members.toLocaleString()} (+{data.growth}%)
                  </span>
                </div>
                <Progress value={data.growth * 10} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
