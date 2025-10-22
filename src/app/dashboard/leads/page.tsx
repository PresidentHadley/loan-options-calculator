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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-800",
      CONTACTED: "bg-yellow-100 text-yellow-800",
      QUALIFIED: "bg-purple-100 text-purple-800",
      CLOSED_WON: "bg-green-100 text-green-800",
      CLOSED_LOST: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Leads</h1>
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
            {broker.leads.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Calculator</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {broker.leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{lead.name || "N/A"}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone || "N/A"}</TableCell>
                      <TableCell>
                        <span className="text-sm capitalize">
                          {lead.calculatorType.replace(/-/g, " ")}
                        </span>
                      </TableCell>
                      <TableCell>${lead.loanAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No leads yet. Share your calculator page to start receiving
                leads.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
