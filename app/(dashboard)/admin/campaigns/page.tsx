"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Gift, Users, Clock } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "Direct" | "Referral" | "Time-Based";
  levels: string[];
  segments: string[];
  coupons: string[];
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
}

const DEMO_LEVELS = [
  { id: "level1", name: "Silver" },
  { id: "level2", name: "Gold" },
  { id: "level3", name: "Platinum" },
];
const DEMO_SEGMENTS = [
  { id: "segment1", name: "New Customers" },
  { id: "segment2", name: "Loyal Customers" },
  { id: "segment3", name: "High Spenders" },
];
const CAMPAIGN_TYPES = ["Direct", "Referral", "Time-Based"];
const LOCAL_STORAGE_KEY = "ol-campaigns";

function getInitialCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  const demo: Campaign[] = [
    {
      id: "1",
      name: "Welcome Bonus",
      type: "Direct",
      levels: ["level1"],
      segments: ["segment1"],
      coupons: ["WELCOME10"],
      startDate: "2024-06-01",
      endDate: "2024-07-01",
      status: "Active",
    },
    {
      id: "2",
      name: "Summer Referral",
      type: "Referral",
      levels: ["level2", "level3"],
      segments: ["segment2"],
      coupons: ["SUMMER20", "REFERRAL5"],
      startDate: "2024-07-01",
      endDate: "2024-08-01",
      status: "Inactive",
    },
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demo));
  return demo;
}

function saveCampaigns(campaigns: Campaign[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaigns));
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState<Campaign>({
    id: "",
    name: "",
    type: "Direct",
    levels: [],
    segments: [],
    coupons: [],
    startDate: "",
    endDate: "",
    status: "Active",
  });
  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    setCampaigns(getInitialCampaigns());
  }, []);

  function openCreate() {
    setForm({
      id: "",
      name: "",
      type: "Direct",
      levels: [],
      segments: [],
      coupons: [],
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setEditing(null);
    setIsDialogOpen(true);
  }

  function openEdit(campaign: Campaign) {
    setForm({ ...campaign });
    setEditing(campaign);
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setEditing(null);
    setForm({
      id: "",
      name: "",
      type: "Direct",
      levels: [],
      segments: [],
      coupons: [],
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setCouponInput("");
  }

  function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((f) => {
        const arr = f[name as keyof Campaign] as string[];
        if (checked) return { ...f, [name]: [...arr, value] };
        return { ...f, [name]: arr.filter((v) => v !== value) };
      });
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleTypeChange(value: string) {
    setForm((f) => ({ ...f, type: value as Campaign["type"] }));
  }

  function addCoupon() {
    if (couponInput.trim() && !form.coupons.includes(couponInput.trim())) {
      setForm((f) => ({ ...f, coupons: [...f.coupons, couponInput.trim()] }));
      setCouponInput("");
    }
  }

  function removeCoupon(c: string) {
    setForm((f) => ({ ...f, coupons: f.coupons.filter((x) => x !== c) }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let updated: Campaign[];
    if (editing) {
      updated = campaigns.map((c) => (c.id === form.id ? { ...form } : c));
    } else {
      updated = [
        ...campaigns,
        { ...form, id: Date.now().toString() },
      ];
    }
    setCampaigns(updated);
    saveCampaigns(updated);
    closeDialog();
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this campaign?")) return;
    const updated = campaigns.filter((c) => c.id !== id);
    setCampaigns(updated);
    saveCampaigns(updated);
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Campaign Management</h1>
            <p className="text-muted-foreground">Create and manage marketing campaigns for your loyalty program</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit" : "Create"} Campaign</DialogTitle>
                <DialogDescription>
                  Fill in the details to {editing ? "update" : "create"} a campaign. Choose the campaign type: Direct, Referral, or Time-Based.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" value={form.name} onChange={handleFormChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={form.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Levels</Label>
                    <div className="flex flex-wrap gap-2">
                      {DEMO_LEVELS.map((l) => (
                        <label key={l.id} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            name="levels"
                            value={l.id}
                            checked={form.levels.includes(l.id)}
                            onChange={handleFormChange}
                          />
                          {l.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Segments</Label>
                    <div className="flex flex-wrap gap-2">
                      {DEMO_SEGMENTS.map((s) => (
                        <label key={s.id} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            name="segments"
                            value={s.id}
                            checked={form.segments.includes(s.id)}
                            onChange={handleFormChange}
                          />
                          {s.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Coupons</Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Add coupon code"
                    />
                    <Button type="button" onClick={addCoupon} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.coupons.map((c) => (
                      <Badge key={c} className="flex items-center gap-1 bg-muted text-foreground">
                        {c}
                        <button type="button" onClick={() => removeCoupon(c)} className="ml-1 text-red-500">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as Campaign["status"] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                  <Button type="submit">{editing ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No campaigns found.
              </CardContent>
            </Card>
          ) : (
            campaigns.map((c) => (
              <Card key={c.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {c.type === "Direct" && <Gift className="w-5 h-5 text-primary" />}
                    {c.type === "Referral" && <Users className="w-5 h-5 text-primary" />}
                    {c.type === "Time-Based" && <Clock className="w-5 h-5 text-primary" />}
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <Badge className="ml-2" variant={c.status === "Active" ? "default" : "outline"}>{c.status}</Badge>
                  </div>
                  <CardDescription className="mb-1">{c.type} campaign</CardDescription>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span>Levels: {c.levels.map(lid => DEMO_LEVELS.find(l => l.id === lid)?.name).join(", ") || "-"}</span>
                    <span>Segments: {c.segments.map(sid => DEMO_SEGMENTS.find(s => s.id === sid)?.name).join(", ") || "-"}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {c.coupons.map((coupon) => (
                      <Badge key={coupon} variant="secondary">{coupon}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Start: {c.startDate}</span>
                    <span>End: {c.endDate}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 