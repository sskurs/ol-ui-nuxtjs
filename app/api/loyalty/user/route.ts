// app/api/loyalty/user/route.ts
// -----------------------------------------------------------
// Consumer loyalty data endpoint that integrates with Symfony backend
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  console.log("🔍 /api/loyalty/user route called!")
  
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  console.log("📋 Backend URL:", backendUrl)
  console.log("🔑 Token present:", !!token)

  if (!token) {
    console.log("❌ No token provided")
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  try {
    console.log("🌐 Fetching customer profile from backend...")
    
    // 1. Fetch customer profile
    const profileResponse = await fetch(`${backendUrl}/api/customer/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log("📡 Profile response status:", profileResponse.status)
    
    if (!profileResponse.ok) {
      console.log("❌ Failed to fetch customer profile:", profileResponse.status)
      return NextResponse.json({ message: "Failed to fetch customer profile" }, { status: profileResponse.status })
    }
    
    const customerProfile = await profileResponse.json()
    console.log("✅ Customer profile fetched:", customerProfile)

    // 2. Fetch transactions
    console.log("🌐 Fetching transactions from backend...")
    const txResponse = await fetch(`${backendUrl}/api/transaction?userId=${customerProfile.customerId}&limit=1000`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log("📡 Transactions response status:", txResponse.status)
    const txData = await txResponse.json()
    console.log("[DEBUG] txData from backend:", txData)
    const transactions = Array.isArray(txData.transactions) ? txData.transactions : []

    // 3. Fetch points from backend Points table
    console.log("🌐 Fetching points from backend...")
    let points = 0;
    try {
      const pointsResponse = await fetch(`${backendUrl}/api/points?userId=${customerProfile.customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log("📡 Points response status:", pointsResponse.status)
      
      if (pointsResponse.ok) {
        const pointsData = await pointsResponse.json();
        points = pointsData.points ?? 0;
        console.log("✅ Points fetched:", points)
      } else {
        console.log("⚠️ Points fetch failed, using 0")
      }
    } catch (e) {
      console.log("⚠️ Points fetch error, using 0:", e)
      points = 0;
    }

    // 4. Calculate totalEarned and totalRedeemed
    let totalEarned = 0
    let totalRedeemed = 0
    const partnerCount: Record<string, number> = {}
    transactions.forEach((tx: any) => {
      if (tx.amount > 0) totalEarned += tx.amount
      if (tx.amount < 0) totalRedeemed += Math.abs(tx.amount)
      // Count partners for favorite partners
      if (tx.partnerName) {
        partnerCount[tx.partnerName] = (partnerCount[tx.partnerName] || 0) + 1
      }
    })

    // 5. Calculate favorite partners (top 3)
    const favoritePartners = Object.entries(partnerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name)

    // 6. Recent activity (last 5 transactions)
    const recentActivity = transactions
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((tx: any) => ({
        action: tx.type === "earned" ? `Earned ${tx.amount} points` : `Redeemed ${Math.abs(tx.amount)} points`,
        date: tx.date,
        partner: tx.partnerName || "",
      }))

    // 7. Compose loyaltyData
    const loyaltyData = {
      points,
      tier: customerProfile.tier || customerProfile.level?.name,
      totalEarned,
      totalRedeemed,
      rewards: [], // TODO: fetch from backend if available
      transactions,
      favoritePartners,
      recentActivity,
      memberSince: customerProfile.createdAt,
    }

    console.log("✅ Returning loyalty data:", loyaltyData)
    return NextResponse.json(loyaltyData)
  } catch (error: unknown) {
    console.error("💥 Error in /api/loyalty/user:", error)
    return NextResponse.json({ message: "Failed to fetch loyalty data" }, { status: 500 })
  }
} 