import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, generateLeadNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      brokerId,
      name,
      email,
      phone,
      businessName,
      message,
      calculatorType,
      loanAmount,
      loanTerm,
      interestRate,
      downPayment,
      monthlyPayment,
      totalInterest,
      totalCost,
    } = body;

    // Validate required fields
    if (!brokerId || !email || !calculatorType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate leads (same email within 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingLead = await prisma.lead.findFirst({
      where: {
        brokerId,
        email,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    if (existingLead) {
      return NextResponse.json(
        {
          error:
            "You've already submitted a request recently. We'll be in touch soon!",
        },
        { status: 400 }
      );
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        brokerId,
        name,
        email,
        phone,
        businessName,
        message,
        calculatorType,
        loanAmount: parseFloat(loanAmount),
        loanTerm: parseInt(loanTerm),
        interestRate: interestRate ? parseFloat(interestRate) : null,
        downPayment: downPayment ? parseFloat(downPayment) : 0,
        monthlyPayment: parseFloat(monthlyPayment),
        totalInterest: parseFloat(totalInterest),
        totalCost: parseFloat(totalCost),
        ipAddress:
          req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        userAgent: req.headers.get("user-agent"),
        referrer: req.headers.get("referer"),
      },
      include: {
        broker: true,
      },
    });

    // Update broker lead count
    await prisma.broker.update({
      where: { id: brokerId },
      data: { leadCount: { increment: 1 } },
    });

    // Send email notification to broker (if enabled)
    if (lead.broker.emailNotifications) {
      try {
        await sendEmail({
          to: lead.broker.email,
          subject: `New Lead: ${name || email}`,
          html: generateLeadNotificationEmail({
            name,
            email,
            phone,
            businessName,
            message,
            calculatorType,
            loanAmount: parseFloat(loanAmount),
            loanTerm: parseInt(loanTerm),
            monthlyPayment: parseFloat(monthlyPayment),
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true, lead: { id: lead.id } });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brokerId = searchParams.get("brokerId");

    if (!brokerId) {
      return NextResponse.json(
        { error: "Broker ID required" },
        { status: 400 }
      );
    }

    const leads = await prisma.lead.findMany({
      where: { brokerId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
