"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SBA7aCalculator from "@/components/calculators/SBA7aCalculator";
import SBA504Calculator from "@/components/calculators/SBA504Calculator";
import EquipmentCalculator from "@/components/calculators/EquipmentCalculator";
import WorkingCapitalCalculator from "@/components/calculators/WorkingCapitalCalculator";
import FranchiseCalculator from "@/components/calculators/FranchiseCalculator";
import BusinessAcquisitionCalculator from "@/components/calculators/BusinessAcquisitionCalculator";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator as CalculatorIcon } from "lucide-react";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";
import Image from "next/image";
import { ContactBrokerButton } from "@/components/calculators/ContactBrokerButton";

interface Broker {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  contactPhone?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  enabledCalculators: string[];
}

export default function BrokerCalculatorHub() {
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

  const calculatorOptions = [
    {
      id: "sba-7a",
      name: "SBA 7(a) Loan",
      icon: "🏦",
      description: "General business loans up to $5M",
    },
    {
      id: "sba-504",
      name: "SBA 504 Loan",
      icon: "🏢",
      description: "Real estate & equipment financing",
    },
    {
      id: "equipment",
      name: "Equipment Financing",
      icon: "🚜",
      description: "Finance business equipment",
    },
    {
      id: "working-capital",
      name: "Working Capital",
      icon: "💰",
      description: "Short-term business funding",
    },
    {
      id: "franchise",
      name: "Franchise Loan",
      icon: "🍔",
      description: "Financing for franchise businesses",
    },
    {
      id: "business-acquisition",
      name: "Business Acquisition",
      icon: "🤝",
      description: "Buy an existing business",
    },
  ];

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

  if (!broker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Calculator Not Found</h2>
            <p className="text-muted-foreground">
              This calculator page doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const branding: BrokerBranding = {
    companyName: broker.companyName,
    logoUrl: broker.logoUrl,
    primaryColor: broker.primaryColor,
    secondaryColor: broker.secondaryColor,
  };

  const enabledCalculators = calculatorOptions.filter((calc) =>
    broker.enabledCalculators.includes(calc.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-muted-foreground">
                Business Loan Calculators
              </div>
              <ContactBrokerButton
                contactName={broker.contactName}
                email={broker.email}
                phone={broker.contactPhone}
                companyName={broker.companyName}
                primaryColor={broker.primaryColor}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Calculator Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: broker.primaryColor }}
          >
            Calculate Your Loan Options
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a calculator below to estimate your monthly payments and
            total loan costs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {enabledCalculators.map((calc) => (
            <Card
              key={calc.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/${brokerId}/${calc.id}`)}
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{calc.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{calc.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {calc.description}
                </p>
                <button
                  className="mt-4 w-full py-2 px-4 rounded-md text-white font-medium"
                  style={{ backgroundColor: broker.secondaryColor }}
                >
                  Calculate Now
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {broker.companyName}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
