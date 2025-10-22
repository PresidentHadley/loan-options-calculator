// Enable all calculators for a broker account
// Usage: npx tsx scripts/enable-all-calculators.ts your-email@example.com

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALL_CALCULATORS = [
  'sba-7a',
  'sba-504',
  'equipment',
  'working-capital',
  'franchise',
  'business-acquisition',
  'commercial-property',
  'multi-family',
  'office-retail',
  'line-of-credit',
  'invoice-financing',
  'merchant-cash-advance',
  'construction-loan',
  'bridge-loan',
  'land-loan',
  'term-loan',
  'asset-based',
  'inventory-financing',
];

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: npx tsx scripts/enable-all-calculators.ts your-email@example.com');
    process.exit(1);
  }

  try {
    const broker = await prisma.broker.update({
      where: { email },
      data: {
        enabledCalculators: ALL_CALCULATORS,
        planTier: 'ENTERPRISE',
        subscriptionStatus: 'ACTIVE',
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
    });

    console.log('✅ Success! Enabled all 18 calculators for:');
    console.log(`   Company: ${broker.companyName}`);
    console.log(`   Email: ${broker.email}`);
    console.log(`   Subdomain: ${broker.subdomain}.loanoptionscalculator.com`);
    console.log(`   Plan: ${broker.planTier}`);
    console.log(`   Status: ${broker.subscriptionStatus}`);
    console.log(`\n🎉 You can now access all calculators at:`);
    console.log(`   https://${broker.subdomain}.loanoptionscalculator.com\n`);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`❌ No broker found with email: ${email}`);
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

