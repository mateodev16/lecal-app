import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SETTINGS, type SettingKey } from "@lecal/shared";
import { api } from "../../lib/api";

export interface SiteService {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface SiteNews {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string | null;
}

export interface SiteFaq {
  id: string;
  question: string;
  answer: string;
}

export interface PublicSiteData {
  settings: Partial<Record<SettingKey, string>>;
  services: SiteService[];
  news: SiteNews[];
  faqs: SiteFaq[];
}

export function useSite() {
  return useQuery({
    queryKey: ["public-site"],
    queryFn: () => api<PublicSiteData>("/public/site"),
    staleTime: 5 * 60 * 1000,
  });
}

export function resolveSettings(
  settings: Partial<Record<SettingKey, string>> | undefined,
): Record<SettingKey, string> {
  return { ...DEFAULT_SETTINGS, ...(settings ?? {}) };
}