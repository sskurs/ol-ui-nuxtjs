"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Edit, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Calendar,
  FileText
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  category: string;
  taxId: string;
  description: string;
  website: string;
  commisionRate: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PartnerDetailPageProps { 
  params: { id: string } 
}

export default function PartnerDetailPage({ params }: PartnerDetailPageProps) {
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartner = async () => {
      setIsLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`/api/admin/partners/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch partner");
        }
        
        const data = await response.json();
        setPartner(data);
      } catch (error) {
        console.error("Error fetching partner:", error);
        toast({
          title: "Error",
          description: "Failed to load partner.",
          variant: "destructive",
        });
        router.push("/admin/partners");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPartner();
    }
  }, [id, router, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading partner...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!partner) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Partner not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center px-3 py-2 border rounded hover:bg-muted"
              onClick={() => router.push("/admin/partners")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{partner.name}</h1>
              <p className="text-muted-foreground">Partner Details</p>
            </div>
          </div>
          <Button onClick={() => router.push(`/admin/partners/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Partner
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status</span>
                <Badge className={getStatusColor(partner.status)}>
                  {partner.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Category</span>
                <span>{partner.category}</span>
              </div>
              {partner.taxId && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tax ID</span>
                  <span>{partner.taxId}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-medium">Commission Rate</span>
                <span>{partner.commisionRate}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{partner.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{partner.phone}</span>
              </div>
              {partner.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Website:</span>
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {partner.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>{partner.address}</div>
                <div>{partner.city}, {partner.state} {partner.zipcode}</div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {partner.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{partner.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>{formatDate(partner.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Updated:</span>
                <span>{formatDate(partner.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 