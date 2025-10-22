"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUp } from "../actions";
import { useToast } from "@/components/ui/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    contactName: "",
    subdomain: "",
  });

  const handleSubdomainChange = (value: string) => {
    // Only allow alphanumeric and hyphens, convert to lowercase
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, subdomain: cleaned });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(formData);
      toast({
        title: "Success",
        description:
          "Account created successfully! Check your email to verify your account.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Start your 14-day free trial today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  placeholder="John Smith"
                  required
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="ABC Lending"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="broker@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Choose Your Subdomain *</Label>
              <div className="flex items-center">
                <Input
                  id="subdomain"
                  placeholder="yourcompany"
                  required
                  pattern="[a-z0-9-]+"
                  value={formData.subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="rounded-r-none"
                />
                <span className="inline-flex items-center px-3 h-9 text-sm bg-muted border border-l-0 rounded-r-md text-muted-foreground">
                  .loanoptionscalculator.com
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                This will be your calculator page URL
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Start Free Trial"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
