import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Loan Options Calculator
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your business. All plans include
              a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-4xl font-bold mt-4">
                  $49
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>
                      3 calculators (SBA 7a, Equipment, Working Capital)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>
                      Custom subdomain (yourcompany.loanoptionscalculator.com)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Lead capture with email notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Basic branding (logo + colors)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>14-day free trial</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <CardDescription>For growing brokerages</CardDescription>
                <div className="text-4xl font-bold mt-4">
                  $59
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>9 calculators (most popular types)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Analytics dashboard with charts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Lead notifications via email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Lead status management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Priority email support</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>For established businesses</CardDescription>
                <div className="text-4xl font-bold mt-4">
                  $69
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>All 18 calculators (every loan type)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Advanced analytics & conversion tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Custom branding (colors, logo, fonts)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>CSV export for leads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                Unlimited calculations
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                Unlimited leads
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                99.9% uptime
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                Mobile responsive
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
