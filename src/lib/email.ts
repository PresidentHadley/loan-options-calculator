// src/lib/email.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from:
        process.env.FROM_EMAIL ||
        "Loan Calculator <notifications@loanoptionscalculator.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

export function generateLeadNotificationEmail(lead: {
  name?: string | null;
  email: string;
  phone?: string | null;
  businessName?: string | null;
  message?: string | null;
  calculatorType: string;
  loanAmount: number;
  loanTerm: number;
  monthlyPayment: number;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1e3a8a; }
          .value { margin-top: 5px; }
          .cta { 
            display: inline-block; 
            background: #10b981; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎉 New Lead from ${lead.calculatorType
              .toUpperCase()
              .replace(/-/g, " ")} Calculator</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${lead.name || "Not provided"}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${lead.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${lead.phone || "Not provided"}</div>
            </div>
            <div class="field">
              <div class="label">Business Name:</div>
              <div class="value">${lead.businessName || "Not provided"}</div>
            </div>
            ${
              lead.message
                ? `
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${lead.message}</div>
            </div>
            `
                : ""
            }
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <div class="field">
              <div class="label">Loan Amount:</div>
              <div class="value">$${lead.loanAmount.toLocaleString()}</div>
            </div>
            <div class="field">
              <div class="label">Loan Term:</div>
              <div class="value">${lead.loanTerm} months</div>
            </div>
            <div class="field">
              <div class="label">Estimated Monthly Payment:</div>
              <div class="value">$${lead.monthlyPayment
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
            </div>
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL
            }/dashboard/leads" class="cta">View in Dashboard</a>
          </div>
        </div>
      </body>
    </html>
  `;
}
