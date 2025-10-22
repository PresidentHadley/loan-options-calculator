"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SBA7aCalculator from "@/components/calculators/SBA7aCalculator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";
import Image from "next/image";
import { ContactBrokerButton } from "@/components/calculators/ContactBrokerButton";

interface Broker {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  contactPhone?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function SBA7aPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const brokerId = params.brokerId as string;

  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBroker();
  }, [brokerId]);

  const fetchBroker = async () => {
    try {
      const res = await fetch(`/api/brokers/${brokerId}`);
      if (!res.ok) throw new Error("Broker not found");
      const data = await res.json();
      setBroker(data.broker);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load calculator",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (
    data: LeadFormData & { results: LoanResults }
  ) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brokerId: broker?.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          businessName: data.businessName,
          message: data.message,
          calculatorType: "sba-7a",
          loanAmount: data.results.totalCost - data.results.totalInterest,
          loanTerm: data.results.amortizationSchedule.length,
          monthlyPayment: data.results.monthlyPayment,
          totalInterest: data.results.totalInterest,
          totalCost: data.results.totalCost,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast({
        title: "Success!",
        description: `${broker?.companyName} will contact you shortly.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading calculator...</p>
        </div>
      </div>
    );
  }

  if (!broker) return null;

  const branding: BrokerBranding = {
    companyName: broker.companyName,
    logoUrl: broker.logoUrl,
    primaryColor: broker.primaryColor,
    secondaryColor: broker.secondaryColor,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/${brokerId}`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {broker.logoUrl ? (
                <Image
                  src={broker.logoUrl}
                  alt={broker.companyName}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : (
                <h1
                  className="text-2xl font-bold"
                  style={{ color: broker.primaryColor }}
                >
                  {broker.companyName}
                </h1>
              )}
            </div>
            <ContactBrokerButton
              contactName={broker.contactName}
              email={broker.email}
              phone={broker.contactPhone}
              websiteUrl={broker.websiteUrl}
              linkedinUrl={broker.linkedinUrl}
              companyName={broker.companyName}
              primaryColor={broker.primaryColor}
            />
          </div>
        </div>
      </header>

      {/* Calculator */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <SBA7aCalculator
          branding={branding}
          brokerId={broker.id}
          onLeadSubmit={handleLeadSubmit}
        />
      </div>
    </div>
  );
}
