import { desc, and, eq, isNull, sum } from 'drizzle-orm';
import { db } from './drizzle';
import { users, membershipPayments } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

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
    currentAmount: Number(currentAmount)
  };
}
