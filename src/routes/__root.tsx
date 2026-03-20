/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Provider } from "../components/ui/provider";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "theme-color",
        content: "#f6f7f9",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

export function RootDocument({
  lang,
  children,
}: {
  lang: "sv" | "en";
  children: ReactNode;
}) {
  return (
    <html lang={lang} className="light" style={{ colorScheme: "light" }}>
      <head>
        <HeadContent />
      </head>
      <body>{children}</body>
    </html>
  );
}

function RootComponent() {
  const lang = useRouterState({
    select: (s) =>
      s.location.pathname === "/en" || s.location.pathname.startsWith("/en/")
        ? "en"
        : "sv",
  });

  return (
    <RootDocument lang={lang}>
      <Provider>
        <Outlet />
        <Scripts />
      </Provider>
    </RootDocument>
  );
}
