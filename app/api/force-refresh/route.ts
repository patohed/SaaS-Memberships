import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache } from '@/lib/cache/metrics-cache';

export async function POST() {
  try {
    // Invalidar cache
    invalidateCache();
    
    // Forzar un refresh inmediato haciendo un call a metrics
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
      
    try {
      const response = await fetch(`${baseUrl}/api/metrics?bust=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          message: 'Cache invalidado y métricas refrescadas',
          data: data.data
        });
      }
    } catch (fetchError) {
      console.warn('No se pudo hacer fetch automático, pero cache invalidado');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Cache invalidado exitosamente'
    });

  } catch (error) {
    console.error('Error forcing refresh:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al forzar refresh'
      },
      { status: 500 }
    );
  }
}
