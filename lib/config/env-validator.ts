/**
 * Validador de configuración de entorno para Radio Community
 * Verifica que todas las variables críticas estén configuradas
 */

const requiredEnvVars = [
  'POSTGRES_URL',
  'AUTH_SECRET',
  'BASE_URL'
];

const optionalEnvVars = [
  'MERCADOPAGO_ACCESS_TOKEN',
  'MERCADOPAGO_PUBLIC_KEY',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET'
];

export function validateEnvironment(): void {
  console.log('🔍 Validando configuración de entorno...');
  
  const missing: string[] = [];
  const weak: string[] = [];
  
  // Verificar variables requeridas
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    
    if (!value) {
      missing.push(envVar);
    } else if (envVar === 'AUTH_SECRET') {
      // Verificar fortaleza del AUTH_SECRET
      if (value.length < 32) {
        weak.push(`${envVar} (muy corto, mínimo 32 caracteres)`);
      } else if (value === 'your-secret-key-here' || value.includes('placeholder')) {
        weak.push(`${envVar} (usando valor por defecto inseguro)`);
      }
    } else if (envVar === 'POSTGRES_URL') {
      // Verificar que no sea placeholder
      if (value.includes('username:password') || value.includes('your-')) {
        weak.push(`${envVar} (usando valor placeholder)`);
      }
    }
  }
  
  // Reportar resultados
  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:');
    missing.forEach(env => console.error(`   - ${env}`));
    process.exit(1);
  }
  
  if (weak.length > 0) {
    console.warn('⚠️  Variables de entorno con configuración débil:');
    weak.forEach(env => console.warn(`   - ${env}`));
    console.warn('   Ejecuta: npm run setup:security para corregir');
  }
  
  console.log('✅ Configuración de entorno válida');
  
  // Mostrar variables opcionales no configuradas
  const unconfiguredOptional = optionalEnvVars.filter(env => !process.env[env]);
  if (unconfiguredOptional.length > 0) {
    console.log('ℹ️  Variables opcionales no configuradas:');
    unconfiguredOptional.forEach(env => console.log(`   - ${env}`));
  }
}
