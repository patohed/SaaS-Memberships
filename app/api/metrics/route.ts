import { NextRequest, NextResponse } from 'next/server';
import { getMetrics } from '@/lib/db/queries';
import { getCachedMetrics, setCachedMetrics } from '@/lib/cache/metrics-cache';
import { secureLog } from '@/lib/utils/secure-logger';
import { generalLimiter, getRateLimitHeaders } from '@/lib/security/headers';

export async function GET(request: NextRequest) {
  // Rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  
  const rateLimitResult = generalLimiter.check(ip);
  
  if (!rateLimitResult.allowed) {
    secureLog.security('Rate limit excedido para métricas', { ip });
    
    const response = NextResponse.json(
      { 
        error: 'Demasiadas solicitudes. Por favor intenta más tarde.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      }, 
      { status: 429 }
    );
    
    // Aplicar headers de rate limit
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
      .forEach(([key, value]) => response.headers.set(key, value));
    
    return response;
  }

  try {
    // 1. Intentar obtener datos del cache primero
    const cachedData = getCachedMetrics();
    if (cachedData) {
      const response = NextResponse.json({
        success: true,
        data: cachedData,
        fromCache: true
      });
      
      // Aplicar headers de rate limit
      Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
        .forEach(([key, value]) => response.headers.set(key, value));
      
      return response;
    }

    // 2. Si no hay cache válido, consultar la base de datos
    const metrics = await getMetrics();
    
    // 3. Guardar en cache para futuras consultas
    setCachedMetrics(metrics);
    
    const response = NextResponse.json({
      success: true,
      data: {
        ...metrics,
        fromCache: false
      }
    });
    
    // Aplicar headers de rate limit
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
      .forEach(([key, value]) => response.headers.set(key, value));
    
    return response;
  } catch (error) {
    secureLog.error('Error interno', error);
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
    
    // Aplicar headers de rate limit
    Object.entries(getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime))
      .forEach(([key, value]) => response.headers.set(key, value));
    
    return response;
  }
}
