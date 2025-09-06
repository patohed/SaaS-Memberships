import { NextRequest, NextResponse } from 'next/server';
import { updateMetricsAggregates } from '@/lib/services/metrics-updater';

export async function POST() {
  try {
    const result = await updateMetricsAggregates();
    
    return NextResponse.json({
      success: true,
      message: 'Métricas agregadas actualizadas exitosamente',
      data: result
    });

  } catch (error) {
    console.error('❌ Error en endpoint update-aggregates:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error actualizando métricas agregadas',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
