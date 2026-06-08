import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/cart", "/checkout", "/transactions", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("al-baraka-session");

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/checkout", "/transactions", "/profile", "/login", "/register"],
};
