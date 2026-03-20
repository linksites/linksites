import { useEffect, useState } from "react";

const EXCHANGE_RATE_STORAGE_KEY = "linksites-brl-usd-rate-v1";

function readCachedExchangeRate() {
  try {
    const rawValue = window.localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    const rate = Number(parsedValue?.rate);

    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

async function fetchBrlToUsdRate(signal) {
  const response = await fetch("https://api.frankfurter.dev/v1/latest?base=BRL&symbols=USD", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("exchange_rate_unavailable");
  }

  const payload = await response.json();
  const rate = Number(payload?.rates?.USD);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("invalid_exchange_rate");
  }

  return {
    rate,
    date: payload?.date ?? null,
  };
}

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState(() => readCachedExchangeRate());

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadExchangeRate() {
      try {
        const freshExchangeRate = await fetchBrlToUsdRate(controller.signal);

        if (active) {
          setExchangeRate(freshExchangeRate.rate);
        }

        try {
          window.localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, JSON.stringify(freshExchangeRate));
        } catch {
          // Ignore storage issues and keep the fresh rate in memory.
        }
      } catch (error) {
        if (!active || error.name === "AbortError") {
          return;
        }
      }
    }

    loadExchangeRate();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return exchangeRate;
}
