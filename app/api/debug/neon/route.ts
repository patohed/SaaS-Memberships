import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { desc, count, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [NEON DIAGNOSTIC] Iniciando diagnóstico completo...');
    
    const startTime = Date.now();
    
    // Verificar conexión a Neon
    const connectionTest = await db.select().from(users).limit(1);
    
    // Contar usuarios totales
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;
    
    // Obtener último usuario creado
    const latestUser = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      membershipStatus: users.membershipStatus,
      createdAt: users.createdAt,
      currentAmount: users.currentAmount
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(1);
    
    // Buscar específicamente usuario 'random'
    const randomUser = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.email, 'random@random.com'))
    .limit(1);
    
    // Obtener últimos 5 usuarios
    const recentUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      membershipStatus: users.membershipStatus,
      currentAmount: users.currentAmount,
      createdAt: users.createdAt
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(5);
    
    const endTime = Date.now();
    const queryTime = endTime - startTime;
    
    console.log(`📊 [NEON DIAGNOSTIC] Consulta completada en ${queryTime}ms`);
    console.log(`👥 [NEON DIAGNOSTIC] Total usuarios: ${totalUsers}`);
    console.log(`🆕 [NEON DIAGNOSTIC] Último usuario:`, latestUser[0]);
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV || 'unknown',
      vercelRegion: process.env.VERCEL_REGION || 'local',
      neonUrl: process.env.POSTGRES_URL ? 'configured' : 'not configured',
      timestamp: new Date().toISOString(),
      queryTime: `${queryTime}ms`,
      data: {
        totalUsers,
        latestUser: latestUser[0] || null,
        randomUser: randomUser[0] || null,
        recentUsers,
        connectionWorking: connectionTest.length >= 0
      }
    });

  } catch (error) {
    console.error('❌ [NEON DIAGNOSTIC] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      environment: process.env.NODE_ENV || 'unknown',
      neonUrl: process.env.POSTGRES_URL ? 'configured' : 'not configured',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
