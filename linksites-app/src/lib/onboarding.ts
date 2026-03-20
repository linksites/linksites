import type { ProfileWithLinks } from "@/lib/types";

export type OnboardingStepKey = "profile" | "bio" | "avatar" | "links" | "publish";

export type OnboardingStep = {
  key: OnboardingStepKey;
  complete: boolean;
};

export type OnboardingSummary = {
  steps: OnboardingStep[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export function getProfileOnboarding(profile: ProfileWithLinks): OnboardingSummary {
  const activeLinks = profile.links.filter((link) => link.isActive);
  const steps: OnboardingStep[] = [
    {
      key: "profile",
      complete: profile.displayName.trim().length >= 2 && profile.username.trim().length >= 3,
    },
    {
      key: "bio",
      complete: profile.bio.trim().length >= 24,
    },
    {
      key: "avatar",
      complete: Boolean(profile.avatarUrl),
    },
    {
      key: "links",
      complete: activeLinks.length >= 3,
    },
    {
      key: "publish",
      complete: profile.isPublished,
    },
  ];
  const completedCount = steps.filter((step) => step.complete).length;
  const totalCount = steps.length;

  return {
    steps,
    completedCount,
    totalCount,
    progressPercent: Math.round((completedCount / totalCount) * 100),
  };
}
