import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("token", {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
});
const API_URL = process.env.API_URL;

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
    return { username: data.username, email: data.email };
  } catch (e) {
    console.error(e);
  }
}
