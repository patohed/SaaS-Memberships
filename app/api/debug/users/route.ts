import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Verificando usuarios en base de datos...');
    
    // Obtener últimos 10 usuarios
    const recentUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      membershipStatus: users.membershipStatus,
      createdAt: users.createdAt
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(10);

    // Contar total de usuarios
    const totalUsers = await db.select().from(users);
    
    console.log(`📊 [DEBUG] Total usuarios encontrados: ${totalUsers.length}`);
    console.log('📊 [DEBUG] Últimos usuarios:', recentUsers);

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV || 'unknown',
      database: process.env.DATABASE_URL ? 'configured' : 'not configured',
      totalUsers: totalUsers.length,
      recentUsers: recentUsers,
      timestamp: new Date().toISOString(),
      vercelRegion: process.env.VERCEL_REGION || 'local'
    });

  } catch (error) {
    console.error('❌ [ERROR] Error en debug endpoint:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      environment: process.env.NODE_ENV || 'unknown',
      database: process.env.DATABASE_URL ? 'configured' : 'not configured',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
