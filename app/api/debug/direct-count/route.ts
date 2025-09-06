import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, membershipPayments } from '@/lib/db/schema';
import { desc, isNull, eq, sum, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DIRECT DB] Consultando base de datos directamente...');
    
    // 1. Contar TODOS los usuarios (incluidos eliminados para debugging)
    const allUsersResult = await db.select().from(users);
    const totalUsersIncludingDeleted = allUsersResult.length;
    
    // 2. Contar usuarios NO eliminados
    const activeUsersResult = await db.select().from(users).where(isNull(users.deletedAt));
    const totalActiveUsers = activeUsersResult.length;
    
    // 3. Contar usuarios con membresía activa
    const membershipActiveResult = await db.select().from(users).where(
      and(
        isNull(users.deletedAt),
        eq(users.membershipStatus, 'active')
      )
    );
    const usersWithActiveMembership = membershipActiveResult.length;
    
    // 4. Obtener últimos 10 usuarios creados
    const recentUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      membershipStatus: users.membershipStatus,
      createdAt: users.createdAt,
      deletedAt: users.deletedAt
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(10);
    
    // 5. Calcular fondos totales
    const fundsResult = await db.select({ 
      total: sum(membershipPayments.amount) 
    })
    .from(membershipPayments)
    .where(eq(membershipPayments.status, 'completed'));
    
    const totalFunds = Number(fundsResult[0]?.total || 0);
    
    console.log(`📊 [DIRECT DB] Usuarios encontrados: ${totalActiveUsers} activos de ${totalUsersIncludingDeleted} totales`);
    console.log(`💰 [DIRECT DB] Fondos totales: $${Math.round(totalFunds / 100)}`);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      vercelRegion: process.env.VERCEL_REGION || 'local',
      counts: {
        totalUsersIncludingDeleted,
        totalActiveUsers,
        usersWithActiveMembership
      },
      funds: {
        totalCents: totalFunds,
        totalDollars: Math.round(totalFunds / 100)
      },
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email?.replace(/(.{3}).*(@.*)/, '$1***$2'), // Ocultar email parcialmente
        membershipStatus: user.membershipStatus,
        createdAt: user.createdAt,
        isDeleted: !!user.deletedAt
      }))
    });

  } catch (error) {
    console.error('❌ [DIRECT DB] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
