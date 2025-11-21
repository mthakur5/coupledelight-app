import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

export async function middleware(req: NextRequest) {
  const session = await auth();
  const isAuth = !!session;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  // If user is not authenticated and trying to access dashboard
  if (isDashboard && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is authenticated but not admin, deny access
  if (isAuth && session?.user?.role !== 'admin' && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If authenticated admin is on login page, redirect to dashboard
  if (isAuthPage && isAuth && session?.user?.role === 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};