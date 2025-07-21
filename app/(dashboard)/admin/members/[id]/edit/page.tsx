"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ArrowLeft, Save, Loader2, User } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface MemberFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date | null
  gender: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  preferences: {
    marketingEmails: boolean
    smsNotifications: boolean
    newsletter: boolean
  }
}

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: null,
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States"
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    preferences: {
      marketingEmails: true,
      smsNotifications: true,
      newsletter: true
    }
  })
  const [roles, setRoles] = useState([])
  const [roleId, setRoleId] = useState("")
  const [status, setStatus] = useState("")
  const [partners, setPartners] = useState<any[]>([]);
  const [merchantId, setMerchantId] = useState("");

  useEffect(() => {
    fetch("/api/admin/roles")
      .then(res => res.json())
      .then(setRoles)
  }, [])

  useEffect(() => {
    // Fetch partners for dropdown
    const fetchPartners = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/partners`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners || []);
      }
    };
    fetchPartners();
  }, []);

  const memberId = params.id as string

  // Load member data
  useEffect(() => {
    const loadMemberData = async () => {
      try {
        const response = await fetch(`/api/admin/members/${memberId}`)
        
        if (!response.ok) {
          throw new Error('Failed to load member data')
        }
        
        const memberData = await response.json()
        
        // Transform the data to match our form structure
        setFormData({
          firstName: memberData.firstName || memberData.name?.split(' ')[0] || "",
          lastName: memberData.lastName || memberData.name?.split(' ').slice(1).join(' ') || "",
          email: memberData.email || "",
          phone: memberData.phone || "",
          dateOfBirth: memberData.dateOfBirth ? parseISO(memberData.dateOfBirth) : null,
          gender: memberData.gender || "",
          address: memberData.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "United States"
          },
          emergencyContact: memberData.emergencyContact || {
            name: "",
            phone: "",
            relationship: ""
          },
          preferences: memberData.preferences || {
            marketingEmails: true,
            smsNotifications: true,
            newsletter: true
          }
        })
        setRoleId(memberData.roleId ? memberData.roleId.toString() : "")
        setStatus(memberData.status || "active")
        setMerchantId(memberData.merchantId ? memberData.merchantId.toString() : "");
      } catch (error) {
        console.error('Error loading member data:', error)
        toast({
          title: "Error",
          description: "Failed to load member data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    if (memberId) {
      loadMemberData()
    }
  }, [memberId, toast])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }

  const handlePreferencesChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
          roleId: roleId ? parseInt(roleId) : undefined,
          status,
          merchantId: merchantId ? parseInt(merchantId) : undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update member')
      }

      const result = await response.json()
      
      toast({
        title: "Success!",
        description: "Member updated successfully",
      })

      // Redirect to members list
      router.push('/admin/members')
      
    } catch (error) {
      console.error('Error updating member:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading member data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Member</h1>
          <p className="text-muted-foreground">
            Update member information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Edit Member
            </CardTitle>
            <CardDescription>
              Update the member's personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth || undefined}
                      onSelect={(date) => handleInputChange('dateOfBirth', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={roleId} onValueChange={setRoleId} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role: any) => (
                      <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Partner Selection */}
              <div className="space-y-2">
                <Label htmlFor="partner">Partner</Label>
                <Select value={merchantId} onValueChange={setMerchantId}>
                  <SelectTrigger id="partner">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((partner: any) => (
                      <SelectItem key={partner.id} value={partner.id.toString()}>{partner.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Status Selection */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>
              Update the member's address details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={formData.address.country} 
                onValueChange={(value) => handleAddressChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>
              Emergency contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  placeholder="Enter contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  placeholder="Enter contact phone"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                placeholder="e.g., Spouse, Parent, Friend"
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Preferences</CardTitle>
            <CardDescription>
              Choose how the member would like to receive communications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="marketingEmails"
                checked={formData.preferences.marketingEmails}
                onChange={(e) => handlePreferencesChange('marketingEmails', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="marketingEmails">Marketing emails</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smsNotifications"
                checked={formData.preferences.smsNotifications}
                onChange={(e) => handlePreferencesChange('smsNotifications', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="smsNotifications">SMS notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.preferences.newsletter}
                onChange={(e) => handlePreferencesChange('newsletter', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="newsletter">Newsletter subscription</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Member...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Member
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 