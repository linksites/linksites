import { useEffect, useState } from "react";

const VISITOR_COUNTER_API_BASE = "https://countapi.mileshilliard.com/api/v1";
const VISITOR_COUNTER_KEY = "linksites-home-unique-browsers";
const VISITOR_COUNTER_STORAGE_KEY = "linksites-home-unique-browser-v1";

export function useVisitCount(numberLocale, offlineLabel, loadingLabel) {
  const [visitCount, setVisitCount] = useState(loadingLabel);

  useEffect(() => {
    let active = true;
    let shouldIncrement = false;

    try {
      shouldIncrement = window.localStorage.getItem(VISITOR_COUNTER_STORAGE_KEY) !== "1";
    } catch {
      shouldIncrement = true;
    }

    async function requestCounter(mode) {
      const response = await fetch(`${VISITOR_COUNTER_API_BASE}/${mode}/${VISITOR_COUNTER_KEY}`);

      if (!response.ok && response.status === 404 && mode === "get") {
        return requestCounter("hit");
      }

      if (!response.ok) {
        throw new Error("counter_unavailable");
      }

      return response.json();
    }

    async function loadCounter() {
      try {
        const data = await requestCounter(shouldIncrement ? "hit" : "get");
        const value = Number(data.value);

        if (!Number.isFinite(value)) {
          throw new Error("invalid_counter_value");
        }

        if (shouldIncrement) {
          try {
            window.localStorage.setItem(VISITOR_COUNTER_STORAGE_KEY, "1");
          } catch {
            // Ignore storage issues and still show the fetched number.
          }
        }

        if (active) {
          setVisitCount(value.toLocaleString(numberLocale));
        }
      } catch {
        if (active) {
          setVisitCount(offlineLabel);
        }
      }
    }

    loadCounter();

    return () => {
      active = false;
    };
  }, [numberLocale, offlineLabel]);

  return visitCount;
}
