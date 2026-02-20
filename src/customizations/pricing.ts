// Existing...
export type ConsultingPlanId = "TEN_HOURS" | "FORTY_HOURS";

// Add this near the bottom:
export const ADMIN_TEST_PRICE_ENV = "STRIPE_PRICE_ID_TEST_1DOLLAR" as const;

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
  }
};
