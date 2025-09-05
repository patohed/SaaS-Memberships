#!/usr/bin/env node

/**
 * Script de configuración segura para Radio Community
 * Genera claves de seguridad y valida la configuración del entorno
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ENV_FILE = '.env';
const ENV_EXAMPLE = '.env.example';

console.log('🔐 Radio Community - Configuración Segura');
console.log('==========================================');

// Verificar si .env existe
if (!fs.existsSync(ENV_FILE)) {
  console.log('❌ Archivo .env no encontrado');
  console.log('📋 Copiando .env.example a .env...');
  
  if (fs.existsSync(ENV_EXAMPLE)) {
    fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
    console.log('✅ Archivo .env creado desde .env.example');
  } else {
    console.log('❌ Archivo .env.example no encontrado');
    process.exit(1);
  }
}

// Generar AUTH_SECRET seguro
function generateSecureSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// Leer y actualizar .env
let envContent = fs.readFileSync(ENV_FILE, 'utf8');

// Generar nuevo AUTH_SECRET si es necesario
const newSecret = generateSecureSecret();
console.log('🔑 Nuevo AUTH_SECRET generado:', newSecret.substring(0, 8) + '...');

// Reemplazar AUTH_SECRET en .env
envContent = envContent.replace(
  /AUTH_SECRET=.*/,
  `AUTH_SECRET=${newSecret}`
);

// Escribir .env actualizado
fs.writeFileSync(ENV_FILE, envContent);

console.log('✅ Configuración de seguridad completada');
console.log('');
console.log('⚠️  IMPORTANTE:');
console.log('   - Configura tu POSTGRES_URL con tus credenciales reales');
console.log('   - Nunca subas el archivo .env a Git');
console.log('   - En producción, usa variables de entorno del hosting');
console.log('');
console.log('🚀 Ejecuta: npm run dev para iniciar el servidor');
