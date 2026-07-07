export type UserRole = 'staff' | 'agent' | 'manager' | 'admin';

interface JwtPayload {
  [key: string]: unknown;
  sub?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  role?: string | string[];
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(base64UrlDecode(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function getUserIdFromJwt(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.sub ?? null;
}

export function getRoleFromJwt(token: string): UserRole | null {
  const payload = decodeJwt(token);
  if (!payload) return null;

  const roleClaim =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload.role;

  const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim].filter(Boolean);

  const hierarchy: UserRole[] = ["admin", "manager", "agent", "staff"];
  for (const role of hierarchy) {
    if (roles.some((r) => String(r).toLowerCase() === role)) {
      return role;
    }
  }

  return null;
}
