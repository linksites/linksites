import { updateLinks } from "@/app/dashboard/actions";
import type { ProfileWithLinks } from "@/lib/types";
import type { DashboardCopy } from "@/components/dashboard/dashboard-types";

type DashboardLinksEditorProps = {
  content: DashboardCopy;
  profile: ProfileWithLinks;
  usingMockData: boolean;
  redirectTo?: string;
};

export function DashboardLinksEditor({
  content,
  profile,
  usingMockData,
  redirectTo = "/dashboard/links",
}: DashboardLinksEditorProps) {
  const newLinkSlots = 3;

  return (
    <section
      id="links"
      className="dashboard-panel dashboard-rise scroll-mt-24 rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.fields.links}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
            {content.fields.links}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{content.linksDescription}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
          {profile.links.length} itens
        </div>
      </div>

      <form action={updateLinks} className="mt-6 space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {profile.links.length ? (
          profile.links.map((link) => (
            <div key={link.id} className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
              <input type="hidden" name="existingLinkIds" value={link.id} />
              <div className="grid gap-4 md:grid-cols-[1fr_1.4fr_110px]">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                    {content.linkTitle}
                  </span>
                  <input
                    name={`title-${link.id}`}
                    defaultValue={link.title}
                    disabled={usingMockData}
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                    {content.linkUrl}
                  </span>
                  <input
                    name={`url-${link.id}`}
                    defaultValue={link.url}
                    disabled={usingMockData}
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                    {content.linkPosition}
                  </span>
                  <input
                    name={`position-${link.id}`}
                    type="number"
                    defaultValue={link.position}
                    disabled={usingMockData}
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-white/70">
                <label className="flex items-center gap-2">
                  <input type="hidden" name={`isActive-${link.id}`} value="false" />
                  <input
                    type="checkbox"
                    name={`isActive-${link.id}`}
                    value="true"
                    defaultChecked={link.isActive}
                    disabled={usingMockData}
                    className="h-4 w-4 rounded border-white/20 bg-white/5"
                  />
                  <span>
                    {content.linkStatus}: {link.isActive ? content.linkActive : content.linkInactive}
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input type="hidden" name={`remove-${link.id}`} value="false" />
                  <input
                    type="checkbox"
                    name={`remove-${link.id}`}
                    value="true"
                    disabled={usingMockData}
                    className="h-4 w-4 rounded border-white/20 bg-white/5"
                  />
                  <span>{content.linkRemove}</span>
                </label>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-4 py-5 text-sm leading-7 text-white/58">
            {content.emptyLinks}
          </div>
        )}

        <div className="rounded-[1.6rem] border border-dashed border-white/12 bg-white/3 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
            {content.linkNew}
          </div>
          <p className="mt-2 text-sm leading-7 text-white/58">{content.addLinkHint}</p>
          <input type="hidden" name="newLinkSlots" value={String(newLinkSlots)} />
          <div className="mt-4 space-y-4">
            {Array.from({ length: newLinkSlots }).map((_, slotIndex) => (
              <div key={`new-link-${slotIndex}`} className="grid gap-4 md:grid-cols-[1fr_1.4fr_110px]">
                <input
                  name={`new-title-${slotIndex}`}
                  placeholder={content.linkTitle}
                  disabled={usingMockData}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
                <input
                  name={`new-url-${slotIndex}`}
                  placeholder="https://"
                  disabled={usingMockData}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
                <input
                  name={`new-position-${slotIndex}`}
                  type="number"
                  defaultValue={profile.links.length + slotIndex}
                  disabled={usingMockData}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
                <label className="flex items-center gap-2 text-sm text-white/68 md:col-span-3">
                  <input type="hidden" name={`new-isActive-${slotIndex}`} value="false" />
                  <input
                    type="checkbox"
                    name={`new-isActive-${slotIndex}`}
                    value="true"
                    defaultChecked
                    disabled={usingMockData}
                    className="h-4 w-4 rounded border-white/20 bg-white/5"
                  />
                  <span>{content.linkInactiveHint}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={usingMockData}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {content.saveLinksButton}
        </button>

        <div className="rounded-[1.6rem] border border-dashed border-white/12 bg-white/3 p-5">
          <p className="text-sm leading-7 text-white/62">{content.nextStep}</p>
        </div>
      </form>
    </section>
  );
}
