"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Store, Loader2, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useToast } from "@/hooks/use-toast";

interface Merchant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  status: "active" | "pending" | "suspended" | "rejected";
  joinDate: string;
  totalRevenue: number;
  totalCustomers: number;
  pointsIssued: number;
  commissionRate: number;
  description: string;
  website?: string;
  taxId?: string;
}

const categories = [
  "Food & Beverage",
  "Fashion & Apparel",
  "Electronics",
  "Health & Beauty",
  "Home & Garden",
  "Sports & Recreation",
  "Automotive",
  "Services",
  "Other",
];

export default function AddMerchantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newMerchant, setNewMerchant] = useState<Partial<Merchant>>({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    category: "",
    status: "pending",
    commissionRate: 5.0,
    description: "",
    website: "",
    taxId: "",
  });

  const handleCreateMerchant = async () => {
    // Validate required fields
    if (!newMerchant.businessName || !newMerchant.ownerName || !newMerchant.email ||
      !newMerchant.phone || !newMerchant.address || !newMerchant.city ||
      !newMerchant.state || !newMerchant.zipCode || !newMerchant.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newMerchant),
      });
      if (!response.ok) {
        throw new Error('Failed to create merchant');
      }
      await response.json();
      toast({
        title: "Merchant Created",
        description: "New merchant has been successfully added to the system.",
      });
      router.push('/admin/merchants');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create merchant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/merchants');
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Merchants
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Merchant</h1>
            <p className="text-muted-foreground">Create a new merchant account in the loyalty program</p>
          </div>
        </div>
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Merchant Information
            </CardTitle>
            <CardDescription>
              Fill in the merchant's business and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Business Info Section */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={newMerchant.businessName}
                      onChange={(e) => setNewMerchant({ ...newMerchant, businessName: e.target.value })}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={newMerchant.ownerName}
                      onChange={(e) => setNewMerchant({ ...newMerchant, ownerName: e.target.value })}
                      placeholder="Enter owner name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newMerchant.category}
                      onValueChange={(value) => setNewMerchant({ ...newMerchant, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={newMerchant.taxId}
                      onChange={(e) => setNewMerchant({ ...newMerchant, taxId: e.target.value })}
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={newMerchant.description}
                    onChange={(e) => setNewMerchant({ ...newMerchant, description: e.target.value })}
                    placeholder="Describe the business"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newMerchant.website}
                    onChange={(e) => setNewMerchant({ ...newMerchant, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Contact Details Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Contact Details</CardTitle>
                  <CardDescription>
                    Primary contact information for the merchant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMerchant.email}
                        onChange={(e) => setNewMerchant({ ...newMerchant, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newMerchant.phone}
                        onChange={(e) => setNewMerchant({ ...newMerchant, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={newMerchant.address}
                      onChange={(e) => setNewMerchant({ ...newMerchant, address: e.target.value })}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newMerchant.city}
                        onChange={(e) => setNewMerchant({ ...newMerchant, city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={newMerchant.state}
                        onChange={(e) => setNewMerchant({ ...newMerchant, state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={newMerchant.zipCode}
                        onChange={(e) => setNewMerchant({ ...newMerchant, zipCode: e.target.value })}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings Section */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select
                      value={newMerchant.status}
                      onValueChange={(value) => setNewMerchant({ ...newMerchant, status: value as Merchant["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={newMerchant.commissionRate}
                      onChange={(e) => setNewMerchant({ ...newMerchant, commissionRate: parseFloat(e.target.value) || 0 })}
                      placeholder="5.0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateMerchant}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Merchant
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 