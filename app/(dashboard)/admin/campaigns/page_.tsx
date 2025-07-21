"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardLayout } from "@/components/layout/dashboard-layout"
// Types
export type CampaignType = 'Return' | 'Referral' | 'Time-Based' | 'Redemption Code' | 'Internal Event';

export interface Campaign {
  campaignId: string;
  reward: string;
  name: string;
  shortDescription?: string;
  conditionsDescription?: string;
  usageInstruction?: string;
  active: boolean;
  costInPoints: number;
  levels: string; // JSON string
  segments: string; // JSON string
  unlimited: boolean;
  singleCoupon: boolean;
  usageLimit?: number;
  limitPerUser?: number;
  coupons: string; // JSON string
  campaignActivityAllTimeActive?: boolean;
  campaignActivityActiveFrom?: string;
  campaignActivityActiveTo?: string;
  campaignVisibilityAllTimeVisible?: boolean;
  campaignVisibilityVisibleFrom?: string;
  campaignVisibilityVisibleTo?: string;
  campaignPhotoPath?: string;
  campaignPhotoOriginalName?: string;
  campaignPhotoMime?: string;
}

const CAMPAIGN_TYPE_OPTIONS: { label: string; value: CampaignType }[] = [
  { label: 'Return', value: 'Return' },
  { label: 'Referral', value: 'Referral' },
  { label: 'Time-Based', value: 'Time-Based' },
  { label: 'Redemption Code', value: 'Redemption Code' },
  { label: 'Internal Event', value: 'Internal Event' },
];

export default function CampaignManagementPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({ active: true });
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const res = await fetch('/api/campaign');
    const data = await res.json();
    setCampaigns(data.campaigns || []);
  }

  function filteredCampaigns() {
    return campaigns.filter(c =>
      (!search || c.name.toLowerCase().includes(search.toLowerCase()))
    );
  }

  async function handleCreate() {
    await fetch('/api/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCampaign),
    });
    setShowCreate(false);
    setNewCampaign({ active: true });
    fetchCampaigns();
  }

  return (
    <DashboardLayout role='admin'>
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button>Create Campaign</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Campaign</DialogTitle>
            <div className="space-y-4">
              <Input
                placeholder="Campaign Name"
                value={newCampaign.name || ''}
                onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
              <Input
                placeholder="Reward"
                value={newCampaign.reward || ''}
                onChange={e => setNewCampaign({ ...newCampaign, reward: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cost in Points"
                value={newCampaign.costInPoints || ''}
                onChange={e => setNewCampaign({ ...newCampaign, costInPoints: Number(e.target.value) })}
              />
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <option value="">All Types</option>
          {CAMPAIGN_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns().map(campaign => (
          <Card key={campaign.campaignId} className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">{campaign.name}</span>
              <span className={campaign.active ? 'text-green-600' : 'text-gray-400'}>
                {campaign.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-sm text-gray-500">{campaign.reward}</div>
            <div className="text-xs">Cost: {campaign.costInPoints} pts</div>
            {/* Placeholder for edit/simulate/follow-up actions */}
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="secondary">Simulate</Button>
              <Button size="sm" variant="ghost">Follow-up</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </DashboardLayout>
  );
} 