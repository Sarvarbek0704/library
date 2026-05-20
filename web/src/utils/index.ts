export function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(
      decodeURIComponent(
        decoded
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return null;
  }
}

function normalizeRoleString(role: any) {
  const r = String(role || "")
    .toLowerCase()
    .replace(/\s+/g, "")     // "super admin" => "superadmin"
    .replace(/_/g, "");      // "super_admin" => "superadmin"

  if (r.includes("superadmin") || r.includes("super")) return "superadmin";
  if (r.includes("admin")) return "admin";
  return "user";
}

export function getRoleFromToken(token: string | null) {
  if (!token) return null;
  const p = parseJwt(token);
  if (!p) return null;

  const raw =
    p.role ||
    p.roles ||
    p.user?.role ||
    p.claims?.role ||
    p.authorities ||
    p.realm_access?.roles ||
    null;

  if (Array.isArray(raw)) {
    // roles: ["SUPERADMIN","ADMIN"]
    const joined = raw.join(",");
    return normalizeRoleString(joined);
  }

  return normalizeRoleString(raw);
}
