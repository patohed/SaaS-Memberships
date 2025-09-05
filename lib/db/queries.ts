import { desc, and, eq, isNull, sum } from 'drizzle-orm';
import { db } from './drizzle';
import { users, membershipPayments, proposals, contributions } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { secureLog } from '@/lib/utils/secure-logger';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  // Obtener el monto total pagado por el usuario
  const paymentResult = await db
    .select({ totalAmount: sum(membershipPayments.amount) })
    .from(membershipPayments)
    .where(
      and(
        eq(membershipPayments.userId, sessionData.user.id),
        eq(membershipPayments.status, 'completed')
      )
    );

  const currentAmount = paymentResult[0]?.totalAmount || 0;

  return {
    ...user[0],
    currentAmount: Number(currentAmount), // En centavos
    dineroDonado: Math.round(Number(currentAmount) / 100) // En dólares para mostrar
  };
}

// Función para obtener métricas generales de la plataforma - OPTIMIZADA PARA ESCALA
export async function getMetrics() {
  try {
    // OPTIMIZACIÓN: Intentar usar métricas agregadas primero (ULTRA RÁPIDO)
    try {
      const aggregatesResult = await db.execute(`
        SELECT metric_name, metric_value 
        FROM metrics_aggregates
      `);

      if (aggregatesResult && aggregatesResult.length > 0) {
        const metrics = aggregatesResult.reduce((acc: Record<string, number>, row: any) => {
          acc[row.metric_name] = Number(row.metric_value);
          return acc;
        }, {} as Record<string, number>);

        const totalFunds = (metrics.total_funds_cents || 0);
        const membershipFunds = (metrics.membership_funds_cents || 0);
        const contributionFunds = (metrics.contribution_funds_cents || 0);

        secureLog.info('Operación exitosa');
        return {
          totalUsers: metrics.total_users || 0,
          activeUsers: metrics.active_users || 0,
          totalFunds: Math.round(totalFunds / 100),
          dineroTotalRecaudado: Math.round(totalFunds / 100),
          membershipFunds: Math.round(membershipFunds / 100),
          contributionFunds: Math.round(contributionFunds / 100),
          activeProposals: metrics.active_proposals || 0,
          lastUpdated: new Date().toISOString(),
          source: 'aggregated'
        };
      }
    } catch (aggregateError) {
      console.warn('⚠️ Tabla de métricas agregadas no disponible, usando queries tradicionales');
    }

    // FALLBACK: Queries tradicionales (para desarrollo o mientras se migra)
    secureLog.info('Usando queries tradicionales');
    
    // 1. Contar usuarios registrados totales (excluir eliminados)
    const totalUsersResult = await db
      .select({ count: users.id })
      .from(users)
      .where(isNull(users.deletedAt));
    
    const totalUsers = totalUsersResult.length;

    // 2. Contar usuarios activos (con membresía pagada)
    const activeUsersResult = await db
      .select({ count: users.id })
      .from(users)
      .where(
        and(
          isNull(users.deletedAt),
          eq(users.membershipStatus, 'active')
        )
      );
    
    const activeUsers = activeUsersResult.length;

    // 3. Calcular fondos totales recaudados (pagos + contribuciones completados)
    
    // 3. Calcular fondos totales recaudados - OPTIMIZADO para escala
    // Ejecutar queries en paralelo para mejor performance
    const [membershipFundsResult, contributionFundsResult] = await Promise.all([
      // 3a. Fondos de membresías (pago único $18 por usuario)
      db
        .select({ total: sum(membershipPayments.amount) })
        .from(membershipPayments)
        .where(eq(membershipPayments.status, 'completed')),
      
      // 3b. Contribuciones adicionales a propuestas
      db
        .select({ total: sum(contributions.amount) })
        .from(contributions)
        .where(eq(contributions.status, 'completed'))
    ]);
    
    const membershipFunds = Number(membershipFundsResult[0]?.total || 0);
    const contributionFunds = Number(contributionFundsResult[0]?.total || 0);

    // 3c. Total combinado
    const totalFunds = membershipFunds + contributionFunds;

    // 4. Contar propuestas activas
    const activeProposalsResult = await db
      .select({ count: proposals.id })
      .from(proposals)
      .where(eq(proposals.status, 'active'));
    
    const activeProposals = activeProposalsResult.length;

    return {
      totalUsers,
      activeUsers,
      totalFunds: Math.round(totalFunds / 100), // Total en dólares de todos los usuarios
      dineroTotalRecaudado: Math.round(totalFunds / 100), // Alias más claro - dinero total entre TODOS
      membershipFunds: Math.round(membershipFunds / 100), // Desglose para debugging
      contributionFunds: Math.round(contributionFunds / 100), // Desglose para debugging
      activeProposals,
      lastUpdated: new Date().toISOString(),
      source: 'calculated' // Método tradicional - considera migrar a aggregated
    };
  } catch (error) {
    secureLog.error('Error interno', error);
    throw new Error('Error al obtener métricas de la base de datos');
  }
}
