const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...rest,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const payload = (await res.json().catch(() => null)) as
    | { error?: string; details?: unknown }
    | null;

  if (!res.ok) {
    throw new ApiError(
      payload?.error ?? "Ocurrió un error inesperado. Probá de nuevo.",
      res.status,
      payload?.details,
    );
  }

  return payload as T;
}