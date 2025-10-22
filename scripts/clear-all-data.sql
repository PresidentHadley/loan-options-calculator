-- ============================================
-- Clear All Broker Data (Fresh Start)
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/kslbolpsybdasnizeqmz/sql/new
-- ============================================

-- Step 1: Delete all calculations (child records first)
DELETE FROM "Calculation";

-- Step 2: Delete all leads (child records)
DELETE FROM "Lead";

-- Step 3: Delete all brokers
DELETE FROM "Broker";

-- Step 4: Show results
SELECT 
  (SELECT COUNT(*) FROM "Broker") as brokers,
  (SELECT COUNT(*) FROM "Lead") as leads,
  (SELECT COUNT(*) FROM "Calculation") as calculations;

-- Expected output: brokers=0, leads=0, calculations=0

-- ============================================
-- IMPORTANT: This does NOT delete Supabase auth users
-- You must manually delete them in:
-- Supabase Dashboard → Authentication → Users
-- ============================================

