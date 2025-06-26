import { createCookie } from "@remix-run/node";

const authCookie = createCookie("token", {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

export { authCookie };
