import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10', typescript: true })
export const PLANS = {
  free:    { name: 'Free',    price: 0,   priceId: null,                                  credits: 5,  workspaces: 1,  agents: 0 },
  starter: { name: 'Starter', price: 97,  priceId: process.env.STRIPE_STARTER_PRICE_ID,  credits: 50, workspaces: 1,  agents: 2 },
  growth:  { name: 'Growth',  price: 197, priceId: process.env.STRIPE_GROWTH_PRICE_ID,   credits: -1, workspaces: 3,  agents: 4 },
  agency:  { name: 'Agency',  price: 497, priceId: process.env.STRIPE_AGENCY_PRICE_ID,   credits: -1, workspaces: 25, agents: 7 },
}
