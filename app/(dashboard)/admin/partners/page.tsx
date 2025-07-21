"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Store,
  CheckCircle,
  Clock,
  IndianRupee,
  UserPlus
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
  memberCount: number;
}

export default function PartnersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPartners();
  }, [currentPage, searchTerm]);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(
        `/api/admin/partners?page=${currentPage}&limit=10&search=${searchTerm}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch partners");
      }

      const data = await response.json();
      setPartners(data.partners);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast({
        title: "Error",
        description: "Failed to load partners.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete partner");
      }

      toast({
        title: "Success",
        description: "Partner deleted successfully.",
      });

      fetchPartners();
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast({
        title: "Error",
        description: "Failed to delete partner.",
        variant: "destructive",
      });
    }
  };

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

  // Dashboard stats
  const stats = {
    totalPartners: partners.length,
    activePartners: partners.filter((p) => p.status === "active").length,
    pendingPartners: partners.filter((p) => p.status === "pending").length,
    totalCommission: partners.reduce((sum, p) => sum + (p.commisionRate || 0), 0),
    totalMembers: partners.reduce((sum, p) => sum + (p.memberCount || 0), 0),
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
            <p className="text-muted-foreground">
              Manage your business partners and their information
            </p>
          </div>
          <Button onClick={() => router.push("/admin/partners/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPartners}</div>
              <p className="text-xs text-muted-foreground">All registered partners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePartners}</div>
              <p className="text-xs text-muted-foreground">Currently active partners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPartners}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCommission}%</div>
              <p className="text-xs text-muted-foreground">Sum of all partners' commission rates</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">Members associated with all partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Partners</CardTitle>
            <CardDescription>
              Find partners by name or email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Partners List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Loading partners...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {partners.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-32">
                  <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No partners found</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => router.push("/admin/partners/new")}
                  >
                    Add your first partner
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">{partner.name}</h3>
                              <Badge className={getStatusColor(partner.status)}>
                                {partner.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {partner.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {partner.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {partner.city}, {partner.state} {partner.zipcode}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                {partner.category}
                              </div>
                              {partner.website && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Globe className="h-4 w-4" />
                                  {partner.website}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                {partner.commisionRate}% commission
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <UserPlus className="h-4 w-4" />
                                {partner.memberCount} members
                              </div>
                            </div>
                            
                            {partner.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {partner.description}
                              </p>
                            )}
                            
                            <div className="text-xs text-muted-foreground">
                              Created: {formatDate(partner.createdAt)} | 
                              Updated: {formatDate(partner.updatedAt)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/partners/${partner.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/partners/${partner.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(partner.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} partners
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 