import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Headers de seguridad para Radio Community
 * Implementa protecciones contra ataques web comunes
 */

export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.mercadopago.com https://secure.mlstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.mercadopago.com wss://localhost:* ws://localhost:*",
      "frame-src 'self' https://www.mercadopago.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  );

  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('frame-ancestors', "'none'");

  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Forzar HTTPS en producción
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Prevenir ataques XSS
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Política de referrer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Política de permisos
  response.headers.set(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', ')
  );

  // Headers anti-tracking
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  return response;
}

/**
 * Rate limiting básico en memoria
 * Para producción, usar Redis o similar
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 100, windowMs = 15 * 60 * 1000) { // 100 requests per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    const current = this.attempts.get(key);

    if (!current || now > current.resetTime) {
      // Primera request o ventana expirada
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, remaining: this.maxAttempts - 1, resetTime: now + this.windowMs };
    }

    if (current.count >= this.maxAttempts) {
      // Límite excedido
      return { allowed: false, remaining: 0, resetTime: current.resetTime };
    }

    // Incrementar contador
    current.count++;
    this.attempts.set(key, current);
    
    return { 
      allowed: true, 
      remaining: this.maxAttempts - current.count, 
      resetTime: current.resetTime 
    };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Instancias de rate limiter para diferentes endpoints
// Límites más permisivos en desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

export const generalLimiter = new RateLimiter(
  isDevelopment ? 1000 : 100,   // 1000/15min en dev, 100/15min en prod
  15 * 60 * 1000
); 

export const authLimiter = new RateLimiter(
  isDevelopment ? 50 : 5,       // 50/15min en dev, 5/15min en prod
  15 * 60 * 1000
);      

export const paymentLimiter = new RateLimiter(
  isDevelopment ? 100 : 10,     // 100/hour en dev, 10/hour en prod
  60 * 60 * 1000
);  

export const metricsLimiter = new RateLimiter(
  isDevelopment ? 2000 : 200,   // 2000/15min en dev, 200/15min en prod
  15 * 60 * 1000
);

export function getRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
    'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
  };
}

// Función para resetear rate limiting durante desarrollo
export function resetRateLimiting() {
  if (process.env.NODE_ENV === 'development') {
    generalLimiter.reset('unknown');
    authLimiter.reset('unknown');
    paymentLimiter.reset('unknown');
    metricsLimiter.reset('unknown');
    console.log('🔄 Rate limiting reseteado para desarrollo');
  }
}
