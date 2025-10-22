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
};

export function getCalculatorDefaults(type: string): CalculatorDefaults {
  return CALCULATOR_DEFAULTS[type] || CALCULATOR_DEFAULTS["sba-7a"];
}
