import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, Users, TrendingUp, Settings } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const broker = await prisma.broker.findUnique({
    where: { authUserId: user.id },
    include: {
      leads: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!broker) {
    redirect("/login");
  }

  const stats = {
    totalLeads: broker.leadCount,
    totalCalculations: broker.calculationCount,
    conversionRate:
      broker.calculationCount > 0
        ? ((broker.leadCount / broker.calculationCount) * 100).toFixed(1)
        : "0.0",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                Captured from calculators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Calculations
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalCalculations}
              </div>
              <p className="text-xs text-muted-foreground">
                Total calculator uses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Calculations to leads
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Calculator Page</CardTitle>
              <CardDescription>
                Share this link with your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://${broker.subdomain}.loanoptionscalculator.com`}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://${broker.subdomain}.loanoptionscalculator.com`
                    );
                  }}
                >
                  Copy
                </Button>
              </div>
              <Link href={`/${broker.subdomain}`} target="_blank">
                <Button variant="outline" className="w-full mt-4">
                  View Calculator Page
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/leads">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View All Leads
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize Branding
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              Latest inquiries from your calculators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {broker.leads.length > 0 ? (
              <div className="space-y-4">
                {broker.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{lead.name || lead.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {lead.calculatorType} • $
                        {lead.loanAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/leads`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
                <Link href="/dashboard/leads">
                  <Button variant="outline" className="w-full">
                    View All Leads
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
                <p className="text-muted-foreground mb-4">
                  Share your calculator page to start receiving leads
                </p>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://${broker.subdomain}.loanoptionscalculator.com`
                    );
                  }}
                >
                  Copy Calculator Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
