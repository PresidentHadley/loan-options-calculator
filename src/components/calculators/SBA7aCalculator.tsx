"use client";

import Calculator from "./Calculator";
import { getCalculatorDefaults } from "@/lib/calculations";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";

interface SBA7aCalculatorProps {
  branding?: BrokerBranding;
  brokerId?: string;
  onLeadSubmit?: (data: LeadFormData & { results: LoanResults }) => void;
}

export default function SBA7aCalculator({
  branding,
  brokerId,
  onLeadSubmit,
}: SBA7aCalculatorProps) {
  return (
    <Calculator
      config={getCalculatorDefaults("sba-7a")}
      type="sba-7a"
      branding={branding}
      brokerId={brokerId}
      onLeadSubmit={onLeadSubmit}
    />
  );
}
