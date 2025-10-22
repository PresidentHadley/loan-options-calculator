-- ============================================
-- Loan Options Calculator - Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE ENUMS
-- ============================================

CREATE TYPE "PlanTier" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');

CREATE TYPE "SubscriptionStatus" AS ENUM (
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'INCOMPLETE',
  'PAUSED'
);

CREATE TYPE "LeadStatus" AS ENUM (
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'CLOSED_WON',
  'CLOSED_LOST',
  'NURTURING'
);

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Broker Table
CREATE TABLE "Broker" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT,
    "subdomain" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#1e3a8a',
    "secondaryColor" TEXT NOT NULL DEFAULT '#10b981',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "planTier" "PlanTier" NOT NULL DEFAULT 'STARTER',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionEndsAt" TIMESTAMP(3),
    "enabledCalculators" TEXT[] DEFAULT ARRAY['sba-7a', 'equipment', 'working-capital']::TEXT[],
    "customDomain" TEXT,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "leadCount" INTEGER NOT NULL DEFAULT 0,
    "calculationCount" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Broker_pkey" PRIMARY KEY ("id")
);

-- Lead Table
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "businessName" TEXT,
    "message" TEXT,
    "calculatorType" TEXT NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "loanTerm" INTEGER NOT NULL,
    "interestRate" DOUBLE PRECISION,
    "downPayment" DOUBLE PRECISION DEFAULT 0,
    "monthlyPayment" DOUBLE PRECISION NOT NULL,
    "totalInterest" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "referrer" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "contacted" BOOLEAN NOT NULL DEFAULT false,
    "contactedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- Calculation Table
CREATE TABLE "Calculation" (
    "id" TEXT NOT NULL,
    "brokerId" TEXT,
    "calculatorType" TEXT NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "loanTerm" INTEGER NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "downPayment" DOUBLE PRECISION DEFAULT 0,
    "monthlyPayment" DOUBLE PRECISION NOT NULL,
    "totalInterest" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "convertedToLead" BOOLEAN NOT NULL DEFAULT false,
    "leadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calculation_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- 3. CREATE UNIQUE CONSTRAINTS
-- ============================================

ALTER TABLE "Broker" ADD CONSTRAINT "Broker_authUserId_key" UNIQUE ("authUserId");
ALTER TABLE "Broker" ADD CONSTRAINT "Broker_email_key" UNIQUE ("email");
ALTER TABLE "Broker" ADD CONSTRAINT "Broker_subdomain_key" UNIQUE ("subdomain");
ALTER TABLE "Broker" ADD CONSTRAINT "Broker_stripeCustomerId_key" UNIQUE ("stripeCustomerId");
ALTER TABLE "Broker" ADD CONSTRAINT "Broker_stripeSubscriptionId_key" UNIQUE ("stripeSubscriptionId");

-- ============================================
-- 4. CREATE INDEXES
-- ============================================

-- Broker indexes
CREATE INDEX "Broker_authUserId_idx" ON "Broker"("authUserId");
CREATE INDEX "Broker_subdomain_idx" ON "Broker"("subdomain");
CREATE INDEX "Broker_email_idx" ON "Broker"("email");

-- Lead indexes
CREATE INDEX "Lead_brokerId_createdAt_idx" ON "Lead"("brokerId", "createdAt" DESC);
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt" DESC);

-- Calculation indexes
CREATE INDEX "Calculation_brokerId_createdAt_idx" ON "Calculation"("brokerId", "createdAt" DESC);
CREATE INDEX "Calculation_calculatorType_idx" ON "Calculation"("calculatorType");
CREATE INDEX "Calculation_createdAt_idx" ON "Calculation"("createdAt" DESC);

-- ============================================
-- 5. CREATE FOREIGN KEYS
-- ============================================

ALTER TABLE "Lead" ADD CONSTRAINT "Lead_brokerId_fkey" 
    FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Calculation" ADD CONSTRAINT "Calculation_brokerId_fkey" 
    FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE "Broker" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Calculation" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. CREATE RLS POLICIES
-- ============================================

-- ============================================
-- Broker Policies
-- ============================================

-- Brokers can view their own data
CREATE POLICY "Brokers can view own data"
ON "Broker" FOR SELECT
TO authenticated
USING (auth.uid()::text = "authUserId");

-- Brokers can update their own data
CREATE POLICY "Brokers can update own data"
ON "Broker" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "authUserId");

-- Allow creation during signup (service role)
CREATE POLICY "Service role can create brokers"
ON "Broker" FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================
-- Lead Policies
-- ============================================

-- Brokers can view their own leads
CREATE POLICY "Brokers can view own leads"
ON "Lead" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Broker"
    WHERE "Broker"."id" = "Lead"."brokerId"
    AND "Broker"."authUserId" = auth.uid()::text
  )
);

-- Brokers can update their own leads
CREATE POLICY "Brokers can update own leads"
ON "Lead" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Broker"
    WHERE "Broker"."id" = "Lead"."brokerId"
    AND "Broker"."authUserId" = auth.uid()::text
  )
);

-- Brokers can delete their own leads
CREATE POLICY "Brokers can delete own leads"
ON "Lead" FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Broker"
    WHERE "Broker"."id" = "Lead"."brokerId"
    AND "Broker"."authUserId" = auth.uid()::text
  )
);

-- Anyone (anonymous users) can create leads
CREATE POLICY "Anyone can create leads"
ON "Lead" FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- Calculation Policies
-- ============================================

-- Brokers can view their own calculations
CREATE POLICY "Brokers can view own calculations"
ON "Calculation" FOR SELECT
TO authenticated
USING (
  "brokerId" IS NULL OR
  EXISTS (
    SELECT 1 FROM "Broker"
    WHERE "Broker"."id" = "Calculation"."brokerId"
    AND "Broker"."authUserId" = auth.uid()::text
  )
);

-- Anyone can create calculations (anonymous tracking)
CREATE POLICY "Anyone can create calculations"
ON "Calculation" FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- 8. CREATE TRIGGER FOR UPDATED_AT
-- ============================================

-- Function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to Broker table
CREATE TRIGGER update_broker_updated_at BEFORE UPDATE ON "Broker"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to Lead table
CREATE TRIGGER update_lead_updated_at BEFORE UPDATE ON "Lead"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================

-- Verify tables were created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('Broker', 'Lead', 'Calculation')
ORDER BY table_name;

