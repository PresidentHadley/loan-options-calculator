import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const broker = await prisma.broker.findUnique({
    where: { authUserId: user.id },
  });

  if (!broker) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={broker.companyName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input value={broker.contactName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={broker.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={broker.contactPhone || "Not set"} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize your calculator page appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subdomain</Label>
                <div className="flex items-center">
                  <Input
                    value={broker.subdomain}
                    readOnly
                    className="rounded-r-none"
                  />
                  <span className="inline-flex items-center px-3 h-9 text-sm bg-muted border border-l-0 rounded-r-md">
                    .loanoptionscalculator.com
                  </span>
                </div>
              </div>

              {broker.logoUrl && (
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border rounded-lg p-4">
                    <Image
                      src={broker.logoUrl}
                      alt="Company Logo"
                      width={200}
                      height={60}
                      className="h-12 w-auto"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: broker.primaryColor }}
                    />
                    <Input value={broker.primaryColor} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: broker.secondaryColor }}
                    />
                    <Input value={broker.secondaryColor} readOnly />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Your current plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Input value={broker.planTier} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={broker.subscriptionStatus} readOnly />
                </div>
              </div>
              {broker.trialEndsAt && (
                <div className="space-y-2">
                  <Label>Trial Ends</Label>
                  <Input
                    value={new Date(broker.trialEndsAt).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enabled Calculators */}
          <Card>
            <CardHeader>
              <CardTitle>Enabled Calculators</CardTitle>
              <CardDescription>
                Calculators available on your page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {broker.enabledCalculators.map((calc) => (
                  <div
                    key={calc}
                    className="flex items-center p-2 border rounded"
                  >
                    <span className="capitalize">
                      {calc.replace(/-/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
