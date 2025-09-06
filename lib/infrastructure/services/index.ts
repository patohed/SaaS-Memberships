/**
 * Infrastructure Layer - Service Implementations
 * Implementa servicios externos y de infraestructura
 */

import { User } from '../../domain/entities';
import { 
  PasswordService, 
  SessionService, 
  CacheService 
} from '../../application/use-cases';

// Implementación del servicio de contraseñas (simulada)
export class MockPasswordService implements PasswordService {
  async hash(password: string): Promise<string> {
    // Implementación simulada - en producción usar bcrypt
    return `hashed_${password}_${Date.now()}`;
  }

  // Función generateTemporary() eliminada - ahora usamos el email como contraseña temporal

  async verify(password: string, hash: string): Promise<boolean> {
    // Implementación simulada
    return hash.includes(password);
  }
}

// Implementación del servicio de sesión
export class NextAuthSessionService implements SessionService {
  async create(user: User): Promise<void> {
    // En una implementación real, aquí establecerías la sesión
    // Por ahora es un mock
    console.log(`Sesión creada para usuario: ${user.getEmail().getValue()}`);
  }

  async destroy(): Promise<void> {
    // Destruir sesión actual
    console.log('Sesión destruida');
  }

  async getCurrentUser(): Promise<User | null> {
    // Obtener usuario de la sesión actual
    // Por ahora retorna null (mock)
    return null;
  }
}

// Implementación del servicio de cache
export class RedisCacheService implements CacheService {
  async invalidateMetrics(): Promise<void> {
    // En una implementación real, invalidarías el cache de métricas
    console.log('Cache de métricas invalidado');
  }

  async get(key: string): Promise<string | null> {
    // Mock - siempre retorna null
    return null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    // Mock - no hace nada
    console.log(`Cache set: ${key} = ${value} (TTL: ${ttl})`);
  }

  async delete(key: string): Promise<void> {
    // Mock - no hace nada  
    console.log(`Cache deleted: ${key}`);
  }
}
