import { useEffect, useState } from "react";
import {
  createRepoUpdateMap,
  fetchLiveRepoUpdates,
  fetchSnapshotRepoUpdates,
} from "../lib/repo-updates";

export function useRepoUpdates() {
  const [repoUpdateDates, setRepoUpdateDates] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const repoUpdatesUrl = `${import.meta.env.BASE_URL}repo-updates.json`;

    async function loadRepoUpdates() {
      try {
        const liveUpdates = await fetchLiveRepoUpdates(controller.signal);

        if (active) {
          setRepoUpdateDates(liveUpdates);
        }

        return;
      } catch (liveError) {
        if (!active || liveError.name === "AbortError") {
          return;
        }
      }

      try {
        const snapshotUpdates = await fetchSnapshotRepoUpdates(repoUpdatesUrl, controller.signal);

        if (active) {
          setRepoUpdateDates(snapshotUpdates);
        }
      } catch (snapshotError) {
        if (!active || snapshotError.name === "AbortError") {
          return;
        }

        setRepoUpdateDates(createRepoUpdateMap());
      }
    }

    loadRepoUpdates();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return repoUpdateDates;
}
