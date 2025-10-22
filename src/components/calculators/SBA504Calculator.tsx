"use client";

import Calculator from "./Calculator";
import { getCalculatorDefaults } from "@/lib/calculations";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";

interface SBA504CalculatorProps {
  branding?: BrokerBranding;
  brokerId?: string;
  onLeadSubmit?: (data: LeadFormData & { results: LoanResults }) => void;
}

export default function SBA504Calculator({
  branding,
  brokerId,
  onLeadSubmit,
}: SBA504CalculatorProps) {
  return (
    <Calculator
      config={getCalculatorDefaults("sba-504")}
      type="sba-504"
      branding={branding}
      brokerId={brokerId}
      onLeadSubmit={onLeadSubmit}
    />
  );
}
