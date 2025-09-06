import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [FORCE UPDATE] Forzando actualización de métricas agregadas...');
    
    // Construir URL base
    let baseUrl = '';
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    
    if (host) {
      baseUrl = `${protocol}://${host}`;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else {
      baseUrl = 'http://localhost:3000';
    }
    
    console.log(`📡 [FORCE UPDATE] Llamando a: ${baseUrl}/api/update-aggregates`);
    
    // Llamar al endpoint de actualización
    const response = await fetch(`${baseUrl}/api/update-aggregates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ [FORCE UPDATE] Métricas actualizadas exitosamente');
      
      return NextResponse.json({
        success: true,
        message: 'Métricas forzadas a actualizar exitosamente',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`HTTP ${response.status}: ${result.error || 'Unknown error'}`);
    }
    
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
