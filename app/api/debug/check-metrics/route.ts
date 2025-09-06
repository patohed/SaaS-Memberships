import { NextRequest, NextResponse } from 'next/server';
import { getMetrics } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Consultando métricas para usuario logueado...');
    
    const metrics = await getMetrics();
    
    console.log('📊 [DEBUG] Métricas obtenidas:', {
      totalUsers: metrics.totalUsers,
      activeUsers: metrics.activeUsers,
      dineroTotalRecaudado: metrics.dineroTotalRecaudado,
      totalFunds: metrics.totalFunds,
      source: metrics.source,
      lastUpdated: metrics.lastUpdated
    });
    
    return NextResponse.json({
      success: true,
      data: metrics,
      debug: {
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
        cookies: request.headers.get('cookie') ? 'present' : 'absent'
      }
    });
  } catch (error) {
    console.error('❌ [DEBUG] Error consultando métricas:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
