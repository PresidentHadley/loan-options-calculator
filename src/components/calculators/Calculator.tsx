"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateLoan, type CalculatorDefaults } from "@/lib/calculations";
import { formatCurrency, formatCurrencyDetailed } from "@/lib/utils";
import type { LoanResults, BrokerBranding, LeadFormData } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Calendar, TrendingUp } from "lucide-react";

interface CalculatorProps {
  config: CalculatorDefaults;
  type: string;
  branding?: BrokerBranding;
  brokerId?: string;
  onLeadSubmit?: (data: LeadFormData & { results: LoanResults }) => void;
}

export default function Calculator({
  config,
  type,
  branding,
  brokerId,
  onLeadSubmit,
}: CalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(config.defaultAmount);
  const [loanTerm, setLoanTerm] = useState(config.defaultTerm);
  const [interestRate, setInterestRate] = useState(config.defaultRate);
  const [downPayment, setDownPayment] = useState(0);
  const [results, setResults] = useState<LoanResults | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    calculate();
  }, [loanAmount, loanTerm, interestRate, downPayment]);

  const calculate = () => {
    try {
      const result = calculateLoan({
        loanAmount,
        interestRate,
        loanTermMonths: loanTerm,
        downPayment,
      });
      setResults(result);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!results || !onLeadSubmit) return;

    setSubmitting(true);
    try {
      await onLeadSubmit({
        ...leadData,
        results,
      });
      setShowLeadForm(false);
      setLeadData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        message: "",
      });
    } catch (error) {
      console.error("Lead submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const primaryColor = branding?.primaryColor || "#1e3a8a";
  const secondaryColor = branding?.secondaryColor || "#10b981";

  // Prepare chart data (showing every 12th month for readability)
  const chartData =
    results?.amortizationSchedule
      .filter(
        (_, index) =>
          index % 12 === 0 || index === results.amortizationSchedule.length - 1
      )
      .map((row) => ({
        month: row.month,
        balance: Math.round(row.balance),
        principal: Math.round(row.principal),
        interest: Math.round(row.interest),
      })) || [];

  return (
    <div className="space-y-6">
      {/* Calculator Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: primaryColor }}>
            {config.name}
          </CardTitle>
          <CardDescription>
            Calculate your monthly payments and total loan costs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loan Amount */}
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">
                $
              </span>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                min={config.minAmount}
                max={config.maxAmount}
                step={1000}
                className="pl-8"
              />
            </div>
            <input
              type="range"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              min={config.minAmount}
              max={config.maxAmount}
              step={1000}
              className="w-full"
              style={{
                accentColor: primaryColor,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(config.minAmount)}</span>
              <span>{formatCurrency(config.maxAmount)}</span>
            </div>
          </div>

          {/* Down Payment */}
          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment (Optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">
                $
              </span>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                min={0}
                max={loanAmount}
                step={1000}
                className="pl-8"
              />
            </div>
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term</Label>
            <Select
              value={loanTerm.toString()}
              onValueChange={(val) => setLoanTerm(Number(val))}
            >
              <SelectTrigger id="loanTerm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.termOptions.map((term) => (
                  <SelectItem key={term} value={term.toString()}>
                    {term} months ({Math.round(term / 12)} years)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min={0}
              max={30}
              step={0.1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>Estimated loan payment breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Monthly Payment</span>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {formatCurrencyDetailed(results.monthlyPayment)}
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Total Interest</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(results.totalInterest)}
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Total Cost</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(results.totalCost)}
                </div>
              </div>
            </div>

            {/* Tabs for detailed view */}
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">Payment Chart</TabsTrigger>
                <TabsTrigger value="schedule">
                  Amortization Schedule
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        label={{
                          value: "Month",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        label={{
                          value: "Balance ($)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Month ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke={primaryColor}
                        fill={primaryColor}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left p-2">Month</th>
                        <th className="text-right p-2">Payment</th>
                        <th className="text-right p-2">Principal</th>
                        <th className="text-right p-2">Interest</th>
                        <th className="text-right p-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.amortizationSchedule.map((row) => (
                        <tr key={row.month} className="border-t">
                          <td className="p-2">{row.month}</td>
                          <td className="text-right p-2">
                            {formatCurrency(row.payment)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            {/* CTA Button */}
            {brokerId && !showLeadForm && (
              <Button
                onClick={() => setShowLeadForm(true)}
                className="w-full"
                size="lg"
                style={{ backgroundColor: secondaryColor }}
              >
                Get Pre-Qualified - Talk to an Expert
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lead Capture Form */}
      {showLeadForm && brokerId && (
        <Card>
          <CardHeader>
            <CardTitle>Get Expert Help with Your Loan</CardTitle>
            <CardDescription>
              Fill out the form below and {branding?.companyName || "our team"}{" "}
              will contact you shortly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={leadData.name}
                    onChange={(e) =>
                      setLeadData({ ...leadData, name: e.target.value })
                    }
                    placeholder="John Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={leadData.email}
                    onChange={(e) =>
                      setLeadData({ ...leadData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={leadData.phone}
                    onChange={(e) =>
                      setLeadData({ ...leadData, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={leadData.businessName}
                    onChange={(e) =>
                      setLeadData({ ...leadData, businessName: e.target.value })
                    }
                    placeholder="ABC Company"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <textarea
                  id="message"
                  value={leadData.message}
                  onChange={(e) =>
                    setLeadData({ ...leadData, message: e.target.value })
                  }
                  placeholder="Tell us more about your financing needs..."
                  className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLeadForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
