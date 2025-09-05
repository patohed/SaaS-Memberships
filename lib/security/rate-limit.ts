import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { paymentLimiter, authLimiter, getRateLimitHeaders } from '@/lib/security/headers';
import { secureLog } from '@/lib/utils/secure-logger';

/**
 * Rate limiting middleware para endpoints específicos
 * Protege contra ataques de fuerza bruta y abuso
 */

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  limiter: any,
  action: string
) {
  return async (request: NextRequest) => {
    // Obtener identificador único
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    
    // Verificar rate limit
    const rateLimitResult = limiter.check(ip);
    
    if (!rateLimitResult.allowed) {
      secureLog.security(`Rate limit excedido para ${action}`, { ip, action });
      
      const response = new NextResponse(
        JSON.stringify({ 
          error: 'Demasiadas solicitudes. Por favor intenta más tarde.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        }), 
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
      
      // Aplicar headers de rate limit
      Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
        .forEach(([key, value]) => response.headers.set(key, value));
      
      return response;
    }

    // Aplicar headers de rate limit a respuesta exitosa
    const response = await handler(request);
    
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
      .forEach(([key, value]) => response.headers.set(key, value));
    
    return response;
  };
}

/**
 * Rate limiter específico para autenticación
 */
export function withAuthRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return withRateLimit(handler, authLimiter, 'authentication');
}

/**
 * Rate limiter específico para pagos
 */
export function withPaymentRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return withRateLimit(handler, paymentLimiter, 'payment');
}

/**
 * Detectar y bloquear patrones sospechosos
 */
class ThreatDetector {
  private suspiciousPatterns: Map<string, { count: number; lastSeen: number }> = new Map();
  private blockedIPs: Set<string> = new Set();
  
  checkSuspiciousActivity(ip: string, userAgent: string, path: string): boolean {
    const now = Date.now();
    const key = `${ip}-${userAgent}`;
    
    // Verificar si IP está bloqueada
    if (this.blockedIPs.has(ip)) {
      return false;
    }
    
    // Detectar patrones sospechosos
    const suspicious = this.detectSuspiciousPattern(userAgent, path);
    
    if (suspicious) {
      const current = this.suspiciousPatterns.get(key) || { count: 0, lastSeen: 0 };
      current.count++;
      current.lastSeen = now;
      
      this.suspiciousPatterns.set(key, current);
      
      // Bloquear después de 5 intentos sospechosos
      if (current.count >= 5) {
        this.blockedIPs.add(ip);
        secureLog.security('IP bloqueada por actividad sospechosa', { ip, userAgent, path });
        return false;
      }
    }
    
    return true;
  }
  
  private detectSuspiciousPattern(userAgent: string, path: string): boolean {
    const suspiciousUA = [
      'curl', 'wget', 'python', 'bot', 'crawler', 'scanner',
      'nikto', 'sqlmap', 'nmap', 'masscan'
    ];
    
    const suspiciousPaths = [
      '/admin', '/wp-admin', '/.env', '/config', '/backup',
      '/phpmyadmin', '/mysql', '/database', '/api/admin'
    ];
    
    const ua = userAgent.toLowerCase();
    const normalizedPath = path.toLowerCase();
    
    return suspiciousUA.some(pattern => ua.includes(pattern)) ||
           suspiciousPaths.some(pattern => normalizedPath.includes(pattern));
  }
  
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    secureLog.security('IP desbloqueada manualmente', { ip });
  }
}

export const threatDetector = new ThreatDetector();
