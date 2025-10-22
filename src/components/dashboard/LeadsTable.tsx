"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, Building } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  businessName: string | null;
  message: string | null;
  calculatorType: string;
  loanAmount: number;
  loanTerm: number;
  monthlyPayment: number;
  status: string;
  createdAt: Date;
}

interface LeadsTableProps {
  initialLeads: Lead[];
}

export function LeadsTable({ initialLeads }: LeadsTableProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState(initialLeads);
  const [updating, setUpdating] = useState<string | null>(null);

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

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdating(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      toast({
        title: "Status updated",
        description: "Lead status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No leads yet. Share your calculator page to start receiving leads.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Contact Info</TableHead>
          <TableHead>Calculator</TableHead>
          <TableHead>Loan Details</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="whitespace-nowrap">
              {new Date(lead.createdAt).toLocaleDateString()}
              <div className="text-xs text-muted-foreground">
                {new Date(lead.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">{lead.name || "Anonymous"}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <a
                    href={`mailto:${lead.email}`}
                    className="hover:text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:text-primary hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </div>
                )}
                {lead.businessName && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building className="h-3 w-3" />
                    {lead.businessName}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm capitalize">
                {lead.calculatorType.replace(/-/g, " ")}
              </span>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">
                  ${lead.loanAmount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {lead.loanTerm} months
                </div>
                <div className="text-xs text-muted-foreground">
                  ${lead.monthlyPayment.toFixed(0)}/mo
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Select
                value={lead.status}
                onValueChange={(value) => handleStatusChange(lead.id, value)}
                disabled={updating === lead.id}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status.replace(/_/g, " ")}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">
                    <Badge className={getStatusColor("NEW")}>New</Badge>
                  </SelectItem>
                  <SelectItem value="CONTACTED">
                    <Badge className={getStatusColor("CONTACTED")}>
                      Contacted
                    </Badge>
                  </SelectItem>
                  <SelectItem value="QUALIFIED">
                    <Badge className={getStatusColor("QUALIFIED")}>
                      Qualified
                    </Badge>
                  </SelectItem>
                  <SelectItem value="CLOSED_WON">
                    <Badge className={getStatusColor("CLOSED_WON")}>
                      Closed Won
                    </Badge>
                  </SelectItem>
                  <SelectItem value="CLOSED_LOST">
                    <Badge className={getStatusColor("CLOSED_LOST")}>
                      Closed Lost
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

