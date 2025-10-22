// src/lib/supabase/middleware.ts

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function updateSession(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup";
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  // Protect dashboard routes
  if (isDashboard && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  // Don't redirect if it's an RSC request (React Server Component fetch)
  if (
    session &&
    isAuthPage &&
    !req.headers.get("rsc") &&
    !req.nextUrl.searchParams.has("_rsc")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}
