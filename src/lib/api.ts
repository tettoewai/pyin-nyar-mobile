import { clearSession, getTokens, saveSession } from "./session";

const BASE = process.env.EXPO_PUBLIC_API_URL!;
export class ApiError extends Error {
  constructor(
    public status: number,
    msg: string,
  ) {
    super(msg);
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function doRefresh(oldRefresh: string): Promise<string | null> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: oldRefresh }),
  });
  if (!res.ok) return null;
  const p: { accessToken: string; refreshToken: string; expiresIn: number } =
    await res.json();
  await saveSession(p.accessToken, p.refreshToken, p.expiresIn);
  return p.accessToken;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  let { access, refresh, expiry } = await getTokens();
  if (access && Date.now() > expiry - 60_000 && refresh) {
    refreshPromise ??= doRefresh(refresh).finally(
      () => (refreshPromise = null),
    );
    access = await refreshPromise;
  }
  const call = (token: string | null) =>
    fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  let res = await call(access);
  if (res.status === 401 && refresh) {
    refreshPromise ??= doRefresh(refresh).finally(
      () => (refreshPromise = null),
    );
    const next = await refreshPromise;
    if (!next) {
      await clearSession();
      throw new ApiError(401, "SESSION_EXPIRED");
    }
    res = await call(next);
  }
  if (!res.ok)
    throw new ApiError(
      res.status,
      (await res.json().catch(() => null))?.message ?? res.statusText,
    );
  return res.status === 204 ? (undefined as T) : res.json();
}
