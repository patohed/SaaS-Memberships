import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard'
];

// Rutas que son solo para usuarios NO autenticados
const authOnlyRoutes = [
  '/sign-in',
  '/sign-up',
  '/participacion'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthOnlyRoute = authOnlyRoutes.some(route => pathname.startsWith(route));
  
  // Verificar si hay sesión válida
  let hasValidSession = false;
  let sessionUser = null;
  
  if (sessionCookie) {
    try {
      sessionUser = await verifyToken(sessionCookie.value);
      hasValidSession = true;
    } catch (error) {
      // Sesión inválida - limpiar cookie
      console.log('Invalid session, clearing cookie');
    }
  }

  // Si es ruta protegida y no hay sesión válida -> redirigir al login
  if (isProtectedRoute && !hasValidSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Si es ruta de auth y YA está autenticado -> redirigir al dashboard
  if (isAuthOnlyRoute && hasValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  let res = NextResponse.next();

  // Renovar sesión si es válida
  if (hasValidSession && sessionUser && request.method === 'GET') {
    try {
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...sessionUser,
          expires: expiresInOneDay.toISOString()
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInOneDay
      });
    } catch (error) {
      console.error('Error updating session:', error);
      res.cookies.delete('session');
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  } else if (!hasValidSession && sessionCookie) {
    // Limpiar cookie inválida
    res.cookies.delete('session');
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs'
};
