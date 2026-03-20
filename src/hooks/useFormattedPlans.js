import { formatPlanPrice } from "../lib/plan-pricing";

export function useFormattedPlans(plans, locale, exchangeRate) {
  return {
    ...plans,
    items: plans.items.map((plan) => {
      let price = formatPlanPrice(plan.amountBrl, locale, exchangeRate);

      if (!price && locale === "en" && plan.amountBrl === 0) {
        price = "$0";
      }

      return {
        ...plan,
        price: price ?? plans.priceLoading,
      };
    }),
  };
}
