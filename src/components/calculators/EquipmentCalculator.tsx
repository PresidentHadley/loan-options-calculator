"use client";

import Calculator from "./Calculator";
import { getCalculatorDefaults } from "@/lib/calculations";
import type { BrokerBranding, LeadFormData, LoanResults } from "@/types";

interface EquipmentCalculatorProps {
  branding?: BrokerBranding;
  brokerId?: string;
  onLeadSubmit?: (data: LeadFormData & { results: LoanResults }) => void;
}

export default function EquipmentCalculator({
  branding,
  brokerId,
  onLeadSubmit,
}: EquipmentCalculatorProps) {
  return (
    <Calculator
      config={getCalculatorDefaults("equipment")}
      type="equipment"
      branding={branding}
      brokerId={brokerId}
      onLeadSubmit={onLeadSubmit}
    />
  );
}
