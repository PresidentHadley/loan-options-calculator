"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

interface Broker {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  contactPhone: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  subdomain: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  planTier: string;
  subscriptionStatus: string;
  trialEndsAt: Date | null;
  enabledCalculators: string[];
}

interface SettingsFormProps {
  initialBroker: Broker;
}

export function SettingsForm({ initialBroker }: SettingsFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactPhone: initialBroker.contactPhone || "",
    websiteUrl: initialBroker.websiteUrl || "",
    linkedinUrl: initialBroker.linkedinUrl || "",
    primaryColor: initialBroker.primaryColor,
    secondaryColor: initialBroker.secondaryColor,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brokers/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactPhone: formData.contactPhone || null,
          websiteUrl: formData.websiteUrl || null,
          linkedinUrl: formData.linkedinUrl || null,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({
        title: "Success!",
        description: "Settings updated successfully",
      });

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <Input value={initialBroker.companyName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input value={initialBroker.contactName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={initialBroker.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Displayed on your calculator pages for client contact
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.websiteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Link to your company website
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Your LinkedIn profile or company page
              </p>
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
                value={initialBroker.subdomain}
                readOnly
                className="rounded-r-none"
              />
              <span className="inline-flex items-center px-3 h-9 text-sm bg-muted border border-l-0 rounded-r-md">
                .loanoptionscalculator.com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  className="w-16 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  placeholder="#1e3a8a"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Main brand color for headers and buttons
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secondaryColor: e.target.value,
                    })
                  }
                  className="w-16 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secondaryColor: e.target.value,
                    })
                  }
                  placeholder="#10b981"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Accent color for CTAs and highlights
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
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
              <Input value={initialBroker.planTier} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Input value={initialBroker.subscriptionStatus} readOnly />
            </div>
          </div>
          {initialBroker.trialEndsAt && (
            <div className="space-y-2">
              <Label>Trial Ends</Label>
              <Input
                value={new Date(initialBroker.trialEndsAt).toLocaleDateString()}
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
            {initialBroker.enabledCalculators.map((calc) => (
              <div key={calc} className="flex items-center p-2 border rounded">
                <span className="capitalize">{calc.replace(/-/g, " ")}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

