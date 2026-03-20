export function formatPlanPrice(amountBrl, locale, exchangeRate) {
  if (!Number.isFinite(amountBrl)) {
    return null;
  }

  if (locale === "en") {
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      return null;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: amountBrl === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amountBrl * exchangeRate);
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: amountBrl === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountBrl);
}
