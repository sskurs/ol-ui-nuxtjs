"use client"

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";


interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Partner {
  id: number;
  name: string;
}

export default function AssociatePartnersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);
  const [partnerMembers, setPartnerMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPartnerMembers, setLoadingPartnerMembers] = useState(false);

  // Fetch all members
  useEffect(() => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch("http://localhost:5000/api/admin/members?page=1&limit=1000", {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then((res) => res.json())
      .then((data) => setMembers(data.members || data))
      .catch(() => toast({ title: "Failed to load members", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  // Fetch all partners
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch("http://localhost:5000/api/admin/partners?page=1&limit=1000", {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then((res) => res.json())
      .then((data) => setPartners(data.partners || data))
      .catch(() => toast({ title: "Failed to load partners", variant: "destructive" }));
  }, []);

  // Fetch members for selected partner
  useEffect(() => {
    if (selectedPartnerId) {
      setLoadingPartnerMembers(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      fetch(`http://localhost:5000/api/admin/partners/${selectedPartnerId}/members`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
        .then((res) => res.json())
        .then((data) => setPartnerMembers(data))
        .catch(() => toast({ title: "Failed to load partner's members", variant: "destructive" }))
        .finally(() => setLoadingPartnerMembers(false));
    } else {
      setPartnerMembers([]);
    }
  }, [selectedPartnerId]);

  const filteredMembers = members.filter(
    (m) =>
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.lastName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleMemberSelect = (id: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  const handleAssociate = async () => {
    if (!selectedPartnerId || selectedMemberIds.length === 0) return;
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`http://localhost:5000/api/admin/partners/${selectedPartnerId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ memberIds: selectedMemberIds }),
    });
    if (res.ok) {
      toast({ title: "Members associated with partner." });
      setSelectedMemberIds([]);
      // Refresh partner members
      fetch(`http://localhost:5000/api/admin/partners/${selectedPartnerId}/members`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
        .then((res) => res.json())
        .then((data) => setPartnerMembers(data));
    } else {
      toast({ title: "Failed to associate members", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDisassociate = async (memberId: number) => {
    if (!selectedPartnerId) return;
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`http://localhost:5000/api/admin/partners/${selectedPartnerId}/members/${memberId}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (res.ok) {
      toast({ title: "Member disassociated from partner." });
      setPartnerMembers((prev) => prev.filter((m) => m.id !== memberId));
    } else {
      toast({ title: "Failed to disassociate member", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <DashboardLayout role="admin">
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-10">
      {/* Members Panel */}
      <Card className="flex-1 bg-card text-card-foreground shadow-lg min-w-[320px]">
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-[400px] pr-2">
            {loading ? (
              <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin" /></div>
            ) : (
              filteredMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-2 py-1 border-b last:border-b-0">
                  <input
                    type="checkbox"
                    checked={selectedMemberIds.includes(m.id)}
                    onChange={() => handleMemberSelect(m.id)}
                    className="accent-primary"
                  />
                  <span>{m.firstName} {m.lastName} <span className="text-xs text-muted-foreground">({m.email})</span></span>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Partners Panel */}
      <Card className="flex-1 bg-card text-card-foreground shadow-lg min-w-[320px]">
        <CardHeader>
          <CardTitle>Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[180px] pr-2 mb-4">
            {partners.map((p) => (
              <Button
                key={p.id}
                variant={selectedPartnerId === p.id ? "default" : "outline"}
                onClick={() => setSelectedPartnerId(p.id)}
                className="w-full mb-2 justify-start"
              >
                {p.name}
              </Button>
            ))}
          </ScrollArea>
          <Separator className="my-4" />
          {selectedPartnerId && (
            <>
              <div className="flex items-center justify-between mb-2">
                <Label>Associated Members</Label>
                <Button
                  onClick={handleAssociate}
                  disabled={selectedMemberIds.length === 0 || loading}
                  className="ml-2"
                >
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Associate Selected"}
                </Button>
              </div>
              <ScrollArea className="h-[200px] pr-2">
                {loadingPartnerMembers ? (
                  <div className="flex justify-center items-center h-20"><Loader2 className="animate-spin" /></div>
                ) : partnerMembers.length === 0 ? (
                  <span className="text-muted-foreground">No members associated.</span>
                ) : (
                  partnerMembers.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 py-1 border-b last:border-b-0">
                      <Badge variant="secondary">{m.firstName} {m.lastName}</Badge>
                      <span className="text-xs text-muted-foreground">({m.email})</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDisassociate(m.id)}
                        className="ml-auto"
                        title="Disassociate"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
} 