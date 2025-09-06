/**
 * Application Layer - Use Cases
 * Orquesta las reglas de negocio y coordina entidades
 */

import { User, Email, UserId, MembershipPayment } from '../../domain/entities';
import { 
  UserRepository, 
  PaymentRepository, 
  MetricsRepository,
  MetricsAggregateRepository 
} from '../../domain/repositories';

// Error personalizado para casos de uso
export class UseCaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'UseCaseError';
  }
}

// DTO para registro de usuario
export interface RegisterUserDTO {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  codigoPais: string;
  metodoPago: string;
}

// DTO para respuesta
export interface UserRegistrationResult {
  user: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  temporaryPassword: string;
  payment: {
    amount: number;
    method: string;
    status: string;
  };
}

// Servicios de dominio
export interface PasswordService {
  hash(password: string): Promise<string>;
  // generateTemporary() eliminada - ahora usamos el email como contraseña temporal
}

export interface SessionService {
  create(user: User): Promise<void>;
}

export interface CacheService {
  invalidateMetrics(): Promise<void>;
}

// Use Case: Registrar Usuario y Procesar Pago
export class RegisterUserAndProcessPaymentUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly cacheService: CacheService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<UserRegistrationResult> {
    // 1. Validar que el email no existe
    const email = Email.create(dto.email);
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw new UseCaseError(
        'El email ya está registrado',
        'EMAIL_ALREADY_EXISTS',
        409
      );
    }

    // 2. Usar email como contraseña temporal (más simple)
    const temporaryPassword = dto.email; // Email como contraseña
    const passwordHash = await this.passwordService.hash(temporaryPassword);

    // 3. Crear entidad de usuario
    const user = User.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      telefono: dto.telefono,
      codigoPais: dto.codigoPais,
      passwordHash
    });

    // 4. Guardar usuario
    const savedUser = await this.userRepository.save(user);
    const userId = savedUser.getId();
    
    if (!userId) {
      throw new UseCaseError(
        'Error al crear usuario',
        'USER_CREATION_FAILED',
        500
      );
    }

    // 5. Crear pago
    const payment = MembershipPayment.create({
      userId,
      metodoPago: dto.metodoPago
    });

    // 6. Procesar pago (simulado)
    const completedPayment = payment.markAsCompleted();
    await this.paymentRepository.save(completedPayment);

    // 7. Establecer sesión
    await this.sessionService.create(savedUser);

    // 8. Invalidar cache de métricas
    await this.cacheService.invalidateMetrics();

    // 9. Retornar resultado
    return {
      user: {
        id: userId.getValue(),
        nombre: savedUser.getNombre(),
        apellido: savedUser.getApellido(),
        email: savedUser.getEmail().getValue()
      },
      temporaryPassword,
      payment: {
        amount: completedPayment.getAmount().getValue(),
        method: completedPayment.getMetodoPago(),
        status: completedPayment.getStatus()
      }
    };
  }
}

// Use Case: Obtener Métricas
export interface MetricsDTO {
  totalUsers: number;
  totalAmount: number;
  weeksRemaining: number;
}

export class GetMetricsUseCase {
  constructor(
    private readonly metricsAggregateRepository: MetricsAggregateRepository,
    private readonly metricsRepository: MetricsRepository
  ) {}

  async execute(): Promise<MetricsDTO> {
    try {
      // Intentar obtener métricas agregadas (O(1))
      const aggregatedMetrics = await this.metricsAggregateRepository.getAggregatedMetrics();
      
      if (aggregatedMetrics) {
        return {
          totalUsers: aggregatedMetrics.totalUsers,
          totalAmount: aggregatedMetrics.totalAmount,
          weeksRemaining: 18 // Constante del negocio
        };
      }

      // Fallback a consultas tradicionales (O(n))
      const [totalUsers, totalAmount] = await Promise.all([
        this.metricsRepository.getTotalUsers(),
        this.metricsRepository.getTotalRevenue()
      ]);

      return {
        totalUsers,
        totalAmount,
        weeksRemaining: 18
      };
    } catch (error) {
      throw new UseCaseError(
        'Error al obtener métricas',
        'METRICS_FETCH_FAILED',
        500
      );
    }
  }
}

// Use Case: Validar Usuario Existente
export class CheckUserExistsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<boolean> {
    const emailVO = Email.create(email);
    return await this.userRepository.exists(emailVO);
  }
}
