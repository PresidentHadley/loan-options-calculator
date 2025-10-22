# 🚀 Loan Options Calculator - Production Setup Guide

## Overview
Complete this checklist to get your SaaS platform live in production.

---

## ✅ Step 1: Set Up Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Choose organization (or create one)
4. Project details:
   - **Name**: `loan-options-calculator-prod`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine to start
5. Wait ~2 minutes for project to be created

### 1.2 Get Database Credentials
1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Copy the **URI** connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`)
4. **Save these for Vercel environment variables:**
   - `DATABASE_URL` = Connection string with password filled in
   - `DIRECT_URL` = Same as DATABASE_URL

### 1.3 Get API Keys
1. Go to **Settings** → **API**
2. **Save these for Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL (e.g., `https://xxxxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon` `public` key
   - `SUPABASE_SERVICE_ROLE_KEY` = `service_role` `secret` key (⚠️ Keep this secret!)

### 1.4 Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Click **"New bucket"**
3. Bucket details:
   - **Name**: `broker-assets`
   - **Public bucket**: ✅ Yes (checked)
   - **Allowed MIME types**: Leave empty (allow all)
4. Click **"Create bucket"**

### 1.5 Set Up Authentication
1. Go to **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**:
   - Development: `https://your-project.vercel.app`
   - Production: `https://loanoptionscalculator.com`
3. Add to **Redirect URLs**:
   ```
   https://your-project.vercel.app/**
   https://loanoptionscalculator.com/**
   https://*.loanoptionscalculator.com/**
   ```

---

## ✅ Step 2: Run Database Migrations

### 2.1 Install Dependencies Locally
```bash
cd /Users/patrickhadley/Desktop/loan-options-calculator
npm install
```

### 2.2 Create .env.local File
Create `.env.local` in the project root with Supabase credentials:

```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Auth & API
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# Stripe (get these in Step 3)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend Email (get this in Step 4)
RESEND_API_KEY="re_..."
FROM_EMAIL="notifications@loanoptionscalculator.com"

# App Config
NEXT_PUBLIC_APP_URL="https://your-project.vercel.app"
NEXT_PUBLIC_APP_NAME="Loan Options Calculator"
```

### 2.3 Push Database Schema
```bash
npm run db:push
```

This will create all tables in your Supabase database.

### 2.4 Set Up Row Level Security (RLS)

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Enable RLS on tables
ALTER TABLE "Broker" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Calculation" ENABLE ROW LEVEL SECURITY;

-- Brokers can only see their own data
CREATE POLICY "Brokers can view own data"
ON "Broker" FOR SELECT
TO authenticated
USING (auth.uid()::text = "authUserId");

CREATE POLICY "Brokers can update own data"
ON "Broker" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "authUserId");

-- Leads policies
CREATE POLICY "Brokers can view own leads"
ON "Lead" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Broker"
    WHERE "Broker".id = "Lead"."brokerId"
    AND "Broker"."authUserId" = auth.uid()::text
  )
);

CREATE POLICY "Brokers can update own leads"
ON "Lead" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Broker"
    WHERE "Broker".id = "Lead"."brokerId"
    AND "Broker"."authUserId" = auth.uid()::text
  )
);

-- Allow anonymous lead creation
CREATE POLICY "Anyone can create leads"
ON "Lead" FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Calculations policies
CREATE POLICY "Brokers can view own calculations"
ON "Calculation" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "Broker"
    WHERE "Broker".id = "Calculation"."brokerId"
    AND "Broker"."authUserId" = auth.uid()::text
  )
);

CREATE POLICY "Anyone can create calculations"
ON "Calculation" FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

---

## ✅ Step 3: Set Up Stripe

### 3.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up or log in
3. Switch to **Test Mode** (toggle in top right)

