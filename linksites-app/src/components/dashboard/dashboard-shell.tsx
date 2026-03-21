import type { ReactNode } from "react";

type DashboardShellProps = {
  sidebar: ReactNode;
  aside: ReactNode;
  children: ReactNode;
};

export function DashboardShell({ sidebar, aside, children }: DashboardShellProps) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[250px_minmax(0,1fr)_360px] xl:items-start">
      <div className="dashboard-rise xl:sticky xl:top-8">{sidebar}</div>
      <div className="space-y-6">{children}</div>
      <div className="dashboard-rise xl:sticky xl:top-8">{aside}</div>
    </section>
  );
}
