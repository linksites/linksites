"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface FollowButtonProps {
  targetProfileId: string;
  initialIsFollowing: boolean;
  onFollowChange?: (nextIsFollowing: boolean) => void;
}

export default function FollowButton({
  targetProfileId,
  initialIsFollowing,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const handleToggleFollow = async () => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Você precisa estar logado para seguir um perfil.");
        return;
      }

      // Busca o profile_id do usuário autenticado antes de atualizar o follow.
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!myProfile) {
        return;
      }

      if (isFollowing) {
        const { error: deleteError } = await supabase
          .from("follows")
          .delete()
          .match({ follower_id: myProfile.id, followed_id: targetProfileId });

        if (deleteError) {
          console.error("Error unfollowing:", deleteError);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("followers_count")
          .eq("id", targetProfileId)
          .single();

        if (profile) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ followers_count: Math.max(0, profile.followers_count - 1) })
            .eq("id", targetProfileId);
          if (updateError) {
            console.error("Error updating follower count:", updateError);
          }
        }

        setIsFollowing(false);
        onFollowChange?.(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("follows")
        .insert({ follower_id: myProfile.id, followed_id: targetProfileId });

      if (insertError) {
        console.error("Error following:", insertError);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("followers_count")
        .eq("id", targetProfileId)
        .single();
      
      if (profile) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ followers_count: profile.followers_count + 1 })
          .eq("id", targetProfileId);
        if (updateError) {
          console.error("Error updating follower count:", updateError);
        }
      }

      setIsFollowing(true);
      onFollowChange?.(true);
    } catch (error) {
      console.error("Erro ao alterar follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`rounded-full px-4 py-2 font-medium transition-colors ${
        isFollowing
          ? "border border-[var(--muted)] bg-[var(--muted)] text-[var(--text)] hover:bg-opacity-80"
          : "bg-[var(--accent)] text-black hover:bg-opacity-90"
      } disabled:opacity-50`}
    >
      {isLoading ? "Aguarde..." : isFollowing ? "Seguindo" : "Seguir"}
    </button>
  );
}
