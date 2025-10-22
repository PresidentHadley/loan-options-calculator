-- ============================================
-- Add Website and Social Links to Broker
-- Run this in Supabase SQL Editor
-- ============================================

ALTER TABLE "Broker" 
ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT,
ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;

