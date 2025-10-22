# Loan Options Calculator

## Multi-Tenant SaaS Platform for Business Loan Calculators

LoanOptionsCalculator.com is an embeddable business loan calculator platform designed for commercial lending brokers. Brokers get branded calculator pages that capture high-intent leads.

## Features

### For Brokers

- 🎨 **Custom Branding** - Your logo, colors, and subdomain
- 📊 **6 Calculator Types** - SBA 7(a), SBA 504, Equipment, Working Capital, Franchise, Business Acquisition
- 💼 **Lead Capture** - Integrated forms with email notifications
- 📈 **Analytics Dashboard** - Track usage, leads, and conversions
- 🔐 **Secure Auth** - Powered by Supabase
- 💳 **Subscription Billing** - Stripe integration with 14-day free trial

### For End Users

- 💰 **Accurate Calculations** - Monthly payments, total interest, amortization schedules
- 📱 **Mobile Responsive** - Works perfectly on any device
- 📊 **Visual Charts** - Interactive amortization charts
- ✉️ **Lead Forms** - Easy contact with brokers

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Email:** Resend
- **Charts:** Recharts
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd loan-options-calculator
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Auth & API
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend Email
RESEND_API_KEY="re_..."
FROM_EMAIL="notifications@loanoptionscalculator.com"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Loan Options Calculator"
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

1. Create a new Supabase project
2. Get your database connection strings from project settings
3. Get your API keys (anon key and service role key)
4. Create a storage bucket named `broker-assets` (public)

### Stripe Setup

1. Create a Stripe account
2. Get your API keys (test mode)
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Add webhook events: `customer.subscription.*`, `invoice.*`
5. Create pricing products and get price IDs

### Resend Setup

1. Create a Resend account
2. Get your API key
3. Verify your sending domain

## Project Structure

```
loan-options-calculator/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Broker dashboard
│   │   ├── [brokerId]/      # Tenant calculator pages
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Marketing homepage
│   ├── components/
│   │   ├── calculators/     # Calculator components
│   │   └── ui/              # Shadcn UI components
│   ├── lib/
│   │   ├── supabase/        # Supabase utilities
│   │   ├── calculations.ts  # Loan calculation logic
│   │   ├── email.ts         # Email service
│   │   └── stripe.ts        # Stripe integration
│   └── types/               # TypeScript types
├── prisma/
│   └── schema.prisma        # Database schema
├── public/
├── .env.local
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Configure domain: `loanoptionscalculator.com`
5. Enable wildcard: `*.loanoptionscalculator.com`
6. Deploy

### Post-Deployment

1. Update Stripe webhook URL to production
2. Update Supabase redirect URLs for auth
3. Update Resend sending domain
4. Test calculator flow end-to-end

## Usage

### For Brokers

1. **Sign Up** - Create account at `/signup`
2. **Customize** - Add your logo and colors in dashboard
3. **Share** - Send your calculator page URL to clients
4. **Manage Leads** - View and export leads from dashboard

### Calculator Page URLs

- Main hub: `https://[subdomain].loanoptionscalculator.com`
- SBA 7(a): `https://[subdomain].loanoptionscalculator.com/sba-7a`
- Equipment: `https://[subdomain].loanoptionscalculator.com/equipment`
- etc.

## API Routes

- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get broker's leads
- `POST /api/calculations` - Track calculator usage
- `GET /api/brokers/[subdomain]` - Get broker info
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Database Schema

- **Broker** - Broker accounts with subscription info
- **Lead** - Captured leads from calculators
- **Calculation** - Anonymous calculation tracking

## Security

- Row Level Security (RLS) in Supabase
- Server-side auth checks
- Secure Stripe webhooks
- Input validation with Zod
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, email support@loanoptionscalculator.com

## Roadmap

- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] Advanced analytics and reporting
- [ ] Embed code generation
- [ ] Custom domain support
- [ ] White-label options
- [ ] API access for enterprise
- [ ] Mobile app

---

Built with ❤️ for commercial lending brokers
