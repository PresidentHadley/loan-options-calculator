"use client";

import Calculator from "./Calculator";
import { getCalculatorDefaults } from "@/lib/calculations";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";

interface WorkingCapitalCalculatorProps {
  branding?: BrokerBranding;
  brokerId?: string;
  onLeadSubmit?: (data: LeadFormData & { results: LoanResults }) => void;
}

export default function WorkingCapitalCalculator({
  branding,
  brokerId,
  onLeadSubmit,
}: WorkingCapitalCalculatorProps) {
  return (
    <Calculator
      config={getCalculatorDefaults("working-capital")}
      type="working-capital"
      branding={branding}
      brokerId={brokerId}
      onLeadSubmit={onLeadSubmit}
    />
  );
}
