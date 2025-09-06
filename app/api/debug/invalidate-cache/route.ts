import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache, forceRefreshMetrics } from '@/lib/cache/metrics-cache';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [FORCE REFRESH] Invalidando cache manualmente...');
    
    // Invalidar cache
    invalidateCache();
    
    // Forzar actualización
    const refreshResult = await forceRefreshMetrics();
    
    console.log('✅ [FORCE REFRESH] Cache invalidado exitosamente');
    
    return NextResponse.json({
      success: true,
      message: 'Cache invalidado y métricas actualizadas',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      vercelRegion: process.env.VERCEL_REGION || 'local',
      refreshResult
    });

  } catch (error) {
    console.error('❌ [ERROR] Error al invalidar cache:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST para invalidar cache',
    usage: 'POST /api/debug/invalidate-cache'
  });
}
