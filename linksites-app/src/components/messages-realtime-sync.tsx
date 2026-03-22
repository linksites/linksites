"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type MessagesRealtimeSyncProps = {
  profileId: string;
  roomIds: string[];
};

export function MessagesRealtimeSync({
  profileId,
  roomIds,
}: MessagesRealtimeSyncProps) {
  const router = useRouter();
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    if (!profileId) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const roomIdSet = new Set(roomIds);

    function refreshOnce() {
      const now = Date.now();

      if (now - lastRefreshAtRef.current < 500) {
        return;
      }

      lastRefreshAtRef.current = now;
      router.refresh();
    }

    const channel = supabase
      .channel(`messages-sync:${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_room_participants",
          filter: `profile_id=eq.${profileId}`,
        },
        () => {
          refreshOnce();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const roomId = typeof payload.new?.room_id === "string" ? payload.new.room_id : null;

          if (roomId && roomIdSet.has(roomId)) {
            refreshOnce();
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profileId, roomIds, router]);

  return null;
}

