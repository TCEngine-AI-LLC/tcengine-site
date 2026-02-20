export type ConsultingPlanId = "TEN_HOURS" | "FORTY_HOURS" | "ONE_DOLLAR_TEST";

export type ConsultingPlan = {
  id: ConsultingPlanId;
  stripePriceEnv: string;
};

export const CONSULTING_PLANS: Record<ConsultingPlanId, ConsultingPlan> = {
  TEN_HOURS: {
    id: "TEN_HOURS",
    stripePriceEnv: "STRIPE_PRICE_ID_CONSULTING_10H",
  },
  FORTY_HOURS: {
    id: "FORTY_HOURS",
    stripePriceEnv: "STRIPE_PRICE_ID_CONSULTING_40H",
  },
  ONE_DOLLAR_TEST: {
    id: "ONE_DOLLAR_TEST",
    // Not used by the public checkout route (we keep public route restricted),
    // but keeping this here avoids “magic strings” scattered around the codebase.
    stripePriceEnv: "STRIPE_PRICE_ID_ONE_DOLLAR_TEST",
  },
};
