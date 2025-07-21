"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PartnerForm } from "@/components/admin/partner-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface EditPartnerPageProps { 
  params: { id: string } 
}

export default function EditPartnerPage({ params }: EditPartnerPageProps) {
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [partner, setPartner] = useState<any>(null);

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

  const handleUpdatePartner = async (updatedPartner: any) => {
    setIsLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedPartner),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update partner");
      }
      
      toast({
        title: "Success",
        description: "Partner updated successfully.",
      });
      
      router.push("/admin/partners");
    } catch (error) {
      console.error("Error updating partner:", error);
      toast({
        title: "Error",
        description: "Failed to update partner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/partners");
  };

  if (isLoading && !partner) {
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

  return (
    
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            className="flex items-center px-3 py-2 border rounded hover:bg-muted"
            onClick={() => router.push("/admin/partners")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Update Partner</h1>
        </div>
        
        {partner && (
          <PartnerForm
            initialValues={{ ...partner, onCancel: handleCancel }}
            onSubmit={handleUpdatePartner}
            isLoading={isLoading}
            mode="edit"
          />
        )}
      </div>
  
  );
} 