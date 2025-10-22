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
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { ArrowLeft } from "lucide-react";

export default async function LeadsPage() {
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
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!broker) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Leads</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>
              {broker.leads.length} total leads captured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsTable initialLeads={broker.leads} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
