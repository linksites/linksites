import type { AppLocale } from "@/lib/locale";
import { appContent } from "@/data/app-content";

export type DashboardCopy = (typeof appContent)[AppLocale]["dashboard"];
export type SharedCopy = (typeof appContent)[AppLocale]["shared"];
