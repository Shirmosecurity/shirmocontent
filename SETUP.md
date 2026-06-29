# Aura AI — Setup & Deployment

## Step 1: Install
```bash
npm install
cp .env.example .env
```

## Step 2: Fill in .env
- NEXTAUTH_SECRET: run `openssl rand -base64 32` (or PowerShell: `[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`)
- ANTHROPIC_API_KEY: console.anthropic.com
- DATABASE_URL: get free Postgres from neon.tech
- Leave Stripe blank for now

## Step 3: Set up database
```bash
npx prisma generate
npx prisma db push
```

## Step 4: Run locally
```bash
npm run dev
```
Visit http://localhost:3000

## Step 5: Push to GitHub
```bash
git init
git add .
git commit -m "Aura AI v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aura-ai.git
git push -u origin main
```

## Step 6: Deploy on Render.com
1. render.com → New → Web Service
2. Connect your GitHub repo
3. Add environment variables (copy from your .env)
4. Set NEXTAUTH_URL = https://your-app.onrender.com
5. Set NEXT_PUBLIC_APP_URL = https://your-app.onrender.com
6. Deploy

## Step 7: Add Stripe (when ready)
1. Create 3 products in Stripe: $97, $197, $497/mo
2. Copy price IDs into Render env vars
3. Add webhook: https://your-app.onrender.com/api/stripe/webhook
4. Copy webhook secret into STRIPE_WEBHOOK_SECRET
