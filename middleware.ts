// middleware.ts — place this at the ROOT of your Next.js project (same level as app/)
// Next.js runs this at the edge BEFORE any page renders

import { NextRequest, NextResponse } from 'next/server';

// ── Route definitions ──────────────────────────────────────────────────────────
const PUBLIC_ROUTES = ['/login', '/register'];
const PROTECTED_PREFIX = ['/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isProtectedRoute = PROTECTED_PREFIX.some((p) => pathname.startsWith(p));

  // ── Already logged in → redirect away from login/register ─────────────────
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ── Not logged in → redirect to login ─────────────────────────────────────
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); // preserve destination
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to relevant paths (skip API routes, static files, etc.)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};