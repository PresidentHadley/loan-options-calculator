"use client";

import Calculator from "./Calculator";
import { getCalculatorDefaults } from "@/lib/calculations";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";

interface FranchiseCalculatorProps {
  branding?: BrokerBranding;
  brokerId?: string;
  onLeadSubmit?: (data: LeadFormData & { results: LoanResults }) => void;
}

export default function FranchiseCalculator({
  branding,
  brokerId,
  onLeadSubmit,
}: FranchiseCalculatorProps) {
  return (
    <Calculator
      config={getCalculatorDefaults("franchise")}
      type="franchise"
      branding={branding}
      brokerId={brokerId}
      onLeadSubmit={onLeadSubmit}
    />
  );
}
