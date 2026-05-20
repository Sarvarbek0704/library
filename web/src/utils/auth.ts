// src/utils/auth.ts

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
                    .join(""),
            ),
        );
    } catch {
        return null;
    }
}

/**
 * Token ichidan role ni topish (hamma ehtimoliy claimlarni ushlaydi)
 * qaytaradi: "superadmin" | "admin" | "user" | null
 */
export function getRoleFromToken(token: string | null) {
    if (!token) return null;
    const p: any = parseJwt(token);
    if (!p) return null;

    // ko‘p ishlatiladigan claimlar
    const raw =
        p.role ||
        p.roles ||
        p.user?.role ||
        p.claims?.role ||
        p.data?.role ||
        p.payload?.role ||
        p.authorities?.[0] ||
        p.realm_access?.roles?.[0] ||
        null;

    if (!raw) return null;

    // raw array bo‘lishi mumkin
    const str = Array.isArray(raw) ? String(raw[0]) : String(raw);
    const r = str.toLowerCase();

    if (r.includes("super")) return "superadmin";
    if (r.includes("admin")) return "admin";
    if (r.includes("user")) return "user";

    // fallback
    return r || null;
}
