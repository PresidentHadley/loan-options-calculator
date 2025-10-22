// src/lib/calculations.ts

import {
  LoanInputs,
  LoanResults,
  AmortizationRow,
  CalculatorDefaults,
} from "@/types";

export function calculateLoan(inputs: LoanInputs): LoanResults {
  const { loanAmount, interestRate, loanTermMonths, downPayment = 0 } = inputs;

  const principal = loanAmount - downPayment;
  const monthlyRate = interestRate / 100 / 12;

  // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

  const totalPaid = monthlyPayment * loanTermMonths;
  const totalInterest = totalPaid - principal;
  const totalCost = totalPaid + downPayment;

  // Generate amortization schedule
  const amortizationSchedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= loanTermMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    amortizationSchedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  return {
    monthlyPayment,
    totalInterest,
    totalCost,
    amortizationSchedule,
  };
}

export const CALCULATOR_DEFAULTS: Record<string, CalculatorDefaults> = {
  "sba-7a": {
    name: "SBA 7(a) Loan Calculator",
    defaultAmount: 500000,
    defaultTerm: 120,
    defaultRate: 11.5,
    minAmount: 5000,
    maxAmount: 5000000,
    termOptions: [60, 84, 120, 180, 300],
  },
  "sba-504": {
    name: "SBA 504 Loan Calculator",
    defaultAmount: 1000000,
    defaultTerm: 240,
    defaultRate: 6.5,
    minAmount: 125000,
    maxAmount: 5500000,
    termOptions: [120, 180, 240, 300],
  },
  equipment: {
    name: "Equipment Financing Calculator",
    defaultAmount: 250000,
    defaultTerm: 60,
    defaultRate: 9.5,
    minAmount: 10000,
    maxAmount: 5000000,
    termOptions: [36, 48, 60, 84],
  },
  "working-capital": {
    name: "Working Capital Loan Calculator",
    defaultAmount: 100000,
    defaultTerm: 24,
    defaultRate: 15,
    minAmount: 5000,
    maxAmount: 500000,
    termOptions: [6, 12, 18, 24, 36],
  },
  franchise: {
    name: "Franchise Loan Calculator",
    defaultAmount: 350000,
    defaultTerm: 120,
    defaultRate: 11,
    minAmount: 50000,
    maxAmount: 5000000,
    termOptions: [60, 84, 120, 180],
  },
  "business-acquisition": {
    name: "Business Acquisition Loan Calculator",
    defaultAmount: 750000,
    defaultTerm: 120,
    defaultRate: 10.5,
    minAmount: 50000,
    maxAmount: 5000000,
    termOptions: [60, 84, 120, 180, 240],
  },
  "commercial-property": {
    name: "Commercial Property Loan Calculator",
    defaultAmount: 2000000,
    defaultTerm: 300,
    defaultRate: 7.5,
    minAmount: 100000,
    maxAmount: 50000000,
    termOptions: [120, 180, 240, 300, 360],
  },
  "multi-family": {
    name: "Multi-Family Property Loan Calculator",
    defaultAmount: 3000000,
    defaultTerm: 300,
    defaultRate: 7.25,
    minAmount: 250000,
    maxAmount: 50000000,
    termOptions: [180, 240, 300, 360],
  },
  "office-retail": {
    name: "Office/Retail Space Loan Calculator",
    defaultAmount: 1500000,
    defaultTerm: 240,
    defaultRate: 7.75,
    minAmount: 150000,
    maxAmount: 25000000,
    termOptions: [120, 180, 240, 300],
  },
  "line-of-credit": {
    name: "Line of Credit Calculator",
    defaultAmount: 250000,
    defaultTerm: 12,
    defaultRate: 12,
    minAmount: 10000,
    maxAmount: 1000000,
    termOptions: [6, 12, 18, 24, 36],
  },
  "invoice-financing": {
    name: "Invoice Financing Calculator",
    defaultAmount: 100000,
    defaultTerm: 3,
    defaultRate: 18,
    minAmount: 5000,
    maxAmount: 500000,
    termOptions: [1, 3, 6, 12],
  },
  "merchant-cash-advance": {
    name: "Merchant Cash Advance Calculator",
    defaultAmount: 50000,
    defaultTerm: 12,
    defaultRate: 35,
    minAmount: 5000,
    maxAmount: 500000,
    termOptions: [3, 6, 9, 12, 18],
  },
  "construction-loan": {
    name: "Construction Loan Calculator",
    defaultAmount: 2500000,
    defaultTerm: 24,
    defaultRate: 8.5,
    minAmount: 100000,
    maxAmount: 25000000,
    termOptions: [12, 18, 24, 36],
  },
  "bridge-loan": {
    name: "Bridge Loan Calculator",
    defaultAmount: 1000000,
    defaultTerm: 12,
    defaultRate: 10,
    minAmount: 50000,
    maxAmount: 10000000,
    termOptions: [6, 12, 18, 24],
  },
  "land-loan": {
    name: "Land Loan Calculator",
    defaultAmount: 500000,
    defaultTerm: 180,
    defaultRate: 9,
    minAmount: 25000,
    maxAmount: 10000000,
    termOptions: [60, 120, 180, 240],
  },
  "term-loan": {
    name: "Term Loan Calculator",
    defaultAmount: 300000,
    defaultTerm: 60,
    defaultRate: 11,
    minAmount: 10000,
    maxAmount: 5000000,
    termOptions: [12, 24, 36, 60, 84, 120],
  },
  "asset-based": {
    name: "Asset-Based Lending Calculator",
    defaultAmount: 500000,
    defaultTerm: 36,
    defaultRate: 13,
    minAmount: 50000,
    maxAmount: 10000000,
    termOptions: [12, 24, 36, 48, 60],
  },
  "inventory-financing": {
    name: "Inventory Financing Calculator",
    defaultAmount: 200000,
    defaultTerm: 12,
    defaultRate: 14,
    minAmount: 10000,
    maxAmount: 2000000,
    termOptions: [6, 12, 18, 24, 36],
  },
};

export function getCalculatorDefaults(type: string): CalculatorDefaults {
  return CALCULATOR_DEFAULTS[type] || CALCULATOR_DEFAULTS["sba-7a"];
}
