"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Award,
  BarChart,
  Settings,
  LogOut,
  User,
  Gift,
  History,
  Play,
  ChevronRight,
  ArrowRightLeft,
  UserCheck,
  Building,
  Target,
  ArrowLeftRight,
  Receipt,
  Calculator,
  List,
  CreditCard,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"

interface NavigationItem {
  name: string
  href?: string
  icon: any
  children?: NavigationItem[]
}

interface SidebarProps {
  role: "consumer" | "partner" | "admin"
}

const navigationConfig: Record<string, NavigationItem[]> = {
  consumer: [
    { name: "Dashboard", href: "/consumer", icon: LayoutDashboard },
    { name: "Rewards", href: "/consumer/rewards", icon: Gift },
    { name: "Transactions", href: "/consumer/transactions", icon: History },
    { name: "Transfer Points", href: "/consumer/transfer", icon: ArrowRightLeft },
    { name: "Profile", href: "/consumer/profile", icon: UserCheck },
    { name: "Simulate Purchase", href: "/consumer/simulate-purchase", icon: Play },
  ],
  partner: [
    { name: "Dashboard", href: "/partner", icon: LayoutDashboard },
    { name: "Customers", href: "/partner/customers", icon: Users },
    { name: "Rewards", href: "/partner/rewards", icon: Gift },
    { name: "Analytics", href: "/partner/analytics", icon: BarChart },
    { name: "Settings", href: "/partner/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Partners", href: "/admin/partners", icon: Building },
    { name: "Associate Partners", href: "/admin/associate-partners", icon: Building },
    { name: "Segments", href: "/admin/segments", icon: Target },
    { name: "Levels", href: "/admin/levels", icon: Award },
    { name: "Transactions", href: "/admin/transactions", icon: Receipt },
    { name: "Earning Rules", href: "/admin/earning-rules", icon: Calculator },
    {
      name: "Campaigns",
      icon: Gift,
      children: [
        { name: "Manage Campaigns", href: "/admin/campaigns/manage", icon: List },
        { name: "Campaign Simulation", href: "/admin/campaigns/simulation", icon: Play },
      ],
    },
    { name: "POS Systems", href: "/admin/pos", icon: CreditCard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Settings", href: "/admin/settings", icon: Settings },
   
  ],
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navigation = navigationConfig[role]
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  return (
    <aside className="bg-card border-r min-h-[calc(100vh-4rem)] w-64">
      <nav className="p-4">

          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              const hasChildren = item.children && item.children.length > 0
              const isExpanded = expandedItems.includes(item.name)

              const linkContent = (
                <div
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {hasChildren && (
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  )}
                </div>
              )

              return (
                <div key={item.name}>
                  {item.href ? (
                    <Link href={item.href}>
                      {linkContent}
                    </Link>
                  ) : (
                    <div 
                      className="cursor-pointer"
                      onClick={() => {
                        if (hasChildren) {
                          setExpandedItems(prev => 
                            prev.includes(item.name) 
                              ? prev.filter(name => name !== item.name)
                              : [...prev, item.name]
                          )
                        }
                      }}
                    >
                      {linkContent}
                    </div>
                  )}

                  {/* Render children */}
                  {hasChildren && isExpanded && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href
                        const ChildIcon = child.icon

                        return (
                          <Link
                            key={child.name}
                            href={child.href || "#"}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                              isChildActive
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            )}
                          >
                            <ChildIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{child.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>
      </aside>
  )
}
