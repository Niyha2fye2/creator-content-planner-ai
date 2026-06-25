import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sb-access-token");

  if (
    !token &&
    (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/generate") ||
      request.nextUrl.pathname.startsWith("/calendar") ||
      request.nextUrl.pathname.startsWith("/analytics") ||
      request.nextUrl.pathname.startsWith("/history")
    )
  ) {
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
  ],
};