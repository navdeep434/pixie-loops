import { API_BASE, API_URL } from "@/lib/api/config";

// ─── CSRF ─────────────────────────────────────────────────────────────────────
// Singleton promise — if initCsrf() is already in-flight, all callers
// wait on the SAME request instead of firing multiple parallel ones.

let csrfPromise: Promise<void> | null = null;

function isCsrfReady(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("csrf_init") === "1";
}

export function initCsrf(): Promise<void> {
  // Already done — return immediately
  if (isCsrfReady()) return Promise.resolve();

  // In-flight — return the same promise so parallel callers all wait on it
  if (csrfPromise) return csrfPromise;

  csrfPromise = fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  })
    .then(() => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("csrf_init", "1");
      }
    })
    .finally(() => {
      csrfPromise = null; // reset so it can re-run after a 419
    });

  return csrfPromise;
}

function clearCsrf(): void {
  csrfPromise = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("csrf_init");
  }
}

function getXsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

// ─── Core request ─────────────────────────────────────────────────────────────

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  silent401?: boolean;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false
): Promise<T> {
  const { method = "GET", body, headers = {}, silent401 = false } = options;

  // Always await initCsrf — it's a no-op if already done,
  // and a shared in-flight promise if currently running
  await initCsrf();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": getXsrfToken(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // ── 419: CSRF mismatch — refresh and retry once ───────────────────────────
  if (res.status === 419 && !isRetry) {
    clearCsrf();
    await initCsrf();
    return request<T>(path, options, true);
  }

  // ── 401: Unauthenticated ──────────────────────────────────────────────────
  if (res.status === 401) {
    if (!silent401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session:expired"));
    }
    throw new SessionExpiredError("Session expired. Please log in again.");
  }

  // ── 403: Forbidden ────────────────────────────────────────────────────────
  if (res.status === 403) {
    throw new ApiError("You don't have permission to perform this action.", 403);
  }

  // ── 431: Cookie too large ─────────────────────────────────────────────────
  if (res.status === 431) {
    throw new ApiError("Request header too large — please clear your cookies and refresh.", 431);
  }

  // ── Parse response ────────────────────────────────────────────────────────
  const text = await res.text();
  let data: any;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!isRetry) {
      clearCsrf();
      await initCsrf();
      return request<T>(path, options, true);
    }
    throw new ApiError("Unexpected server response. Please refresh the page.", res.status);
  }

  if (!res.ok) {
    const message = data?.message ?? data?.error ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data?.errors);
  }

  return data as T;
}

// ─── Error classes ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class SessionExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionExpiredError";
  }
}

// ─── Convenience methods ──────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: "GET", headers }),

  silentGet: <T>(path: string) =>
    request<T>(path, { method: "GET", silent401: true }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

export default apiClient;