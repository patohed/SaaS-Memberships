/**
 * Infrastructure Layer - Repository Implementations
 * Implementa las interfaces del dominio usando tecnologías específicas
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../../db/drizzle';
import { 
  users, 
  membershipPayments
} from '../../db/schema';
import { 
  User, 
  Email, 
  UserId, 
  MembershipPayment,
  MembershipAmount 
} from '../../domain/entities';
import {
  UserRepository,
  PaymentRepository,
  MetricsRepository,
  MetricsAggregateRepository,
  AggregatedMetrics
} from '../../domain/repositories';

// Implementación del repositorio de usuarios
export class DrizzleUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const userData = {
      name: user.getNombre() + ' ' + user.getApellido(), // El schema usa "name" simple
      email: user.getEmail().getValue(),
      passwordHash: user.getPasswordHash()
    };

    const [insertedUser] = await db
      .insert(users)
      .values(userData)
      .returning();

    return User.fromPersistence({
      id: insertedUser.id,
      nombre: user.getNombre(),
      apellido: user.getApellido(),
      email: insertedUser.email,
      telefono: user.getTelefono(),
      codigoPais: user.getCodigoPais(),
      passwordHash: insertedUser.passwordHash,
      createdAt: insertedUser.createdAt
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email.getValue()))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const userData = result[0];
    const [nombre, ...apellidoParts] = userData.name.split(' ');
    const apellido = apellidoParts.join(' ') || '';

    return User.fromPersistence({
      id: userData.id,
      nombre,
      apellido,
      email: userData.email,
      telefono: '', // No está en el schema actual
      codigoPais: '', // No está en el schema actual
      passwordHash: userData.passwordHash,
      createdAt: userData.createdAt
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id.getValue()))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const userData = result[0];
    const [nombre, ...apellidoParts] = userData.name.split(' ');
    const apellido = apellidoParts.join(' ') || '';

    return User.fromPersistence({
      id: userData.id,
      nombre,
      apellido,
      email: userData.email,
      telefono: '', // No está en el schema actual
      codigoPais: '', // No está en el schema actual
      passwordHash: userData.passwordHash,
      createdAt: userData.createdAt
    });
  }

  async exists(email: Email): Promise<boolean> {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.getValue()))
      .limit(1);

    return result.length > 0;
  }

  async count(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    return result[0]?.count || 0;
  }
}

// Implementación del repositorio de pagos
export class DrizzlePaymentRepository implements PaymentRepository {
  async save(payment: MembershipPayment): Promise<MembershipPayment> {
    const paymentData = {
      userId: payment.getUserId().getValue(),
      amount: payment.getAmount().getValue(),
      paymentMethod: payment.getMetodoPago(),
      status: payment.getStatus()
    };

    const [insertedPayment] = await db
      .insert(membershipPayments)
      .values(paymentData)
      .returning();

    return MembershipPayment.restore({
      id: insertedPayment.id,
      userId: insertedPayment.userId,
      amount: insertedPayment.amount,
      metodoPago: insertedPayment.paymentMethod,
      status: insertedPayment.status,
      createdAt: insertedPayment.createdAt
    });
  }

  async findByUserId(userId: UserId): Promise<MembershipPayment[]> {
    const result = await db
      .select()
      .from(membershipPayments)
      .where(eq(membershipPayments.userId, userId.getValue()));

    return result.map((payment) => 
      MembershipPayment.restore({
        id: payment.id,
        userId: payment.userId,
        amount: payment.amount,
        metodoPago: payment.paymentMethod,
        status: payment.status,
        createdAt: payment.createdAt
      })
    );
  }

  async getTotalRevenue(): Promise<number> {
    const result = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(${membershipPayments.amount}), 0)` 
      })
      .from(membershipPayments)
      .where(eq(membershipPayments.status, 'completed'));

    return result[0]?.total || 0;
  }
}

// Implementación del repositorio de métricas
export class DrizzleMetricsRepository implements MetricsRepository {
  async getTotalUsers(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    return result[0]?.count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(${membershipPayments.amount}), 0)` 
      })
      .from(membershipPayments)
      .where(eq(membershipPayments.status, 'completed'));

    return result[0]?.total || 0;
  }

  async getUsersCount(): Promise<number> {
    return this.getTotalUsers();
  }

  async getPaymentsSum(): Promise<number> {
    return this.getTotalRevenue();
  }
}

// Mock implementation para métricas agregadas (no implementado en DB aún)
export class MockMetricsAggregateRepository implements MetricsAggregateRepository {
  async getAggregatedMetrics(): Promise<AggregatedMetrics | null> {
    // Siempre retorna null para forzar el uso de consultas tradicionales
    return null;
  }

  async updateAggregatedMetrics(metrics: Omit<AggregatedMetrics, 'lastUpdated'>): Promise<void> {
    // No hace nada - implementación futura
    console.log('Mock: updateAggregatedMetrics called with:', metrics);
  }
}
