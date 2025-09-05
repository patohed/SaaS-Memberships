import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache } from '@/lib/cache/metrics-cache';

export async function POST() {
  try {
    // Invalidar cache de métricas
    invalidateCache();
    
    return NextResponse.json({
      success: true,
      message: 'Cache de métricas invalidado exitosamente'
    });

  } catch (error) {
    console.error('Error invalidating cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al invalidar cache'
      },
      { status: 500 }
    );
  }
}
