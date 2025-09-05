/**
 * Infrastructure Layer - Dependency Injection Container
 * Orquesta todas las dependencias siguiendo Clean Architecture
 */

import { 
  DrizzleUserRepository,
  DrizzlePaymentRepository,
  DrizzleMetricsRepository,
  MockMetricsAggregateRepository
} from './repositories';

import { 
  MockPasswordService,
  NextAuthSessionService,
  RedisCacheService 
} from './services';

import {
  RegisterUserAndProcessPaymentUseCase,
  GetMetricsUseCase,
  CheckUserExistsUseCase
} from '../application/use-cases';

// Container de dependencias
export class DIContainer {
  // Repositories
  private readonly userRepository = new DrizzleUserRepository();
  private readonly paymentRepository = new DrizzlePaymentRepository();
  private readonly metricsRepository = new DrizzleMetricsRepository();
  private readonly metricsAggregateRepository = new MockMetricsAggregateRepository();

  // Services
  private readonly passwordService = new MockPasswordService();
  private readonly sessionService = new NextAuthSessionService();
  private readonly cacheService = new RedisCacheService();

  // Use Cases
  private readonly registerUserUseCase = new RegisterUserAndProcessPaymentUseCase(
    this.userRepository,
    this.paymentRepository,
    this.passwordService,
    this.sessionService,
    this.cacheService
  );

  private readonly getMetricsUseCase = new GetMetricsUseCase(
    this.metricsAggregateRepository,
    this.metricsRepository
  );

  private readonly checkUserExistsUseCase = new CheckUserExistsUseCase(
    this.userRepository
  );

  // Public API para acceder a los use cases
  getRegisterUserUseCase() { return this.registerUserUseCase; }
  getGetMetricsUseCase() { return this.getMetricsUseCase; }
  getCheckUserExistsUseCase() { return this.checkUserExistsUseCase; }

  // Public API para acceder a repositorios (si es necesario)
  getUserRepository() { return this.userRepository; }
  getPaymentRepository() { return this.paymentRepository; }
  getMetricsRepository() { return this.metricsRepository; }
}

// Singleton del container
let containerInstance: DIContainer | null = null;

export function getContainer(): DIContainer {
  if (!containerInstance) {
    containerInstance = new DIContainer();
  }
  return containerInstance;
}

// Para testing - permite inyectar un container mock
export function setContainer(container: DIContainer): void {
  containerInstance = container;
}

export function resetContainer(): void {
  containerInstance = null;
}
