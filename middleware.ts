import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie =
    request.cookies.get("creatorflow-auth");

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

  if (isProtected && !authCookie) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
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
  ],
};