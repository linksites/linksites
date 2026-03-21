import type { ReactNode } from "react";
import { updateProfile } from "@/app/dashboard/actions";
import { themeCatalog } from "@/lib/mock-data";
import type { ProfileWithLinks } from "@/lib/types";
import type { DashboardCopy } from "@/components/dashboard/dashboard-types";

type DashboardProfileFormProps = {
  content: DashboardCopy;
  profile: ProfileWithLinks;
  usingMockData: boolean;
  feedbackError: string | null;
  feedbackMessage: string | null;
  redirectTo?: string;
};

function Notice({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-rose-400/24 bg-rose-400/10 text-rose-100"
          : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
      }`}
    >
      {children}
    </div>
  );
}

export function DashboardProfileForm({
  content,
  profile,
  usingMockData,
  feedbackError,
  feedbackMessage,
  redirectTo = "/dashboard/profile",
}: DashboardProfileFormProps) {
  const editorFields = [
    { label: content.fields.displayName, name: "displayName", value: profile.displayName },
    { label: content.fields.username, name: "username", value: profile.username },
  ];

  return (
    <section
      id="profile"
      className="dashboard-panel dashboard-rise scroll-mt-24 rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.identityLabel}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
            {content.identityTitle}
          </h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
          {usingMockData ? content.identityFallback : content.identityLive}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/62">{content.editorDescription}</p>

      <div className="mt-6 space-y-3">
        {feedbackError ? <Notice tone="error">{feedbackError}</Notice> : null}
        {feedbackMessage ? <Notice tone="info">{feedbackMessage}</Notice> : null}
        {usingMockData ? <Notice tone="info">{content.mockReadonly}</Notice> : null}
      </div>

      <form action={updateProfile} className="mt-6">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="grid gap-4 md:grid-cols-2">
          {editorFields.map((field) => (
            <label key={field.label} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{field.label}</span>
              <input
                name={field.name}
                defaultValue={field.value}
                disabled={usingMockData}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          ))}

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
              {content.fields.theme}
            </span>
            <select
              name="themeSlug"
              defaultValue={profile.themeSlug}
              disabled={usingMockData}
              className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {Object.keys(themeCatalog).map((themeSlug) => (
                <option key={themeSlug} value={themeSlug} className="bg-slate-950 text-white">
                  {content.themeOptions[themeSlug as keyof typeof content.themeOptions]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
              {content.fields.visibility}
            </span>
            <select
              name="isPublished"
              defaultValue={String(profile.isPublished)}
              disabled={usingMockData}
              className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="false" className="bg-slate-950 text-white">
                {content.visibilityDraft}
              </option>
              <option value="true" className="bg-slate-950 text-white">
                {content.visibilityPublished}
              </option>
            </select>
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
            {content.fields.avatarUrl}
          </span>
          <input
            name="avatarUrl"
            defaultValue={profile.avatarUrl ?? ""}
            disabled={usingMockData}
            placeholder="https://..."
            className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <div className="mt-4 rounded-[1.4rem] border border-white/8 bg-white/3 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
            {content.avatarUpload}
          </div>
          <p className="mt-2 text-sm leading-7 text-white/58">{content.avatarUploadHint}</p>
          <input
            name="avatarFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            disabled={usingMockData}
            className="mt-4 block w-full text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/12 file:px-4 file:py-2 file:font-semibold file:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <label className="mt-4 flex items-center gap-2 text-sm text-white/68">
            <input type="hidden" name="removeAvatar" value="false" />
            <input
              type="checkbox"
              name="removeAvatar"
              value="true"
              disabled={usingMockData}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            <span>{content.avatarRemove}</span>
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
            {content.fields.bio}
          </span>
          <textarea
            name="bio"
            defaultValue={profile.bio}
            rows={5}
            disabled={usingMockData}
            className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <button
          disabled={usingMockData}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {content.saveButton}
        </button>
      </form>
    </section>
  );
}
