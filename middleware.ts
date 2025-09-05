import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';
import { applySecurityHeaders, generalLimiter, authLimiter, getRateLimitHeaders } from '@/lib/security/headers';
import { secureLog } from '@/lib/utils/secure-logger';

const protectedRoutes = '/dashboard';
const authRoutes = ['/sign-in', '/sign-up', '/participacion'];
const apiRoutesWithOwnRateLimit = ['/api/metrics']; // Rutas que manejan su propio rate limiting
const excludedFromRateLimit = [
  '/_next/', 
  '/favicon.ico', 
  '/api/metrics',
  '/globals.css',
  '/__nextjs',
  '/static/'
]; // Rutas excluidas del rate limiting

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isProtectedRoute = pathname.startsWith(protectedRoutes);
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const hasOwnRateLimit = apiRoutesWithOwnRateLimit.some(route => pathname.startsWith(route));
  const isExcludedFromRateLimit = excludedFromRateLimit.some(route => pathname.startsWith(route));
  
  // Obtener IP para rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  
  let rateLimitResult: any = null;
  
  // Aplicar rate limiting solo si la ruta no maneja el suyo propio y no está excluida
  if (!hasOwnRateLimit && !isExcludedFromRateLimit) {
    const limiter = isAuthRoute ? authLimiter : generalLimiter;
    rateLimitResult = limiter.check(ip);
    
    if (!rateLimitResult.allowed) {
      console.warn(`🚫 Rate limit excedido para ${ip} en ${pathname}`);
      const response = new NextResponse('Too Many Requests', { status: 429 });
      
      // Aplicar headers de rate limit
      Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
        .forEach(([key, value]) => response.headers.set(key, value));
      
      return applySecurityHeaders(response);
    }
  }

  // Verificar autenticación
  if (isProtectedRoute && !sessionCookie) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    return applySecurityHeaders(response);
  }

  let res = NextResponse.next();

  // Renovar sesión si existe
  if (sessionCookie && request.method === 'GET') {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString()
        }),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresInOneDay
      });
    } catch (error) {
      // Solo logear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        secureLog.error('Error interno', error);
      }
      res.cookies.delete('session');
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        return applySecurityHeaders(response);
      }
    }
  }

  // Aplicar headers de rate limiting solo si se aplicó rate limiting
  if (rateLimitResult && !hasOwnRateLimit && !isExcludedFromRateLimit) {
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
      .forEach(([key, value]) => res.headers.set(key, value));
  }

  // Aplicar headers de seguridad
  return applySecurityHeaders(res);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.png, *.jpg, *.jpeg, *.gif, *.svg (image files)
     * - *.css, *.js (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.css$|.*\\.js$|__nextjs).*)/'
  ],
  runtime: 'nodejs'
};
