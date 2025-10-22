"use client";

import Calculator from "./Calculator";
import { getCalculatorDefaults } from "@/lib/calculations";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";

interface BusinessAcquisitionCalculatorProps {
  branding?: BrokerBranding;
  brokerId?: string;
  onLeadSubmit?: (data: LeadFormData & { results: LoanResults }) => void;
}

export default function BusinessAcquisitionCalculator({
  branding,
  brokerId,
  onLeadSubmit,
}: BusinessAcquisitionCalculatorProps) {
  return (
    <Calculator
      config={getCalculatorDefaults("business-acquisition")}
      type="business-acquisition"
      branding={branding}
      brokerId={brokerId}
      onLeadSubmit={onLeadSubmit}
    />
  );
}
