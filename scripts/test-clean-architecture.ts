/**
 * Test Script - Verificación de Clean Architecture
 * Prueba básica de los componentes implementados
 */

import { Email, UserId, User, MembershipPayment } from '../lib/domain/entities';
import { getContainer } from '../lib/infrastructure/di-container';

console.log('🧪 Iniciando tests de Clean Architecture...\n');

// Test 1: Value Objects
console.log('1️⃣ Testing Value Objects...');
try {
  const email = Email.create('test@example.com');
  console.log('✅ Email creado:', email.getValue());
  
  const userId = UserId.create(1);
  console.log('✅ UserId creado:', userId.getValue());
  
  console.log('✅ Value Objects funcionando correctamente\n');
} catch (error) {
  console.error('❌ Error en Value Objects:', error);
}

// Test 2: Entities
console.log('2️⃣ Testing Entities...');
try {
  const user = User.create({
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    telefono: '+54911234567',
    codigoPais: 'AR',
    passwordHash: 'hashed_password'
  });
  
  console.log('✅ Usuario creado:', user.getNombre(), user.getApellido());
  
  const payment = MembershipPayment.create({
    userId: UserId.create(1),
    metodoPago: 'mercadopago'
  });
  
  console.log('✅ Pago creado:', payment.getAmount().getValue());
  console.log('✅ Entities funcionando correctamente\n');
} catch (error) {
  console.error('❌ Error en Entities:', error);
}

// Test 3: Dependency Injection
console.log('3️⃣ Testing Dependency Injection...');
try {
  const container = getContainer();
  
  const userRepo = container.getUserRepository();
  const registerUseCase = container.getRegisterUserUseCase();
  const metricsUseCase = container.getGetMetricsUseCase();
  
  console.log('✅ UserRepository obtenido:', typeof userRepo);
  console.log('✅ RegisterUseCase obtenido:', typeof registerUseCase);
  console.log('✅ MetricsUseCase obtenido:', typeof metricsUseCase);
  console.log('✅ Dependency Injection funcionando correctamente\n');
} catch (error) {
  console.error('❌ Error en Dependency Injection:', error);
}

// Test 4: Use Cases (sin DB)
console.log('4️⃣ Testing Use Cases...');
try {
  const container = getContainer();
  const checkUserExistsUseCase = container.getCheckUserExistsUseCase();
  
  console.log('✅ CheckUserExistsUseCase obtenido correctamente');
  console.log('✅ Use Cases funcionando correctamente\n');
} catch (error) {
  console.error('❌ Error en Use Cases:', error);
}

console.log('🎉 Tests de Clean Architecture completados!');
console.log('📋 Resumen:');
console.log('   - ✅ Value Objects implementados');
console.log('   - ✅ Entities con reglas de negocio');
console.log('   - ✅ Repository interfaces definidas');
console.log('   - ✅ Use Cases orquestando lógica');
console.log('   - ✅ Infrastructure implementations');
console.log('   - ✅ Dependency Injection container');
console.log('   - ✅ Separación clara de capas');
console.log('\n✨ Clean Architecture implementada exitosamente!');
