import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FaqDraft,
  NewsDraft,
  PublicUser,
  ServiceDraft,
  SettingKey,
  SettingsPatch,
} from "@lecal/shared";
import { api } from "../../lib/api";

export interface Service extends ServiceDraft {
  id: string;
}

export interface NewsPost extends Omit<NewsDraft, "date"> {
  id: string;
  date: string;
}

export interface FaqItem extends FaqDraft {
  id: string;
}

export interface ContactSubmission {
  id: string;
  nombre: string;
  empresa: string | null;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  status: string;
  createdAt: string;
}

export interface ContactsResponse {
  items: ContactSubmission[];
  total: number;
  page: number;
  perPage: number;
}

/* ------------------------------ auth ------------------------------ */

export const meQueryKey = ["auth", "me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: () => api<PublicUser>("/auth/me"),
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api<PublicUser>("/auth/login", { method: "POST", body }),
    onSuccess: (user) => qc.setQueryData(meQueryKey, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ ok: boolean }>("/auth/logout", { method: "POST" }),
    onSuccess: () => queryClient.clear(),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      api<{ ok: boolean }>("/auth/change-password", { method: "POST", body }),
  });
}


/* --------------------------- contacts ----------------------------- */

export function useContacts(params: { status?: string; page?: number; perPage?: number }) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  search.set("page", String(params.page ?? 1));
  search.set("perPage", String(params.perPage ?? 25));

  return useQuery({
    queryKey: ["contacts", params.status ?? "all", params.page ?? 1, params.perPage ?? 25],
    queryFn: () => api<ContactsResponse>(`/contact?${search.toString()}`),
  });
}

export function useUpdateContactStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/contact/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/contact/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

/* ---------------------------- services ---------------------------- */

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => api<Service[]>("/services"),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceDraft) => api<Service>("/services", { method: "POST", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceDraft> }) =>
      api<Service>(`/services/${id}`, { method: "PATCH", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/services/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

/* ------------------------------ news ------------------------------ */

export function useNewsAdmin() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => api<NewsPost[]>("/news"),
  });
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewsDraft) => api<NewsPost>("/news", { method: "POST", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsDraft> }) =>
      api<NewsPost>(`/news/${id}`, { method: "PATCH", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/news/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

/* ------------------------------ faq ------------------------------- */

export function useFaqAdmin() {
  return useQuery({
    queryKey: ["faq"],
    queryFn: () => api<FaqItem[]>("/faq"),
  });
}

export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FaqDraft) => api<FaqItem>("/faq", { method: "POST", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faq"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FaqDraft> }) =>
      api<FaqItem>(`/faq/${id}`, { method: "PATCH", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faq"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/faq/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faq"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

/* ---------------------------- settings ---------------------------- */

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => api<Partial<Record<SettingKey, string>>>("/settings"),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SettingsPatch) => api<{ ok: boolean }>("/settings", { method: "PATCH", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["public-site"] });
    },
  });
}

void meQueryKey;