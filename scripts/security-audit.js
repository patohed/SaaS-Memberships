#!/usr/bin/env node

/**
 * Script de auditoría automática para Radio Community
 * Verifica vulnerabilidades y reporta el estado de seguridad
 */

const { execSync } = require('child_process');

console.log('🔍 Radio Community - Auditoría de Seguridad');
console.log('============================================');

async function runAudit() {
  try {
    console.log('📋 Verificando vulnerabilidades conocidas...');
    
    // Ejecutar auditoría de pnpm
    const auditResult = execSync('pnpm audit --audit-level=low --json', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const audit = JSON.parse(auditResult);
    
    if (audit.advisories && Object.keys(audit.advisories).length > 0) {
      console.log('❌ Vulnerabilidades encontradas:');
      
      Object.values(audit.advisories).forEach(advisory => {
        console.log(`   - ${advisory.title}`);
        console.log(`     Severidad: ${advisory.severity}`);
        console.log(`     Paquete: ${advisory.module_name}`);
        console.log(`     Versiones vulnerables: ${advisory.vulnerable_versions}`);
        console.log(`     Versiones parcheadas: ${advisory.patched_versions || 'N/A'}`);
        console.log('');
      });
      
      console.log('🔧 Ejecuta: pnpm update para intentar resolver');
      process.exit(1);
    } else {
      console.log('✅ No se encontraron vulnerabilidades conocidas');
    }
    
  } catch (error) {
    if (error.stdout && error.stdout.includes('No known vulnerabilities found')) {
      console.log('✅ No se encontraron vulnerabilidades conocidas');
    } else {
      console.log('❌ Error ejecutando auditoría:', error.message);
      process.exit(1);
    }
  }
  
  try {
    console.log('📦 Verificando dependencias desactualizadas...');
    
    const outdatedResult = execSync('pnpm outdated --format=json', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (outdatedResult.trim()) {
      const outdated = JSON.parse(outdatedResult);
      
      if (Object.keys(outdated).length > 0) {
        console.log('⚠️  Dependencias desactualizadas encontradas:');
        
        Object.entries(outdated).forEach(([pkg, info]) => {
          console.log(`   - ${pkg}: ${info.current} → ${info.latest}`);
        });
        
        console.log('');
        console.log('🔧 Ejecuta: pnpm update para actualizar');
      } else {
        console.log('✅ Todas las dependencias están actualizadas');
      }
    } else {
      console.log('✅ Todas las dependencias están actualizadas');
    }
    
  } catch (error) {
    console.log('ℹ️  No se pudo verificar dependencias desactualizadas');
  }
  
  console.log('');
  console.log('🛡️  Auditoría completada');
  console.log('   Para más información: npm run security:check');
}

runAudit();
