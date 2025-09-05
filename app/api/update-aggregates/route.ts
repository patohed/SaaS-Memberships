import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    // Recalcular métricas desde cero
    
    // 1. Contar total de usuarios (no eliminados)
    const totalUsersResult = await db.execute(sql`
      SELECT COUNT(*) as total_users
      FROM users 
      WHERE deleted_at IS NULL
    `);
    const totalUsers = Number(totalUsersResult[0]?.total_users) || 0;

    // 2. Contar usuarios activos (con membresía activa)
    const activeUsersResult = await db.execute(sql`
      SELECT COUNT(*) as active_users
      FROM users 
      WHERE deleted_at IS NULL 
      AND membership_status = 'active'
    `);
    const activeUsers = Number(activeUsersResult[0]?.active_users) || 0;

    // 3. Sumar fondos de membresía
    const membershipFundsResult = await db.execute(sql`
      SELECT COALESCE(SUM(amount), 0) as membership_funds
      FROM membership_payments 
      WHERE status = 'completed'
    `);
    const membershipFunds = Number(membershipFundsResult[0]?.membership_funds) || 0;

    // 4. Sumar contribuciones
    const contributionFundsResult = await db.execute(sql`
      SELECT COALESCE(SUM(amount), 0) as contribution_funds
      FROM contributions 
      WHERE status = 'completed'
    `);
    const contributionFunds = Number(contributionFundsResult[0]?.contribution_funds) || 0;

    // 5. Contar propuestas activas
    const activeProposalsResult = await db.execute(sql`
      SELECT COUNT(*) as active_proposals
      FROM proposals 
      WHERE status = 'active'
    `);
    const activeProposals = Number(activeProposalsResult[0]?.active_proposals) || 0;

    // Actualizar tabla de métricas agregadas
    const updates = [
      { metric: 'total_users', value: totalUsers },
      { metric: 'active_users', value: activeUsers },
      { metric: 'membership_funds_cents', value: membershipFunds },
      { metric: 'contribution_funds_cents', value: contributionFunds },
      { metric: 'total_funds_cents', value: membershipFunds + contributionFunds },
      { metric: 'active_proposals', value: activeProposals }
    ];

    // Actualizar cada métrica
    for (const update of updates) {
      await db.execute(sql`
        INSERT INTO metrics_aggregates (metric_name, metric_value) 
        VALUES (${update.metric}, ${update.value})
        ON CONFLICT (metric_name) 
        DO UPDATE SET metric_value = ${update.value}
      `);
    }

    return NextResponse.json({
      success: true,
      message: 'Métricas agregadas actualizadas exitosamente',
      data: {
        totalUsers,
        activeUsers,
        membershipFunds,
        contributionFunds,
        totalFunds: membershipFunds + contributionFunds,
        activeProposals
      }
    });

  } catch (error) {
    console.error('Error updating aggregates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar métricas agregadas',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
