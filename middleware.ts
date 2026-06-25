import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow public routes
  const publicRoutes = ["/login", "/signup", "/forgot-password"];

  if (
    publicRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  // Check for ANY Supabase auth cookie
  const hasSupabaseCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-"));

  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/generate",
    "/calendar",
    "/analytics",
    "/history",
    "/profile",
  ];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !hasSupabaseCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/generate/:path*",
    "/calendar/:path*",
    "/analytics/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
};