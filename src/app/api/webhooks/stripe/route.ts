import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await prisma.broker.update({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status.toUpperCase() as any,
            subscriptionEndsAt: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await prisma.broker.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: "CANCELED",
            subscriptionEndsAt: new Date(),
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        await prisma.broker.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: "PAST_DUE",
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        await prisma.broker.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: "ACTIVE",
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
