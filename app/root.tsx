import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "~/global.css";
import "./tailwind.css";
import { authCookie } from "./utils/cookies.server";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/Logo.png",
    type: "image/png",
  },

  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];
export const meta: MetaFunction = () => {
  return [
    { title: "OneHand" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export async function action() {
  const cookieHeader = await authCookie.serialize("", {
    maxAge: 0,
    path: "/",
  });
  return redirect("/", {
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
