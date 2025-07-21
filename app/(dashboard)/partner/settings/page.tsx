"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building, CreditCard, Bell, Shield, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Coffee Shop Co",
    businessType: "restaurant",
    description: "Premium coffee shop serving artisanal coffee and fresh pastries",
    address: "123 Main Street, Downtown",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "+1 (555) 123-4567",
    email: "contact@coffeeshopco.com",
    website: "https://coffeeshopco.com",
    taxId: "12-3456789",
  })

  const [loyaltySettings, setLoyaltySettings] = useState({
    pointsPerDollar: "10",
    welcomeBonus: "100",
    referralBonus: "500",
    birthdayBonus: "250",
    tierUpgradeBonus: "1000",
    pointsExpiry: "365",
    minRedemption: "100",
    autoApproveRedemptions: true,
    allowPartialRedemptions: true,
    enableTierSystem: true,
  })

  const [notifications, setNotifications] = useState({
    newCustomerSignup: true,
    pointsIssued: false,
    rewardRedeemed: true,
    lowPointsBalance: true,
    monthlyReport: true,
    systemUpdates: true,
    marketingEmails: false,
  })

  const [integrations, setIntegrations] = useState({
    posSystem: "square",
    emailProvider: "mailchimp",
    smsProvider: "twilio",
    analyticsProvider: "google",
  })

  const handleSaveBusinessInfo = () => {
    toast({
      title: "Business Information Updated",
      description: "Your business information has been successfully updated.",
    })
  }

  const handleSaveLoyaltySettings = () => {
    toast({
      title: "Loyalty Settings Updated",
      description: "Your loyalty program settings have been successfully updated.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification preferences have been successfully updated.",
    })
  }

  return (
    <DashboardLayout role="partner">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Badge variant="outline">Partner Account</Badge>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Business Information</span>
                </CardTitle>
                <CardDescription>Update your business details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={businessInfo.businessType}
                      onValueChange={(value) => setBusinessInfo((prev) => ({ ...prev, businessType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={businessInfo.description}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={businessInfo.city}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={businessInfo.state}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={businessInfo.zipCode}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={businessInfo.website}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={businessInfo.taxId}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, taxId: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveBusinessInfo}>Save Business Information</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <span>Loyalty Program Settings</span>
                </CardTitle>
                <CardDescription>Configure how your loyalty program works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pointsPerDollar">Points per Dollar Spent</Label>
                    <Input
                      id="pointsPerDollar"
                      type="number"
                      value={loyaltySettings.pointsPerDollar}
                      onChange={(e) => setLoyaltySettings((prev) => ({ ...prev, pointsPerDollar: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="welcomeBonus">Welcome Bonus Points</Label>
                    <Input
                      id="welcomeBonus"
                      type="number"
                      value={loyaltySettings.welcomeBonus}
                      onChange={(e) => setLoyaltySettings((prev) => ({ ...prev, welcomeBonus: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referralBonus">Referral Bonus Points</Label>
                    <Input
                      id="referralBonus"
                      type="number"
                      value={loyaltySettings.referralBonus}
                      onChange={(e) => setLoyaltySettings((prev) => ({ ...prev, referralBonus: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdayBonus">Birthday Bonus Points</Label>
                    <Input
                      id="birthdayBonus"
                      type="number"
                      value={loyaltySettings.birthdayBonus}
                      onChange={(e) => setLoyaltySettings((prev) => ({ ...prev, birthdayBonus: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pointsExpiry">Points Expiry (Days)</Label>
                    <Input
                      id="pointsExpiry"
                      type="number"
                      value={loyaltySettings.pointsExpiry}
                      onChange={(e) => setLoyaltySettings((prev) => ({ ...prev, pointsExpiry: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minRedemption">Minimum Redemption Points</Label>
                    <Input
                      id="minRedemption"
                      type="number"
                      value={loyaltySettings.minRedemption}
                      onChange={(e) => setLoyaltySettings((prev) => ({ ...prev, minRedemption: e.target.value }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Program Options</h4>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-approve Redemptions</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve reward redemptions without manual review
                      </p>
                    </div>
                    <Switch
                      checked={loyaltySettings.autoApproveRedemptions}
                      onCheckedChange={(checked) =>
                        setLoyaltySettings((prev) => ({ ...prev, autoApproveRedemptions: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Partial Redemptions</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to use points for partial payment</p>
                    </div>
                    <Switch
                      checked={loyaltySettings.allowPartialRedemptions}
                      onCheckedChange={(checked) =>
                        setLoyaltySettings((prev) => ({ ...prev, allowPartialRedemptions: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Tier System</Label>
                      <p className="text-sm text-muted-foreground">Use Bronze, Silver, Gold, Platinum tier system</p>
                    </div>
                    <Switch
                      checked={loyaltySettings.enableTierSystem}
                      onCheckedChange={(checked) =>
                        setLoyaltySettings((prev) => ({ ...prev, enableTierSystem: checked }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveLoyaltySettings}>Save Loyalty Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>Choose which notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Customer Signup</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new customers join your loyalty program
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newCustomerSignup}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, newCustomerSignup: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Points Issued</Label>
                      <p className="text-sm text-muted-foreground">Get notified when points are issued to customers</p>
                    </div>
                    <Switch
                      checked={notifications.pointsIssued}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pointsIssued: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reward Redeemed</Label>
                      <p className="text-sm text-muted-foreground">Get notified when customers redeem rewards</p>
                    </div>
                    <Switch
                      checked={notifications.rewardRedeemed}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, rewardRedeemed: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Points Balance</Label>
                      <p className="text-sm text-muted-foreground">Get notified when reward inventory is running low</p>
                    </div>
                    <Switch
                      checked={notifications.lowPointsBalance}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, lowPointsBalance: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monthly Report</Label>
                      <p className="text-sm text-muted-foreground">Receive monthly analytics and performance reports</p>
                    </div>
                    <Switch
                      checked={notifications.monthlyReport}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, monthlyReport: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system updates and new features
                      </p>
                    </div>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, systemUpdates: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive marketing tips and promotional opportunities
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications}>Save Notification Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Integrations</CardTitle>
                <CardDescription>Connect your loyalty program with other business tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="posSystem">POS System</Label>
                    <Select
                      value={integrations.posSystem}
                      onValueChange={(value) => setIntegrations((prev) => ({ ...prev, posSystem: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="shopify">Shopify POS</SelectItem>
                        <SelectItem value="clover">Clover</SelectItem>
                        <SelectItem value="toast">Toast</SelectItem>
                        <SelectItem value="lightspeed">Lightspeed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailProvider">Email Provider</Label>
                    <Select
                      value={integrations.emailProvider}
                      onValueChange={(value) => setIntegrations((prev) => ({ ...prev, emailProvider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="constantcontact">Constant Contact</SelectItem>
                        <SelectItem value="klaviyo">Klaviyo</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smsProvider">SMS Provider</Label>
                    <Select
                      value={integrations.smsProvider}
                      onValueChange={(value) => setIntegrations((prev) => ({ ...prev, smsProvider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="textmagic">TextMagic</SelectItem>
                        <SelectItem value="smsapi">SMS API</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="analyticsProvider">Analytics Provider</Label>
                    <Select
                      value={integrations.analyticsProvider}
                      onValueChange={(value) => setIntegrations((prev) => ({ ...prev, analyticsProvider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Analytics</SelectItem>
                        <SelectItem value="mixpanel">Mixpanel</SelectItem>
                        <SelectItem value="amplitude">Amplitude</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Integration Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Square POS</p>
                          <p className="text-sm text-muted-foreground">Point of sale integration</p>
                        </div>
                      </div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Mailchimp</p>
                          <p className="text-sm text-muted-foreground">Email marketing integration</p>
                        </div>
                      </div>
                      <Badge variant="outline">Not Connected</Badge>
                    </div>
                  </div>
                </div>

                <Button>Save Integration Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Manage your account security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">Last changed 2 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">API Keys</h4>
                      <p className="text-sm text-muted-foreground">Manage API access for integrations</p>
                    </div>
                    <Button variant="outline">Manage Keys</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Login Sessions</h4>
                      <p className="text-sm text-muted-foreground">View and manage active sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">Download your business data</p>
                    </div>
                    <Button variant="outline">Request Export</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions that affect your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your partner account and all data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