### 3.2 Get API Keys
1. Go to **Developers** → **API keys**
2. **Save these for Vercel:**
   - `STRIPE_SECRET_KEY` = Secret key (starts with `sk_test_...`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Publishable key (starts with `pk_test_...`)

### 3.3 Create Products & Prices
1. Go to **Products** → **Add product**

**Product 1: Starter**
- Name: `Starter Plan`
- Description: `3 calculators, custom subdomain, lead notifications`
- Pricing: `$49/month` (recurring)
- Copy the **Price ID** (starts with `price_...`)

**Product 2: Professional**
- Name: `Professional Plan`
- Description: `All 6 calculators, analytics, CSV export`
- Pricing: `$99/month` (recurring)
- Copy the **Price ID**

**Product 3: Enterprise**
- Name: `Enterprise Plan`
- Description: `Custom domain, white-label, dedicated support`
- Pricing: `$199/month` (recurring)
- Copy the **Price ID**

### 3.4 Set Up Webhook (After Vercel Deployment)
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-project.vercel.app/api/webhooks/stripe`
4. Listen to events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy **Signing secret** (starts with `whsec_...`)
6. **Save for Vercel:** `STRIPE_WEBHOOK_SECRET`

### 3.5 Add Price IDs to Environment
Add these to your Vercel environment variables:
```
STRIPE_PRICE_ID_STARTER=price_xxxxx
STRIPE_PRICE_ID_PROFESSIONAL=price_xxxxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx
```

---

## ✅ Step 4: Set Up Resend (Email)

### 4.1 Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up
3. Verify your email

### 4.2 Get API Key
1. Go to **API Keys**
2. Click **Create API Key**
3. Name: `Production`
4. Permission: `Full Access`
5. Copy the key (starts with `re_...`)
6. **Save for Vercel:** `RESEND_API_KEY`

### 4.3 Verify Domain (Optional but Recommended)
1. Go to **Domains**
2. Click **Add Domain**
3. Enter: `loanoptionscalculator.com`
4. Add the DNS records to your domain provider
5. Wait for verification

**For now, you can use:**
```
FROM_EMAIL="onboarding@resend.dev"
```

**After domain verification:**
```
FROM_EMAIL="notifications@loanoptionscalculator.com"
```

---

## ✅ Step 5: Configure Vercel Environment Variables

### 5.1 Go to Vercel Project Settings
1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**

### 5.2 Add All Variables

Copy and paste these, filling in the values from Steps 1-4:

```bash
# Supabase Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# Supabase Auth & API
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PROFESSIONAL=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Resend Email
RESEND_API_KEY=re_...
FROM_EMAIL=notifications@loanoptionscalculator.com

# App Config
NEXT_PUBLIC_APP_URL=https://loanoptionscalculator.com
NEXT_PUBLIC_APP_NAME=Loan Options Calculator
```

### 5.3 Apply to All Environments
Make sure to select:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## ✅ Step 6: Configure Custom Domain in Vercel

### 6.1 Add Domain
1. Go to **Settings** → **Domains**
2. Add domains:
   - `loanoptionscalculator.com`
   - `www.loanoptionscalculator.com`
   - `*.loanoptionscalculator.com` (wildcard for subdomains)

### 6.2 Update DNS Records
Add these records to your domain provider (e.g., Namecheap, GoDaddy, Cloudflare):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: *
Value: cname.vercel-dns.com
```

### 6.3 Wait for DNS Propagation
- Usually takes 5-30 minutes
- Vercel will show a checkmark when ready

---

## ✅ Step 7: Deploy & Test

### 7.1 Trigger Deployment
1. Go to **Deployments** in Vercel
2. Click **Redeploy** on the latest deployment
3. Wait for build to complete (~2-3 minutes)

### 7.2 Test Checklist

**Test Authentication:**
- [ ] Visit your site: `https://loanoptionscalculator.com`
- [ ] Click "Sign Up"
- [ ] Create a test broker account
- [ ] Check email for verification
- [ ] Log in to dashboard

**Test Calculator:**
- [ ] Note your subdomain (e.g., `testbroker.loanoptionscalculator.com`)
- [ ] Visit your calculator page
- [ ] Test SBA 7(a) calculator
- [ ] Submit a test lead
- [ ] Check if email notification arrives

**Test Dashboard:**
- [ ] View leads in dashboard
- [ ] Check settings page
- [ ] Verify branding displays correctly

**Test Database:**
- [ ] Go to Supabase dashboard
- [ ] Check **Table Editor** → **Broker** table
- [ ] Verify your test account exists

---

## 🎯 Optional: Production Checklist

Before launching to real customers:

### Security
- [ ] Review RLS policies in Supabase
- [ ] Enable 2FA on Supabase account
- [ ] Enable 2FA on Stripe account
- [ ] Enable 2FA on Vercel account
- [ ] Review Vercel security headers

### Stripe Live Mode
- [ ] Switch Stripe to Live Mode
- [ ] Recreate products in Live Mode
- [ ] Update environment variables with live keys
- [ ] Test a real subscription (then cancel)

### Monitoring
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (Sentry optional)
- [ ] Set up uptime monitoring (UptimeRobot or Pingdom)

### Legal
- [ ] Add Terms of Service page
- [ ] Add Privacy Policy page
- [ ] Add Cookie Policy (if using cookies)
- [ ] Add billing email to Stripe settings

### Email
- [ ] Verify custom domain in Resend
- [ ] Update FROM_EMAIL to use verified domain
- [ ] Test all email notifications
- [ ] Set up email forwarding for support@

---

## 📞 Support & Resources

**Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Vercel Docs](https://vercel.com/docs)

**Common Issues:**
- Database connection errors → Check DATABASE_URL is correct
- Auth not working → Verify SUPABASE URLs and keys
- Subdomain not working → Check wildcard DNS is configured
- Emails not sending → Verify RESEND_API_KEY

**Need Help?**
- Check the README.md for troubleshooting
- Review logs in Vercel dashboard
- Check Supabase logs for database errors

---

## ✨ You're Done!

Once all steps are complete, your SaaS platform will be:
- ✅ Live in production
- ✅ Accepting broker signups
- ✅ Processing payments via Stripe
- ✅ Sending email notifications
- ✅ Capturing leads from calculators

**Next steps after launch:**
- Monitor signups and leads
- Collect user feedback
- Iterate on features
- Scale as needed

Good luck! 🚀

