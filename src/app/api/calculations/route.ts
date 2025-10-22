import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      brokerId,
      calculatorType,
      loanAmount,
      loanTerm,
      interestRate,
      downPayment,
      monthlyPayment,
      totalInterest,
      totalCost,
      sessionId,
    } = body;

    // Create calculation record
    const calculation = await prisma.calculation.create({
      data: {
        brokerId,
        calculatorType,
        loanAmount: parseFloat(loanAmount),
        loanTerm: parseInt(loanTerm),
        interestRate: parseFloat(interestRate),
        downPayment: downPayment ? parseFloat(downPayment) : 0,
        monthlyPayment: parseFloat(monthlyPayment),
        totalInterest: parseFloat(totalInterest),
        totalCost: parseFloat(totalCost),
        sessionId,
        ipAddress:
          req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        userAgent: req.headers.get("user-agent"),
      },
    });

    // Update broker calculation count
    if (brokerId) {
      await prisma.broker.update({
        where: { id: brokerId },
        data: { calculationCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      calculation: { id: calculation.id },
    });
  } catch (error) {
    console.error("Calculation tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track calculation" },
      { status: 500 }
    );
  }
}
