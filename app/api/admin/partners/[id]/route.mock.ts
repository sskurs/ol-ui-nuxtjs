import { NextRequest, NextResponse } from "next/server"

interface Partner {
  id: string
  name: string
  businessType: string
  email: string
  phone: string
  address: string
  joinDate: string
  status: "active" | "pending" | "suspended" | "rejected"
  members: number
  pointsIssued: number
  revenue: number
  commission: number
  performance: "excellent" | "good" | "fair" | "poor"
  lastActivity: string
}

// Use the same mockPartners array as in the parent route (in-memory for now)
let mockPartners: Partner[] = [
  {
    id: "1",
    name: "Coffee Shop Co",
    businessType: "Food & Beverage",
    email: "contact@coffeeshop.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    joinDate: "2023-01-15",
    status: "active",
    members: 1250,
    pointsIssued: 125000,
    revenue: 25000,
    commission: 2500,
    performance: "excellent",
    lastActivity: "2024-01-06",
  },
  {
    id: "2",
    name: "Fashion Boutique",
    businessType: "Retail",
    email: "info@fashionboutique.com",
    phone: "+1 (555) 234-5678",
    address: "456 Fashion Ave, City, State 12345",
    joinDate: "2023-02-20",
    status: "active",
    members: 890,
    pointsIssued: 89000,
    revenue: 18000,
    commission: 1800,
    performance: "good",
    lastActivity: "2024-01-05",
  },
  {
    id: "3",
    name: "Fitness Center",
    businessType: "Health & Wellness",
    email: "hello@fitnesscenter.com",
    phone: "+1 (555) 345-6789",
    address: "789 Gym St, City, State 12345",
    joinDate: "2023-03-10",
    status: "suspended",
    members: 650,
    pointsIssued: 65000,
    revenue: 13000,
    commission: 1300,
    performance: "fair",
    lastActivity: "2023-12-20",
  },
  {
    id: "4",
    name: "Tech Store",
    businessType: "Electronics",
    email: "support@techstore.com",
    phone: "+1 (555) 456-7890",
    address: "321 Tech Blvd, City, State 12345",
    joinDate: "2023-11-15",
    status: "pending",
    members: 0,
    pointsIssued: 0,
    revenue: 0,
    commission: 0,
    performance: "poor",
    lastActivity: "2023-11-15",
  },
  {
    id: "5",
    name: "Restaurant Deluxe",
    businessType: "Food & Beverage",
    email: "info@restaurantdeluxe.com",
    phone: "+1 (555) 567-8901",
    address: "654 Gourmet St, City, State 12345",
    joinDate: "2023-04-05",
    status: "active",
    members: 2100,
    pointsIssued: 210000,
    revenue: 42000,
    commission: 4200,
    performance: "excellent",
    lastActivity: "2024-01-07",
  },
  {
    id: "6",
    name: "Beauty Salon",
    businessType: "Health & Wellness",
    email: "hello@beautysalon.com",
    phone: "+1 (555) 678-9012",
    address: "987 Beauty Ave, City, State 12345",
    joinDate: "2023-05-12",
    status: "active",
    members: 750,
    pointsIssued: 75000,
    revenue: 15000,
    commission: 1500,
    performance: "good",
    lastActivity: "2024-01-04",
  },
  {
    id: "7",
    name: "Bookstore Plus",
    businessType: "Retail",
    email: "contact@bookstoreplus.com",
    phone: "+1 (555) 789-0123",
    address: "147 Library St, City, State 12345",
    joinDate: "2023-06-18",
    status: "pending",
    members: 0,
    pointsIssued: 0,
    revenue: 0,
    commission: 0,
    performance: "poor",
    lastActivity: "2023-06-18",
  },
  {
    id: "8",
    name: "Auto Service Center",
    businessType: "Automotive",
    email: "service@autocenter.com",
    phone: "+1 (555) 890-1234",
    address: "258 Garage St, City, State 12345",
    joinDate: "2023-07-22",
    status: "active",
    members: 1800,
    pointsIssued: 180000,
    revenue: 36000,
    commission: 3600,
    performance: "excellent",
    lastActivity: "2024-01-08",
  },
]

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const idx = mockPartners.findIndex(p => p.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }
    mockPartners[idx] = { ...mockPartners[idx], ...body }
    return NextResponse.json({ message: "Partner updated", partner: mockPartners[idx] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const idx = mockPartners.findIndex(p => p.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }
    mockPartners.splice(idx, 1)
    return NextResponse.json({ message: "Partner deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
} 