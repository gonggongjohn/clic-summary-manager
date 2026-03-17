import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils";

const protectedPaths = ["/cases"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  const user = await getCurrentUser(request);

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/cases", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cases/:path*", "/login", "/register"],
};