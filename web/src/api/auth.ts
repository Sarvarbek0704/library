import { http } from "./http";

export async function login(body: { phone: string; password: string }) {
  const data: any = await http("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const token = data?.token || data?.access_token || data?.data?.token || "";
  if (token) localStorage.setItem("token", token);

  localStorage.setItem("phone", body.phone);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("phone");
  localStorage.removeItem("userPhone");
  localStorage.removeItem("loginPhone");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}
