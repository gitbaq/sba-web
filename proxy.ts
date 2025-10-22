import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { isTokenExpired } from "./utils/authUtils";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  // Get Cookie
  const token = request.cookies.get("token");
  const path = request.nextUrl.pathname;
  const cookieStore = await cookies();
  if (path === "/logout") {
    cookieStore.delete("token");
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token || isTokenExpired(token.value)) {
    cookieStore.delete("token");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/editor/:path*", "/contact", "/admin/:path*", "/logout"],
  // matcher: ["/:path*"],
};


