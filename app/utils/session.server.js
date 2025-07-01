import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("token", {
  httpOnly: true,
  sameSite: "lax",
  secure: import.meta.env.NODE_ENV === "production",
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
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Add these new functions for token management

// Get token from request
export async function getToken(request) {
  const cookieHeader = request.headers.get("Cookie");
  return await authCookie.parse(cookieHeader);
}

// Set token in cookie
export async function setToken(token) {
  return await authCookie.serialize(token);
}

// Delete/clear token cookie
export async function clearToken() {
  return await authCookie.serialize("", {
    expires: new Date(0), // Set expiry to past date
    maxAge: 0,
  });
}

// Alternative method to clear token
export async function destroyToken() {
  return await authCookie.serialize(null, {
    expires: new Date(0),
    maxAge: 0,
  });
}
