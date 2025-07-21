"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import EarningRules from "@/components/admin/earning-rules";

export default function EarningRulesPage() {
  return (
    <DashboardLayout role="admin">
      <div className="container mx-auto py-6">
        <EarningRules />
      </div>
    </DashboardLayout>
  );
}
