import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAdminEmail } from '@/lib/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/painel') && !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.email) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin') && !isAdminEmail(token.email)) {
    const painelUrl = new URL('/painel', request.url);
    return NextResponse.redirect(painelUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/painel/:path*', '/admin/:path*'],
};
