import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    const { subdomain } = await params;

    const broker = await prisma.broker.findUnique({
      where: { subdomain },
      select: {
        id: true,
        companyName: true,
        contactName: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        enabledCalculators: true,
        subscriptionStatus: true,
      },
    });

    if (!broker) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }

    // Check if subscription is active
    if (
      broker.subscriptionStatus !== "ACTIVE" &&
      broker.subscriptionStatus !== "TRIALING"
    ) {
      return NextResponse.json(
        { error: "Subscription inactive" },
        { status: 403 }
      );
    }

    return NextResponse.json({ broker });
  } catch (error) {
    console.error("Broker fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch broker" },
      { status: 500 }
    );
  }
}
