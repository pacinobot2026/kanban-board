import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('kanban_auth');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiAuth = request.nextUrl.pathname === '/api/auth';

  // Allow access to login page and auth API
  if (isLoginPage || isApiAuth) {
    // If already authenticated and trying to access login, redirect to home
    if (isLoginPage && auth?.value === 'authenticated') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for all other routes
  if (auth?.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
