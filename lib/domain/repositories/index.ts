/**
 * Domain Layer - Repository Interfaces
 * Define contratos para acceso a datos sin depender de implementación
 */

import { User, UserId, Email, MembershipPayment } from '../entities';

export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  exists(email: Email): Promise<boolean>;
  count(): Promise<number>;
}

export interface PaymentRepository {
  save(payment: MembershipPayment): Promise<MembershipPayment>;
  findByUserId(userId: UserId): Promise<MembershipPayment[]>;
  getTotalRevenue(): Promise<number>;
}

export interface MetricsRepository {
  getTotalUsers(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getUsersCount(): Promise<number>;
  getPaymentsSum(): Promise<number>;
}

// Tipo para métricas agregadas
export interface AggregatedMetrics {
  totalUsers: number;
  totalAmount: number;
  lastUpdated: Date;
}

// Agregado para métricas optimizadas
export interface MetricsAggregateRepository {
  getAggregatedMetrics(): Promise<AggregatedMetrics | null>;
  updateAggregatedMetrics(metrics: Omit<AggregatedMetrics, 'lastUpdated'>): Promise<void>;
}
