import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DirectConversation,
  DirectConversationOpenResult,
  DirectMessage,
  PublicDirectoryProfile,
} from "@/lib/types";

type ProfileRow = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  theme_slug: "midnight-grid" | "sunset-signal";
  created_at: string;
  followers_count?: number | null;
};

type MessageRow = {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type ParticipantRow = {
  room_id: string;
  profile_id: string;
  last_read_at: string | null;
};

type RoomRow = {
  id: string;
  created_at: string;
  updated_at: string;
  is_group_chat: boolean;
};

type OpenDirectConversationRow = {
  opened_room_id: string | null;
  reason: "not_friends" | "room_create_failed" | null;
};

function formatSupabaseError(error: unknown) {
  if (!error || typeof error !== "object") {
    return null;
  }

  const candidate = error as {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  };

  return JSON.stringify({
    code: candidate.code ?? null,
    message: candidate.message ?? null,
    details: candidate.details ?? null,
    hint: candidate.hint ?? null,
  });
}

async function hydrateProfiles(profileIds: string[]): Promise<Map<string, PublicDirectoryProfile>> {
  if (!hasSupabaseEnv()) {
    return new Map();
  }

  const ids = [...new Set(profileIds.filter(Boolean))];

  if (!ids.length) {
    return new Map();
  }

  const supabase = await createSupabaseServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, theme_slug, created_at, followers_count")
    .in("id", ids);
  const { data: links } = await supabase
    .from("links")
    .select("profile_id")
    .in("profile_id", ids)
    .eq("is_active", true);

  const linksCountByProfileId = new Map<string, number>();
  (links ?? []).forEach((link) => {
    linksCountByProfileId.set(link.profile_id, (linksCountByProfileId.get(link.profile_id) ?? 0) + 1);
  });

  return new Map(
    ((profiles ?? []) as ProfileRow[]).map((profile) => [
      profile.id,
      {
        id: profile.id,
        username: profile.username,
        displayName: profile.display_name,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        themeSlug: profile.theme_slug,
        createdAt: profile.created_at,
        activeLinksCount: linksCountByProfileId.get(profile.id) ?? 0,
        followersCount: profile.followers_count ?? 0,
        isFollowing: false,
        isFriend: true,
        friendshipStatus: "friends",
        discoveryReason: "following",
        discoveryScore: 0,
      },
    ]),
  );
}

export async function ensureDirectConversation({
  viewerProfileId,
  targetProfileId,
}: {
  viewerProfileId: string;
  targetProfileId: string;
}): Promise<DirectConversationOpenResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, reason: "room_create_failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("open_direct_conversation", {
    viewer_profile_id: viewerProfileId,
    target_profile_id: targetProfileId,
  });

  if (error) {
    const debugMessage = formatSupabaseError(error);
    console.error("Erro ao abrir conversa direta:", debugMessage ?? error);
    return { ok: false, reason: "room_create_failed", debugMessage: debugMessage ?? undefined };
  }

  const [result] = ((data ?? []) as OpenDirectConversationRow[]);

  if (!result?.opened_room_id) {
    return {
      ok: false,
      reason: result?.reason === "not_friends" ? "not_friends" : "room_create_failed",
    };
  }

  return { ok: true, roomId: result.opened_room_id };
}

export async function getInboxConversations({
  profileId,
}: {
  profileId: string;
}): Promise<DirectConversation[]> {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data: participantRows } = await supabase
    .from("chat_room_participants")
    .select("room_id, profile_id, last_read_at")
    .eq("profile_id", profileId);

  if (!participantRows?.length) {
    return [];
  }

  const roomIds = participantRows.map((row) => row.room_id);
  const lastReadByRoomId = new Map(
    (participantRows as ParticipantRow[]).map((row) => [row.room_id, row.last_read_at]),
  );
  const [{ data: roomRows }, { data: allParticipantRows }, { data: messageRows }] = await Promise.all([
    supabase.from("chat_rooms").select("id, created_at, updated_at, is_group_chat").in("id", roomIds),
    supabase.from("chat_room_participants").select("room_id, profile_id, last_read_at").in("room_id", roomIds),
    supabase
      .from("messages")
      .select("id, room_id, sender_id, content, created_at")
      .in("room_id", roomIds)
      .order("created_at", { ascending: false }),
  ]);

  const directRooms = ((roomRows ?? []) as RoomRow[]).filter((room) => !room.is_group_chat);

  if (!directRooms.length) {
    return [];
  }

  const otherParticipantIds = ((allParticipantRows ?? []) as ParticipantRow[])
    .filter((row) => row.profile_id !== profileId)
    .map((row) => row.profile_id);
  const profilesById = await hydrateProfiles(otherParticipantIds);
  const otherParticipantByRoomId = new Map<string, string>();

  ((allParticipantRows ?? []) as ParticipantRow[]).forEach((row) => {
    if (row.profile_id !== profileId && !otherParticipantByRoomId.has(row.room_id)) {
      otherParticipantByRoomId.set(row.room_id, row.profile_id);
    }
  });

  const latestMessageByRoomId = new Map<string, MessageRow>();
  const unreadCountByRoomId = new Map<string, number>();

  ((messageRows ?? []) as MessageRow[]).forEach((message) => {
    if (!latestMessageByRoomId.has(message.room_id)) {
      latestMessageByRoomId.set(message.room_id, message);
    }

    const lastReadAt = lastReadByRoomId.get(message.room_id);
    const isUnread = message.sender_id !== profileId && (!lastReadAt || message.created_at > lastReadAt);

    if (isUnread) {
      unreadCountByRoomId.set(message.room_id, (unreadCountByRoomId.get(message.room_id) ?? 0) + 1);
    }
  });

  return directRooms
    .map((room) => {
      const otherParticipantId = otherParticipantByRoomId.get(room.id);
      const lastMessage = latestMessageByRoomId.get(room.id) ?? null;

      return {
        id: room.id,
        createdAt: room.created_at,
        updatedAt: room.updated_at,
        otherParticipant: otherParticipantId ? profilesById.get(otherParticipantId) ?? null : null,
        lastMessagePreview: lastMessage?.content ?? null,
        lastMessageAt: lastMessage?.created_at ?? null,
        unreadCount: unreadCountByRoomId.get(room.id) ?? 0,
      };
    })
    .filter((conversation) => conversation.otherParticipant)
    .sort((left, right) =>
      (right.lastMessageAt ?? right.updatedAt).localeCompare(left.lastMessageAt ?? left.updatedAt),
    );
}

export async function getConversationThread({
  profileId,
  roomId,
}: {
  profileId: string;
  roomId: string;
}): Promise<{
  conversation: DirectConversation | null;
  messages: DirectMessage[];
}> {
  if (!hasSupabaseEnv()) {
    return {
      conversation: null,
      messages: [],
    };
  }

  const conversations = await getInboxConversations({ profileId });
  const conversation = conversations.find((item) => item.id === roomId) ?? null;

  if (!conversation) {
    return {
      conversation: null,
      messages: [],
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: rows } = await supabase
    .from("messages")
    .select("id, room_id, sender_id, content, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });
  const senderIds = ((rows ?? []) as MessageRow[]).map((message) => message.sender_id);
  const profilesById = await hydrateProfiles(senderIds);

  return {
    conversation,
    messages: ((rows ?? []) as MessageRow[]).map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.created_at,
      isOwnMessage: message.sender_id === profileId,
      sender: profilesById.get(message.sender_id) ?? null,
    })),
  };
}
