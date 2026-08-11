import { getToken } from "./cloudSync";

export interface CmsItem {
  id: string;
  title: string;
  body: string;
  category: string;
  reference: string;
  source: string;
  reviewedBy: string;
  published: boolean;
  updatedAt: string;
}

export type CmsCollection = "lesson" | "tax" | "quiz" | "reference";

export interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  createdAt: string;
  notes: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "فشل الطلب.");
  return data as T;
}

function authJsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  return jsonFetch<T>(url, {
    ...init,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
}

export function fetchPublishedCms(collection: CmsCollection): Promise<CmsItem[]> {
  return jsonFetch<{ items: CmsItem[] }>(`/api/cms/${collection}`).then((d) => d.items || []);
}

export function fetchAdminCms(collection: CmsCollection): Promise<CmsItem[]> {
  return authJsonFetch<{ items: CmsItem[] }>(`/api/admin/cms/${collection}`).then((d) => d.items || []);
}

export function saveAdminCmsItem(collection: CmsCollection, item: CmsItem): Promise<CmsItem> {
  return authJsonFetch<{ item: CmsItem }>(`/api/admin/cms/${collection}`, {
    method: "POST",
    body: JSON.stringify({ item }),
  }).then((d) => d.item);
}

export function deleteAdminCmsItem(collection: CmsCollection, id: string): Promise<void> {
  return authJsonFetch<{ ok: boolean }>(`/api/admin/cms/${collection}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  }).then(() => undefined);
}

export function fetchFaq(): Promise<FaqItem[]> {
  return jsonFetch<{ items: FaqItem[] }>("/api/support/faq").then((d) => d.items || []);
}

export function createTicket(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}): Promise<{ id: string; status: string }> {
  return jsonFetch<{ ticket: { id: string; status: string } }>("/api/support/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((d) => d.ticket);
}

export function fetchAdminTickets(): Promise<Ticket[]> {
  return authJsonFetch<{ items: Ticket[] }>("/api/admin/tickets").then((d) => d.items || []);
}

export function updateAdminTicket(id: string, patch: { status?: string; notes?: string }): Promise<Ticket> {
  return authJsonFetch<{ ticket: Ticket }>(`/api/admin/tickets/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  }).then((d) => d.ticket);
}