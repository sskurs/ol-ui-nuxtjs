"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Bell, Database, Mail, Coins } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [systemSettings, setSystemSettings] = useState({
    siteName: "OpenLoyalty",
    siteDescription: "Comprehensive loyalty program management system",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    twoFactorEnabled: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    pointsExpiryDays: 365,
    defaultPointsValue: 0.01,
    minRedemptionPoints: 100,
    maxDailyPoints: 1000,
    partnerCommissionRate: 10,
    autoApprovePartners: false,
    memberTierThresholds: {
      bronze: 0,
      silver: 1000,
      gold: 5000,
      platinum: 10000,
    },
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@openloyalty.com",
    fromName: "OpenLoyalty",
    welcomeEmailEnabled: true,
    transactionEmailEnabled: true,
    promotionalEmailEnabled: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newMemberNotification: true,
    newPartnerNotification: true,
    lowPointsAlert: true,
    systemErrorAlert: true,
    dailyReportEmail: true,
    weeklyReportEmail: true,
    monthlyReportEmail: true,
  })

  const handleSaveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully`)
  }

  const handleTestEmail = () => {
    toast.success("Test email sent successfully")
  }

  const handleBackupDatabase = () => {
    toast.success("Database backup initiated")
  }

  const handleSystemReset = () => {
    toast.error("System reset is a destructive action. Please contact support.")
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode to prevent user access</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                    </div>
                    <Switch
                      checked={systemSettings.registrationEnabled}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, registrationEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Verification Required</Label>
                      <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                    </div>
                    <Switch
                      checked={systemSettings.emailVerificationRequired}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, emailVerificationRequired: checked })
                      }
                    />
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("General")}>Save General Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, sessionTimeout: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={systemSettings.maxLoginAttempts}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, maxLoginAttempts: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={systemSettings.passwordMinLength}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, passwordMinLength: Number.parseInt(e.target.value) })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={systemSettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, twoFactorEnabled: checked })}
                  />
                </div>

                <Button onClick={() => handleSaveSettings("Security")}>Save Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  Loyalty Program Settings
                </CardTitle>
                <CardDescription>Configure loyalty program rules and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pointsExpiryDays">Points Expiry (days)</Label>
                    <Input
                      id="pointsExpiryDays"
                      type="number"
                      value={systemSettings.pointsExpiryDays}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, pointsExpiryDays: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultPointsValue">Default Points Value ($)</Label>
                    <Input
                      id="defaultPointsValue"
                      type="number"
                      step="0.01"
                      value={systemSettings.defaultPointsValue}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, defaultPointsValue: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minRedemptionPoints">Minimum Redemption Points</Label>
                    <Input
                      id="minRedemptionPoints"
                      type="number"
                      value={systemSettings.minRedemptionPoints}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, minRedemptionPoints: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDailyPoints">Max Daily Points</Label>
                    <Input
                      id="maxDailyPoints"
                      type="number"
                      value={systemSettings.maxDailyPoints}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, maxDailyPoints: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Member Tier Thresholds</Label>
                  <p className="text-sm text-muted-foreground mb-4">Set point thresholds for each membership tier</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bronzeThreshold">Bronze Tier</Label>
                      <Input
                        id="bronzeThreshold"
                        type="number"
                        value={systemSettings.memberTierThresholds.bronze}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            memberTierThresholds: {
                              ...systemSettings.memberTierThresholds,
                              bronze: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="silverThreshold">Silver Tier</Label>
                      <Input
                        id="silverThreshold"
                        type="number"
                        value={systemSettings.memberTierThresholds.silver}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            memberTierThresholds: {
                              ...systemSettings.memberTierThresholds,
                              silver: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goldThreshold">Gold Tier</Label>
                      <Input
                        id="goldThreshold"
                        type="number"
                        value={systemSettings.memberTierThresholds.gold}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            memberTierThresholds: {
                              ...systemSettings.memberTierThresholds,
                              gold: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platinumThreshold">Platinum Tier</Label>
                      <Input
                        id="platinumThreshold"
                        type="number"
                        value={systemSettings.memberTierThresholds.platinum}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            memberTierThresholds: {
                              ...systemSettings.memberTierThresholds,
                              platinum: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="partnerCommissionRate">Partner Commission Rate (%)</Label>
                  <Input
                    id="partnerCommissionRate"
                    type="number"
                    value={systemSettings.partnerCommissionRate}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, partnerCommissionRate: Number.parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve Partners</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve new partner applications</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoApprovePartners}
                    onCheckedChange={(checked) =>
                      setSystemSettings({ ...systemSettings, autoApprovePartners: checked })
                    }
                  />
                </div>

                <Button onClick={() => handleSaveSettings("Loyalty Program")}>Save Loyalty Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Settings
                </CardTitle>
                <CardDescription>Configure SMTP and email preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, smtpPort: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Welcome Email</Label>
                      <p className="text-sm text-muted-foreground">Send welcome email to new members</p>
                    </div>
                    <Switch
                      checked={emailSettings.welcomeEmailEnabled}
                      onCheckedChange={(checked) =>
                        setEmailSettings({ ...emailSettings, welcomeEmailEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Transaction Email</Label>
                      <p className="text-sm text-muted-foreground">Send email notifications for transactions</p>
                    </div>
                    <Switch
                      checked={emailSettings.transactionEmailEnabled}
                      onCheckedChange={(checked) =>
                        setEmailSettings({ ...emailSettings, transactionEmailEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Promotional Email</Label>
                      <p className="text-sm text-muted-foreground">Send promotional and marketing emails</p>
                    </div>
                    <Switch
                      checked={emailSettings.promotionalEmailEnabled}
                      onCheckedChange={(checked) =>
                        setEmailSettings({ ...emailSettings, promotionalEmailEnabled: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => handleSaveSettings("Email")}>Save Email Settings</Button>
                  <Button variant="outline" onClick={handleTestEmail}>
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Member Notification</Label>
                      <p className="text-sm text-muted-foreground">Notify admins when new members register</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newMemberNotification}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, newMemberNotification: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Partner Notification</Label>
                      <p className="text-sm text-muted-foreground">Notify admins when new partners apply</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newPartnerNotification}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, newPartnerNotification: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Points Alert</Label>
                      <p className="text-sm text-muted-foreground">Alert when system points balance is low</p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowPointsAlert}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, lowPointsAlert: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Error Alert</Label>
                      <p className="text-sm text-muted-foreground">Alert admins of system errors and issues</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemErrorAlert}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, systemErrorAlert: checked })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Report Emails</Label>
                  <p className="text-sm text-muted-foreground mb-4">Configure automated report email frequency</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Report Email</Label>
                        <p className="text-sm text-muted-foreground">Send daily system activity reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReportEmail}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, dailyReportEmail: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Report Email</Label>
                        <p className="text-sm text-muted-foreground">Send weekly performance summaries</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReportEmail}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, weeklyReportEmail: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Monthly Report Email</Label>
                        <p className="text-sm text-muted-foreground">Send monthly analytics reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.monthlyReportEmail}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, monthlyReportEmail: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("Notifications")}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  System Management
                </CardTitle>
                <CardDescription>System maintenance and administrative tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Database</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Backup</span>
                        <Badge variant="outline">2 hours ago</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database Size</span>
                        <Badge variant="outline">2.4 GB</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleBackupDatabase}>
                        Create Backup
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">System Health</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Uptime</span>
                        <Badge variant="outline">99.9%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Version</span>
                        <Badge variant="outline">v2.1.0</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium text-red-600">Danger Zone</Label>
                    <p className="text-sm text-muted-foreground">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Reset System Data</h4>
                        <p className="text-sm text-muted-foreground">
                          This will permanently delete all user data, transactions, and settings
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleSystemReset}>
                        Reset System
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
