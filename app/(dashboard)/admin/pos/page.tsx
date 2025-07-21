"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Settings,
  Wifi,
  WifiOff,
  CreditCard,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Download,
  Upload,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface POSTerminal {
  id: string
  name: string
  location: string
  partner: string
  status: "online" | "offline" | "maintenance"
  lastSync: string
  version: string
  transactions: number
  revenue: number
  apiKey: string
  ipAddress: string
}

interface POSIntegration {
  id: string
  name: string
  provider: string
  status: "active" | "inactive" | "error"
  endpoints: number
  lastSync: string
  version: string
}

export default function POSManagementPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("terminals")
  const [isAddTerminalOpen, setIsAddTerminalOpen] = useState(false)
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false)
  const [selectedTerminal, setSelectedTerminal] = useState<POSTerminal | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for POS terminals
  const [terminals, setTerminals] = useState<POSTerminal[]>([
    {
      id: "POS001",
      name: "Main Store Terminal 1",
      location: "Downtown Store - Counter 1",
      partner: "TechMart Electronics",
      status: "online",
      lastSync: "2024-01-07 14:30:00",
      version: "v2.1.5",
      transactions: 1247,
      revenue: 45680.5,
      apiKey: "pk_live_51H7...",
      ipAddress: "192.168.1.101",
    },
    {
      id: "POS002",
      name: "Express Checkout",
      location: "Mall Location - Express Lane",
      partner: "Fashion Hub",
      status: "online",
      lastSync: "2024-01-07 14:28:00",
      version: "v2.1.5",
      transactions: 892,
      revenue: 23450.75,
      apiKey: "pk_live_51H8...",
      ipAddress: "192.168.1.102",
    },
    {
      id: "POS003",
      name: "Mobile Terminal",
      location: "Food Court - Mobile Unit",
      partner: "Gourmet Bites",
      status: "offline",
      lastSync: "2024-01-07 12:15:00",
      version: "v2.1.3",
      transactions: 456,
      revenue: 12890.25,
      apiKey: "pk_live_51H9...",
      ipAddress: "192.168.1.103",
    },
    {
      id: "POS004",
      name: "Service Counter",
      location: "Main Store - Service Desk",
      partner: "TechMart Electronics",
      status: "maintenance",
      lastSync: "2024-01-07 10:00:00",
      version: "v2.1.4",
      transactions: 234,
      revenue: 8750.0,
      apiKey: "pk_live_51HA...",
      ipAddress: "192.168.1.104",
    },
  ])

  // Mock data for POS integrations
  const [integrations, setIntegrations] = useState<POSIntegration[]>([
    {
      id: "INT001",
      name: "Square Integration",
      provider: "Square",
      status: "active",
      endpoints: 4,
      lastSync: "2024-01-07 14:30:00",
      version: "v3.2.1",
    },
    {
      id: "INT002",
      name: "Shopify POS",
      provider: "Shopify",
      status: "active",
      endpoints: 6,
      lastSync: "2024-01-07 14:25:00",
      version: "v4.1.0",
    },
    {
      id: "INT003",
      name: "Toast POS",
      provider: "Toast",
      status: "inactive",
      endpoints: 3,
      lastSync: "2024-01-06 18:00:00",
      version: "v2.8.5",
    },
    {
      id: "INT004",
      name: "Clover Integration",
      provider: "Clover",
      status: "error",
      endpoints: 5,
      lastSync: "2024-01-07 09:15:00",
      version: "v1.9.2",
    },
  ])

  const [newTerminal, setNewTerminal] = useState({
    name: "",
    location: "",
    partner: "",
    ipAddress: "",
    notes: "",
  })

  const [newIntegration, setNewIntegration] = useState({
    name: "",
    provider: "",
    apiKey: "",
    webhookUrl: "",
    notes: "",
  })

  const filteredTerminals = terminals.filter((terminal) => {
    const matchesSearch =
      terminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      terminal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      terminal.partner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || terminal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddTerminal = () => {
    if (!newTerminal.name || !newTerminal.location || !newTerminal.partner) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const terminal: POSTerminal = {
      id: `POS${String(terminals.length + 1).padStart(3, "0")}`,
      name: newTerminal.name,
      location: newTerminal.location,
      partner: newTerminal.partner,
      status: "offline",
      lastSync: "Never",
      version: "v2.1.5",
      transactions: 0,
      revenue: 0,
      apiKey: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
      ipAddress: newTerminal.ipAddress || "Not assigned",
    }

    setTerminals([...terminals, terminal])
    setNewTerminal({ name: "", location: "", partner: "", ipAddress: "", notes: "" })
    setIsAddTerminalOpen(false)

    toast({
      title: "Success",
      description: "POS terminal added successfully.",
    })
  }

  const handleAddIntegration = () => {
    if (!newIntegration.name || !newIntegration.provider) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const integration: POSIntegration = {
      id: `INT${String(integrations.length + 1).padStart(3, "0")}`,
      name: newIntegration.name,
      provider: newIntegration.provider,
      status: "inactive",
      endpoints: 0,
      lastSync: "Never",
      version: "v1.0.0",
    }

    setIntegrations([...integrations, integration])
    setNewIntegration({ name: "", provider: "", apiKey: "", webhookUrl: "", notes: "" })
    setIsAddIntegrationOpen(false)

    toast({
      title: "Success",
      description: "POS integration added successfully.",
    })
  }

  const handleDeleteTerminal = (id: string) => {
    setTerminals(terminals.filter((t) => t.id !== id))
    toast({
      title: "Success",
      description: "POS terminal deleted successfully.",
    })
  }

  const handleSyncTerminal = (id: string) => {
    setTerminals(
      terminals.map((t) =>
        t.id === id ? { ...t, lastSync: new Date().toLocaleString(), status: "online" as const } : t,
      ),
    )
    toast({
      title: "Success",
      description: "Terminal synced successfully.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <WifiOff className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      online: "default",
      offline: "destructive",
      maintenance: "secondary",
      active: "default",
      inactive: "secondary",
      error: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Statistics
  const totalTerminals = terminals.length
  const onlineTerminals = terminals.filter((t) => t.status === "online").length
  const totalTransactions = terminals.reduce((sum, t) => sum + t.transactions, 0)
  const totalRevenue = terminals.reduce((sum, t) => sum + t.revenue, 0)

  return (
    <DashboardLayout role="admin">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">POS Management</h1>
          <p className="text-muted-foreground">Manage point-of-sale systems and integrations</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terminals</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTerminals}</div>
            <p className="text-xs text-muted-foreground">{onlineTerminals} online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Status</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((onlineTerminals / totalTerminals) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {onlineTerminals} of {totalTerminals} online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all terminals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From POS transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="terminals">POS Terminals</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* POS Terminals Tab */}
        <TabsContent value="terminals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>POS Terminals</CardTitle>
                  <CardDescription>Manage your point-of-sale terminals and their configurations</CardDescription>
                </div>
                <Dialog open={isAddTerminalOpen} onOpenChange={setIsAddTerminalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Terminal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New POS Terminal</DialogTitle>
                      <DialogDescription>
                        Configure a new point-of-sale terminal for your loyalty program.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="terminal-name">Terminal Name *</Label>
                        <Input
                          id="terminal-name"
                          placeholder="e.g., Main Store Terminal 1"
                          value={newTerminal.name}
                          onChange={(e) => setNewTerminal({ ...newTerminal, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="terminal-location">Location *</Label>
                        <Input
                          id="terminal-location"
                          placeholder="e.g., Downtown Store - Counter 1"
                          value={newTerminal.location}
                          onChange={(e) => setNewTerminal({ ...newTerminal, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="terminal-partner">Partner *</Label>
                        <Select
                          value={newTerminal.partner}
                          onValueChange={(value) => setNewTerminal({ ...newTerminal, partner: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select partner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TechMart Electronics">TechMart Electronics</SelectItem>
                            <SelectItem value="Fashion Hub">Fashion Hub</SelectItem>
                            <SelectItem value="Gourmet Bites">Gourmet Bites</SelectItem>
                            <SelectItem value="BookWorld">BookWorld</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="terminal-ip">IP Address</Label>
                        <Input
                          id="terminal-ip"
                          placeholder="e.g., 192.168.1.101"
                          value={newTerminal.ipAddress}
                          onChange={(e) => setNewTerminal({ ...newTerminal, ipAddress: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="terminal-notes">Notes</Label>
                        <Textarea
                          id="terminal-notes"
                          placeholder="Additional notes about this terminal..."
                          value={newTerminal.notes}
                          onChange={(e) => setNewTerminal({ ...newTerminal, notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddTerminalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTerminal}>Add Terminal</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search terminals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terminals List */}
              <div className="space-y-4">
                {filteredTerminals.map((terminal) => (
                  <Card key={terminal.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(terminal.status)}
                            <div>
                              <h3 className="font-semibold">{terminal.name}</h3>
                              <p className="text-sm text-muted-foreground">{terminal.location}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(terminal.status)}
                          <div className="text-right">
                            <p className="text-sm font-medium">{terminal.transactions} transactions</p>
                            <p className="text-sm text-muted-foreground">${terminal.revenue.toLocaleString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleSyncTerminal(terminal.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedTerminal(terminal)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteTerminal(terminal.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Partner</p>
                          <p className="font-medium">{terminal.partner}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Sync</p>
                          <p className="font-medium">{terminal.lastSync}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Version</p>
                          <p className="font-medium">{terminal.version}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">IP Address</p>
                          <p className="font-medium">{terminal.ipAddress}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>POS Integrations</CardTitle>
                  <CardDescription>Manage third-party POS system integrations</CardDescription>
                </div>
                <Dialog open={isAddIntegrationOpen} onOpenChange={setIsAddIntegrationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Integration</DialogTitle>
                      <DialogDescription>Connect a new POS system to your loyalty program.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="integration-name">Integration Name *</Label>
                        <Input
                          id="integration-name"
                          placeholder="e.g., Square Integration"
                          value={newIntegration.name}
                          onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="integration-provider">Provider *</Label>
                        <Select
                          value={newIntegration.provider}
                          onValueChange={(value) => setNewIntegration({ ...newIntegration, provider: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Square">Square</SelectItem>
                            <SelectItem value="Shopify">Shopify</SelectItem>
                            <SelectItem value="Toast">Toast</SelectItem>
                            <SelectItem value="Clover">Clover</SelectItem>
                            <SelectItem value="Lightspeed">Lightspeed</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="integration-api-key">API Key</Label>
                        <Input
                          id="integration-api-key"
                          type="password"
                          placeholder="Enter API key"
                          value={newIntegration.apiKey}
                          onChange={(e) => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="integration-webhook">Webhook URL</Label>
                        <Input
                          id="integration-webhook"
                          placeholder="https://your-webhook-url.com"
                          value={newIntegration.webhookUrl}
                          onChange={(e) => setNewIntegration({ ...newIntegration, webhookUrl: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddIntegrationOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddIntegration}>Add Integration</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(integration.status)}
                            <div>
                              <h3 className="font-semibold">{integration.name}</h3>
                              <p className="text-sm text-muted-foreground">{integration.provider}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(integration.status)}
                          <div className="text-right">
                            <p className="text-sm font-medium">{integration.endpoints} endpoints</p>
                            <p className="text-sm text-muted-foreground">{integration.version}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm">
                        <p className="text-muted-foreground">Last Sync: {integration.lastSync}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>POS Configuration</CardTitle>
                <CardDescription>Configure global POS system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-sync Transactions</Label>
                    <p className="text-sm text-muted-foreground">Automatically sync transactions from POS systems</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Points</Label>
                    <p className="text-sm text-muted-foreground">Award points immediately after purchase</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">Allow POS to work when offline</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>API Rate Limit</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/hour</SelectItem>
                      <SelectItem value="500">500 requests/hour</SelectItem>
                      <SelectItem value="1000">1000 requests/hour</SelectItem>
                      <SelectItem value="5000">5000 requests/hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>Configure webhook endpoints for POS events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Transaction Webhook URL</Label>
                  <Input placeholder="https://your-domain.com/webhooks/transactions" />
                </div>
                <div className="space-y-2">
                  <Label>Points Webhook URL</Label>
                  <Input placeholder="https://your-domain.com/webhooks/points" />
                </div>
                <div className="space-y-2">
                  <Label>Error Webhook URL</Label>
                  <Input placeholder="https://your-domain.com/webhooks/errors" />
                </div>
                <Button>Save Webhook Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Terminal Details Modal */}
      {selectedTerminal && (
        <Dialog open={!!selectedTerminal} onOpenChange={() => setSelectedTerminal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Terminal Details: {selectedTerminal.name}</DialogTitle>
              <DialogDescription>View and manage terminal configuration</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Terminal ID</Label>
                    <p className="font-mono text-sm">{selectedTerminal.id}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedTerminal.status)}
                      <span>{selectedTerminal.status}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p>{selectedTerminal.location}</p>
                  </div>
                  <div>
                    <Label>Partner</Label>
                    <p>{selectedTerminal.partner}</p>
                  </div>
                  <div>
                    <Label>IP Address</Label>
                    <p className="font-mono text-sm">{selectedTerminal.ipAddress}</p>
                  </div>
                  <div>
                    <Label>Version</Label>
                    <p>{selectedTerminal.version}</p>
                  </div>
                  <div>
                    <Label>Transactions</Label>
                    <p>{selectedTerminal.transactions.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Revenue</Label>
                    <p>${selectedTerminal.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Terminal settings can be configured here. Changes will be synced to the terminal on next connection.
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Loyalty Features</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto-apply Rewards</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require Member ID</Label>
                    <Switch />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="logs" className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    [2024-01-07 14:30:00] Transaction processed: ₹3,817.17
                  </div>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    [2024-01-07 14:28:15] Points awarded: 46 points
                  </div>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    [2024-01-07 14:25:30] Member lookup: john.doe@example.com
                  </div>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    [2024-01-07 14:20:45] Sync completed successfully
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </DashboardLayout>
  )
}
