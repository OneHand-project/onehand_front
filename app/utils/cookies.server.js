import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("token", {
  httpOnly: true,
  sameSite: "lax",
  secure: import.meta.env.NODE_ENV === "production",
  path: "/",
});
const API_URL = import.meta.env.VITE_API_URL;

export async function verifyuser(token) {
  if (!token) {
    return null;
  }
  try {
    const res = await fetch(`${API_URL}/api/auth/verifyuser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
