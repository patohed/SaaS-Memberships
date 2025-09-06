import { NextRequest, NextResponse } from 'next/server';
import { updateMetricsAggregates } from '@/lib/services/metrics-updater';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [FORCE UPDATE] Forzando actualización de métricas agregadas...');
    
    // Llamar directamente a la función en lugar de hacer HTTP request
    const result = await updateMetricsAggregates();
    
    console.log('✅ [FORCE UPDATE] Métricas actualizadas exitosamente');
    
    return NextResponse.json({
      success: true,
      message: 'Métricas forzadas a actualizar exitosamente',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ [FORCE UPDATE] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para forzar actualización de métricas',
    usage: 'POST /api/debug/force-update-metrics'
  });
}
