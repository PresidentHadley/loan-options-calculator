"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Phone, MessageSquare, Globe, Linkedin } from "lucide-react";

interface ContactBrokerButtonProps {
  contactName: string;
  email: string;
  phone?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  companyName: string;
  primaryColor?: string;
}

export function ContactBrokerButton({
  contactName,
  email,
  phone,
  websiteUrl,
  linkedinUrl,
  companyName,
  primaryColor = "#1e3a8a",
}: ContactBrokerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          style={{ backgroundColor: primaryColor }}
          className="text-white hover:opacity-90"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact {contactName.split(" ")[0]}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {contactName}</DialogTitle>
          <DialogDescription>
            Get in touch with {companyName} for questions about your loan
            options
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </a>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            </a>
          )}

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Website</p>
                <p className="text-sm text-muted-foreground break-all">
                  {websiteUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
            </a>
          )}

          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Linkedin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm text-muted-foreground">View profile</p>
              </div>
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

