interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 60_000;

function makeKey(endpoint: string, params?: Record<string, string | undefined>): string {
  const sortedParams = params
    ? Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== '')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    : '';
  return sortedParams ? `${endpoint}?${sortedParams}` : endpoint;
}

export function getCached<T>(
  endpoint: string,
  params?: Record<string, string | undefined>
): T | undefined {
  const key = makeKey(endpoint, params);
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

export function setCached<T>(
  endpoint: string,
  data: T,
  params?: Record<string, string | undefined>,
  ttlMs = DEFAULT_TTL_MS
): void {
  const key = makeKey(endpoint, params);
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function invalidateCache(endpointPrefix?: string): void {
  if (!endpointPrefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(endpointPrefix)) {
      cache.delete(key);
    }
  }
}
