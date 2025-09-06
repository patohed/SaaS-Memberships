import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

/**
 * Función para actualizar las métricas agregadas
 * Puede ser llamada directamente desde cualquier parte del código
 */
export async function updateMetricsAggregates(): Promise<{
  totalUsers: number;
  activeUsers: number;
  membershipFunds: number;
  contributionFunds: number;
  totalFunds: number;
  activeProposals: number;
}> {
  try {
    console.log('🔄 [METRICS] Actualizando métricas agregadas...');

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

    // 4. Sumar fondos de contribuciones
    const contributionFundsResult = await db.execute(sql`
      SELECT COALESCE(SUM(current_amount), 0) as contribution_funds
      FROM proposals 
      WHERE status = 'active'
    `);
    const contributionFunds = Number(contributionFundsResult[0]?.contribution_funds) || 0;

    // 5. Contar propuestas activas
    const activeProposalsResult = await db.execute(sql`
      SELECT COUNT(*) as active_proposals
      FROM proposals 
      WHERE status = 'active'
    `);
    const activeProposals = Number(activeProposalsResult[0]?.active_proposals) || 0;

    // Calcular total de fondos
    const totalFunds = membershipFunds + contributionFunds;

    // Actualizar tabla de métricas agregadas
    const updates = [
      { metric: 'total_users', value: totalUsers },
      { metric: 'active_users', value: activeUsers },
      { metric: 'membership_funds_cents', value: membershipFunds },
      { metric: 'contribution_funds_cents', value: contributionFunds },
      { metric: 'total_funds_cents', value: totalFunds },
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

    console.log('✅ [METRICS] Métricas agregadas actualizadas exitosamente:', {
      totalUsers,
      activeUsers,
      membershipFunds: membershipFunds / 100, // Mostrar en USD
      contributionFunds: contributionFunds / 100,
      totalFunds: totalFunds / 100,
      activeProposals
    });

    return {
      totalUsers,
      activeUsers,
      membershipFunds,
      contributionFunds,
      totalFunds,
      activeProposals
    };

  } catch (error) {
    console.error('❌ [METRICS] Error actualizando métricas agregadas:', error);
    throw error;
  }
}
