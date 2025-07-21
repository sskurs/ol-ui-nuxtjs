"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartnerForm } from "@/components/admin/partner-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

export default function NewPartnerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePartner = async (partnerData: any) => {
    setIsLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch("/api/admin/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(partnerData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create partner");
      }
      
      toast({
        title: "Success",
        description: "Partner created successfully.",
      });
      
      router.push("/admin/partners");
    } catch (error) {
      console.error("Error creating partner:", error);
      toast({
        title: "Error",
        description: "Failed to create partner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/partners");
  };

  return (
    <DashboardLayout role="admin">
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
          <h1 className="text-2xl font-bold tracking-tight">Add New Partner</h1>
        </div>
        
        <PartnerForm
          initialValues={{ onCancel: handleCancel }}
          onSubmit={handleCreatePartner}
          isLoading={isLoading}
          mode="add"
        />
      </div>
    </DashboardLayout>
  );
} 