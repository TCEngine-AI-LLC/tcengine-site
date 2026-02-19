import Stripe from "stripe";

import { mustEnv } from "@/src/server/env";

let cachedStripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (cachedStripe) return cachedStripe;

  cachedStripe = new Stripe(mustEnv("STRIPE_SECRET_KEY"));
  return cachedStripe;
}
