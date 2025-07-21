"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MerchantForm } from "@/components/admin/merchant-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface EditMerchantPageProps { 
  params: { id: string } 
}

export default function EditMerchantPage({ params }: EditMerchantPageProps) {
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [merchant, setMerchant] = useState<any>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      setIsLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`/api/admin/merchants/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch merchant");
        }
        
        const data = await response.json();
        setMerchant(data);
      } catch (error) {
        console.error("Error fetching merchant:", error);
        toast({
          title: "Error",
          description: "Failed to load merchant.",
          variant: "destructive",
        });
        router.push("/admin/merchants");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMerchant();
    }
  }, [id, router, toast]);

  const handleUpdateMerchant = async (updatedMerchant: any) => {
    setIsLoading(true);
    try {
      // Filter out empty strings and null values
      const filteredMerchant = Object.fromEntries(
        Object.entries(updatedMerchant).filter(([key, value]) => {
          if (key === 'onCancel') return false; // Skip the callback
          if (value === null || value === undefined) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          return true;
        })
      );

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`/api/admin/merchants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(filteredMerchant),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update merchant");
      }
      
      toast({
        title: "Success",
        description: "Merchant updated successfully.",
      });
      
      router.push("/admin/merchants");
    } catch (error) {
      console.error("Error updating merchant:", error);
      toast({
        title: "Error",
        description: "Failed to update merchant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/merchants");
  };

  if (isLoading && !merchant) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading merchant...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            className="flex items-center px-3 py-2 border rounded hover:bg-muted"
            onClick={() => router.push("/admin/merchants")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Merchants
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Update Merchant</h1>
        </div>
        
        {merchant && (
          <MerchantForm
            initialValues={{ ...merchant, onCancel: handleCancel }}
            onSubmit={handleUpdateMerchant}
            isLoading={isLoading}
            mode="edit"
          />
        )}
      </div>
    </DashboardLayout>
  );
} 