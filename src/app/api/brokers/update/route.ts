import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contactPhone, primaryColor, secondaryColor } = body;

    // Validate colors
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (primaryColor && !hexColorRegex.test(primaryColor)) {
      return NextResponse.json(
        { error: "Invalid primary color format" },
        { status: 400 }
      );
    }
    if (secondaryColor && !hexColorRegex.test(secondaryColor)) {
      return NextResponse.json(
        { error: "Invalid secondary color format" },
        { status: 400 }
      );
    }

    const broker = await prisma.broker.update({
      where: { authUserId: user.id },
      data: {
        contactPhone: contactPhone || null,
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, broker });
  } catch (error) {
    console.error("Broker update error:", error);
    return NextResponse.json(
      { error: "Failed to update broker" },
      { status: 500 }
    );
  }
}

