import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle } from "lucide-react";

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

interface MerchantFormProps {
  initialValues: any;
  onSubmit: (merchant: any) => void;
  isLoading: boolean;
  mode: "add" | "edit";
}

export function MerchantForm({ initialValues, onSubmit, isLoading, mode }: MerchantFormProps) {
  const [merchant, setMerchant] = useState(initialValues);

  // Sync with initialValues when they change
  useEffect(() => {
    setMerchant(initialValues);
  }, [initialValues]);

  const handleChange = (field: string, value: any) => {
    setMerchant((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(merchant);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "add" ? "Add New Merchant" : "Update Merchant"}
          </CardTitle>
          <CardDescription>
            {mode === "add"
              ? "Create a new merchant account in the loyalty program"
              : "Update merchant information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Business Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={merchant.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter business name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={merchant.category || ""}
                    onValueChange={(value) => handleChange("category", value)}
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={merchant.taxId || ""}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                    placeholder="Enter tax ID"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={merchant.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the business"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={merchant.website || ""}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Contact Information</CardTitle>
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
                      value={merchant.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={merchant.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={merchant.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter street address"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={merchant.city || ""}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={merchant.state || ""}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipcode">ZIP Code *</Label>
                    <Input
                      id="zipcode"
                      value={merchant.zipcode || ""}
                      onChange={(e) => handleChange("zipcode", e.target.value)}
                      placeholder="Enter ZIP code"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={merchant.status || "pending"}
                    onValueChange={(value) => handleChange("status", value)}
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
                  <Label htmlFor="commisionRate">Commission Rate (%)</Label>
                  <Input
                    id="commisionRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={merchant.commisionRate || 0}
                    onChange={(e) => handleChange("commisionRate", parseFloat(e.target.value) || 0)}
                    placeholder="5.0"
                  />
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={initialValues.onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {mode === "add" ? "Create Merchant" : "Update Merchant"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
} 