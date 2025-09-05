# 🏗️ Clean Architecture Implementation

## Descripción

Este proyecto ha sido refactorizado siguiendo los principios de **Clean Architecture** de Robert C. Martin (Uncle Bob), implementando una separación clara de responsabilidades y manteniendo la independencia de frameworks, bases de datos y detalles externos.

## 📁 Estructura de Capas

```
lib/
├── domain/                    # 🎯 Capa de Dominio
│   ├── entities/             # Entidades de negocio y Value Objects
│   └── repositories/         # Interfaces de repositorios
├── application/              # 📋 Capa de Aplicación
│   └── use-cases/           # Casos de uso orquestando reglas de negocio
└── infrastructure/          # 🔧 Capa de Infraestructura
    ├── repositories/        # Implementaciones de repositorios
    ├── services/           # Servicios externos (password, cache, etc.)
    └── di-container.ts     # Contenedor de inyección de dependencias
```

## 🎯 Principios Implementados

### SOLID Principles

- **Single Responsibility**: Cada clase tiene una única responsabilidad bien definida
- **Open/Closed**: Extensible para nuevas funcionalidades sin modificar código existente
- **Liskov Substitution**: Las implementaciones pueden ser sustituidas sin romper el sistema
- **Interface Segregation**: Interfaces específicas en lugar de una interfaz monolítica
- **Dependency Inversion**: Dependemos de abstracciones, no de concreciones

### Clean Architecture Layers

1. **Entities** (Domain): Reglas de negocio más generales y estables
2. **Use Cases** (Application): Reglas de negocio específicas de la aplicación
3. **Interface Adapters** (Infrastructure): Adaptan datos entre use cases y frameworks
4. **Frameworks & Drivers** (Infrastructure): Detalles como DB, Web, etc.

## 🔧 Componentes Principales

### Domain Layer

#### Value Objects
```typescript
Email.create(email: string): Email
UserId.create(id: number): UserId  
MembershipAmount.create(): MembershipAmount
```

#### Entities
```typescript
User.create(params): User
MembershipPayment.create(params): MembershipPayment
```

#### Repository Interfaces
```typescript
UserRepository
PaymentRepository
MetricsRepository
MetricsAggregateRepository
```

### Application Layer

#### Use Cases
```typescript
RegisterUserAndProcessPaymentUseCase
GetMetricsUseCase
CheckUserExistsUseCase
```

#### DTOs
```typescript
RegisterUserDTO
UserRegistrationResult
MetricsDTO
```

### Infrastructure Layer

#### Repository Implementations
```typescript
DrizzleUserRepository implements UserRepository
DrizzlePaymentRepository implements PaymentRepository
DrizzleMetricsRepository implements MetricsRepository
```

#### Services
```typescript
MockPasswordService implements PasswordService
NextAuthSessionService implements SessionService
RedisCacheService implements CacheService
```

## 🚀 Uso

### Server Actions (Refactorizadas)

```typescript
// app/(dashboard)/participacion/actions-clean.ts
export async function procesarPagoSimulado(formData: FormData) {
  const container = getContainer();
  const registerUserUseCase = container.getRegisterUserUseCase();
  
  const result = await registerUserUseCase.execute(registerUserDTO);
  // ...
}
```

### Inyección de Dependencias

```typescript
import { getContainer } from '@/lib/infrastructure/di-container';

const container = getContainer();
const useCase = container.getRegisterUserUseCase();
```

## 🧪 Testing Strategy

### Unit Tests
- **Entities**: Validación de reglas de negocio
- **Value Objects**: Validación de invariantes
- **Use Cases**: Lógica de aplicación aislada

### Integration Tests
- **Repository Implementations**: Acceso a datos
- **Service Implementations**: Servicios externos

### Architectural Tests
- **Dependency Rules**: Verificar que las dependencias fluyan hacia adentro
- **Interface Compliance**: Verificar que las implementaciones cumplen los contratos

## 📈 Beneficios

### Mantenibilidad
- ✅ Separación clara de responsabilidades
- ✅ Código fácil de entender y modificar
- ✅ Menor acoplamiento entre componentes

### Testabilidad
- ✅ Mocking sencillo de dependencias
- ✅ Tests unitarios rápidos y aislados
- ✅ Tests de integración controlados

### Escalabilidad
- ✅ Fácil agregar nuevos use cases
- ✅ Cambio de tecnologías sin afectar la lógica de negocio
- ✅ Evolución independiente de las capas

### Seguridad
- ✅ Validación centralizada en el dominio
- ✅ Logging seguro a través de todas las capas
- ✅ Control de acceso en la capa de aplicación

## 🔄 Migración del Código Legacy

### Antes (Arquitectura Procedural)
```typescript
// ❌ Mezclaba infraestructura con lógica de negocio
export async function procesarPagoSimulado(formData: FormData) {
  // Validación manual
  // Acceso directo a DB
  // Lógica de negocio dispersa
  // Manejo de errores inconsistente
}
```

### Después (Clean Architecture)
```typescript
// ✅ Separación clara de responsabilidades
export async function procesarPagoSimulado(formData: FormData) {
  const dto = validateAndTransform(formData);
  const useCase = container.getRegisterUserUseCase();
  const result = await useCase.execute(dto);
  return transformResult(result);
}
```

## 📋 Próximos Pasos

1. **Agregar Tests Unitarios**
   - Tests para todas las entidades
   - Tests para todos los use cases
   - Tests de integración para repositorios

2. **Implementar Servicios Reales**
   - Bcrypt para passwords
   - Redis para cache
   - Autenticación real con NextAuth

3. **Expandir Use Cases**
   - Login de usuario
   - Gestión de propuestas
   - Sistema de votación
   - Contribuciones económicas

4. **Agregar Monitoreo**
   - Métricas de performance
   - Logging estructurado
   - Health checks

## 🔗 Referencias

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code principles](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)

---

> **Nota**: Esta implementación sigue fielmente los principios de Clean Architecture, priorizando la mantenibilidad, testabilidad y escalabilidad del código por encima de la simplicidad inicial.
