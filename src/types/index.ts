// src/types/index.ts

export interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  downPayment?: number;
}

export interface LoanResults {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface CalculatorDefaults {
  name: string;
  defaultAmount: number;
  defaultTerm: number;
  defaultRate: number;
  minAmount: number;
  maxAmount: number;
  termOptions: number[];
}

export interface BrokerBranding {
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface LeadFormData {
  name?: string;
  email: string;
  phone?: string;
  businessName?: string;
  message?: string;
}
