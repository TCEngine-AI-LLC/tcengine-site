export type ConsultingPlanId = "TEN_HOURS" | "FORTY_HOURS";

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
};
