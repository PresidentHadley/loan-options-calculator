// Clear all broker data and start fresh
// Usage: npm run admin:clear-all

import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config();

const prisma = new PrismaClient();

// Initialize Supabase Admin client (can delete auth users)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("🚨 WARNING: This will delete ALL broker data!");
  console.log("   - All brokers");
  console.log("   - All leads");
  console.log("   - All calculations");
  console.log("   - All Supabase auth users");
  console.log("");

  try {
    // Step 1: Delete all calculations (must delete child records first)
    const deletedCalculations = await prisma.calculation.deleteMany({});
    console.log(`✅ Deleted ${deletedCalculations.count} calculations`);

    // Step 2: Delete all leads
    const deletedLeads = await prisma.lead.deleteMany({});
    console.log(`✅ Deleted ${deletedLeads.count} leads`);

    // Step 3: Get all brokers before deleting (to delete auth users)
    const brokers = await prisma.broker.findMany({
      select: { authUserId: true, email: true },
    });

    // Step 4: Delete all brokers
    const deletedBrokers = await prisma.broker.deleteMany({});
    console.log(`✅ Deleted ${deletedBrokers.count} brokers`);

    // Step 5: Delete Supabase auth users
    if (supabaseServiceKey) {
      for (const broker of brokers) {
        try {
          const { error } = await supabaseAdmin.auth.admin.deleteUser(
            broker.authUserId
          );
          if (error) {
            console.log(
              `⚠️  Could not delete auth user ${broker.email}: ${error.message}`
            );
          } else {
            console.log(`✅ Deleted auth user: ${broker.email}`);
          }
        } catch (error: any) {
          console.log(`⚠️  Error deleting ${broker.email}: ${error.message}`);
        }
      }
    } else {
      console.log(
        "⚠️  SUPABASE_SERVICE_ROLE_KEY not found - could not delete auth users"
      );
      console.log("   You'll need to delete them manually in Supabase Dashboard");
    }

    console.log("");
    console.log("🎉 All data cleared! You can now start fresh.");
    console.log("👉 Go to: https://www.loanoptionscalculator.com/signup");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

