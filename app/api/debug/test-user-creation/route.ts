import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { invalidateCacheOnPayment } from '@/lib/cache/metrics-cache';
import { hashPassword } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 [TEST] Creando usuario de prueba para validar invalidación de cache...');
    
    const testEmail = `test-${Date.now()}@example.com`;
    const hashedPassword = await hashPassword('testpassword123');
    
    // Crear usuario de prueba
    const [testUser] = await db.insert(users).values({
      name: 'Test User',
      email: testEmail,
      passwordHash: hashedPassword,
      membershipStatus: 'active',
      score: 100,
      level: 'bronze'
    }).returning();

    console.log('✅ [TEST] Usuario creado:', testUser.id);

    // Invalidar cache usando nuestro sistema
    await invalidateCacheOnPayment();
    console.log('🗑️ [TEST] Cache invalidado');

    return NextResponse.json({
      success: true,
      message: 'Usuario de prueba creado y cache invalidado',
      userId: testUser.id,
      email: testEmail,
      notice: 'Las métricas deberían actualizarse automáticamente'
    });

  } catch (error) {
    console.error('❌ [TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error en test de creación de usuario',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
