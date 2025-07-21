"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Clock, Play } from "lucide-react";

const DEMO_CAMPAIGNS = [
  {
    id: "1",
    name: "Welcome Bonus",
    type: "Direct",
    trigger: "Signup",
  },
  {
    id: "2",
    name: "Summer Referral",
    type: "Referral",
    trigger: "Referral",
  },
  {
    id: "3",
    name: "Flash Sale",
    type: "Time-Based",
    trigger: "Purchase",
  },
];

const TRIGGERS = [
  { value: "Signup", label: "Signup" },
  { value: "Referral", label: "Referral" },
  { value: "Purchase", label: "Purchase" },
  { value: "CustomEvent", label: "Custom Event" },
];

export default function CampaignSimulationPage() {
  const [step, setStep] = useState(0);
  const [selectedTrigger, setSelectedTrigger] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [member, setMember] = useState({ id: "", name: "", email: "" });
  const [referrer, setReferrer] = useState({ id: "", name: "", email: "" });
  const [eventDetails, setEventDetails] = useState({ amount: "", eventName: "" });
  const [result, setResult] = useState<any>(null);

  // Step 1: Trigger selection
  function handleTriggerSelect(value: string) {
    setSelectedTrigger(value);
    setSelectedCampaign("");
    setStep(1);
  }

  // Step 2: Campaign selection (optional, if multiple campaigns for trigger)
  function handleCampaignSelect(value: string) {
    setSelectedCampaign(value);
    setStep(2);
  }

  // Step 3: Member details
  function handleMemberChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMember({ ...member, [e.target.name]: e.target.value });
  }

  // Step 4: Referrer details (if referral)
  function handleReferrerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReferrer({ ...referrer, [e.target.name]: e.target.value });
  }

  // Step 5: Transaction/Event details
  function handleEventDetailsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  }

  function handleSimulate() {
    // Mock simulation result
    setResult({
      success: true,
      message: "Simulation complete!",
      campaign: DEMO_CAMPAIGNS.find((c) => c.id === selectedCampaign),
      member,
      referrer: selectedTrigger === "Referral" ? referrer : undefined,
      eventDetails,
      reward: selectedTrigger === "Referral" ? "Both member and referrer receive 100 points" : "Member receives 100 points",
    });
    setStep(4);
  }

  // Stepper UI
  return (
    <DashboardLayout role="admin">
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Campaign Simulation</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Simulate Campaign Effect</CardTitle>
            <CardDescription>Test how campaigns will behave for different triggers and member scenarios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stepper */}
            <div className="flex gap-2 mb-4">
              <Badge variant={step === 0 ? "default" : "outline"}>1. Trigger</Badge>
              <Badge variant={step === 1 ? "default" : "outline"}>2. Member</Badge>
              {selectedTrigger === "Referral" && <Badge variant={step === 2 ? "default" : "outline"}>3. Referrer</Badge>}
              <Badge variant={step === (selectedTrigger === "Referral" ? 3 : 2) ? "default" : "outline"}>4. Transaction/Event</Badge>
              <Badge variant={step === (selectedTrigger === "Referral" ? 4 : 3) ? "default" : "outline"}>5. Result</Badge>
            </div>

            {/* Step 1: Trigger selection */}
            {step === 0 && (
              <div className="space-y-4">
                <Label>Trigger</Label>
                <Select value={selectedTrigger} onValueChange={handleTriggerSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGERS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTrigger && (
                  <div className="space-y-2">
                    <Label>Campaign</Label>
                    <Select value={selectedCampaign} onValueChange={handleCampaignSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEMO_CAMPAIGNS.filter((c) => c.trigger === selectedTrigger).map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name} ({c.type})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Member details */}
            {step === 1 && (
              <div className="space-y-4">
                <Label>Member Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="id" value={member.id} onChange={handleMemberChange} placeholder="Member ID" />
                  <Input name="name" value={member.name} onChange={handleMemberChange} placeholder="Member Name" />
                  <Input name="email" value={member.email} onChange={handleMemberChange} placeholder="Member Email" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(selectedTrigger === "Referral" ? 2 : 3)} disabled={!member.id || !member.name}>Next</Button>
                </div>
              </div>
            )}

            {/* Step 3: Referrer details (for referral) */}
            {step === 2 && selectedTrigger === "Referral" && (
              <div className="space-y-4">
                <Label>Referrer Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="id" value={referrer.id} onChange={handleReferrerChange} placeholder="Referrer ID" />
                  <Input name="name" value={referrer.name} onChange={handleReferrerChange} placeholder="Referrer Name" />
                  <Input name="email" value={referrer.email} onChange={handleReferrerChange} placeholder="Referrer Email" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)} disabled={!referrer.id || !referrer.name}>Next</Button>
                </div>
              </div>
            )}

            {/* Step 4: Transaction/Event details */}
            {((step === 2 && selectedTrigger !== "Referral") || (step === 3 && selectedTrigger === "Referral")) && (
              <div className="space-y-4">
                <Label>Transaction / Event Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="amount" value={eventDetails.amount} onChange={handleEventDetailsChange} placeholder="Amount (if applicable)" />
                  <Input name="eventName" value={eventDetails.eventName} onChange={handleEventDetailsChange} placeholder="Event Name (if custom)" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(selectedTrigger === "Referral" ? 2 : 1)}>Back</Button>
                  <Button onClick={handleSimulate} disabled={!selectedCampaign}>Simulate</Button>
                </div>
              </div>
            )}

            {/* Step 5: Result */}
            {((step === 3 && selectedTrigger !== "Referral") || (step === 4 && selectedTrigger === "Referral")) && result && (
              <div className="space-y-4">
                <Label>Simulation Result</Label>
                <Card className="bg-muted">
                  <CardContent className="space-y-2 py-4">
                    <div className="font-semibold">{result.campaign?.name} ({result.campaign?.type})</div>
                    <div>Member: {result.member.name} ({result.member.email})</div>
                    {result.referrer && <div>Referrer: {result.referrer.name} ({result.referrer.email})</div>}
                    <div>Trigger: {selectedTrigger}</div>
                    <div>Event: {eventDetails.eventName || "-"}</div>
                    <div>Amount: {eventDetails.amount || "-"}</div>
                    <div className="font-bold text-green-700 mt-2">{result.reward}</div>
                  </CardContent>
                </Card>
                <Button onClick={() => { setStep(0); setResult(null); setSelectedTrigger(""); setSelectedCampaign(""); setMember({ id: "", name: "", email: "" }); setReferrer({ id: "", name: "", email: "" }); setEventDetails({ amount: "", eventName: "" }); }}>Simulate Another</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 