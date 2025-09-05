#!/usr/bin/env node

/**
 * Script para limpiar logs de producción en Radio Community
 * Reemplaza console.log inseguros con logger seguro
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Radio Community - Limpieza de Logs de Producción');
console.log('================================================');

// Archivos a procesar (excluyendo node_modules)
const filesToProcess = [
  'app/(dashboard)/participacion/actions.ts',
  'lib/db/queries.ts',
  'app/api/metrics/route.ts',
  'lib/hooks/useMetrics.ts',
  'middleware.ts'
];

// Patrones de reemplazo
const replacements = [
  // console.log básicos
  {
    pattern: /console\.log\('🚀 Iniciando[^']*'\)/g,
    replacement: "secureLog.payment('Iniciando procesamiento')"
  },
  {
    pattern: /console\.log\('📝 Datos recibidos:'[^)]*\)/g,
    replacement: "secureLog.debug('Datos recibidos', data)"
  },
  {
    pattern: /console\.log\('❌[^']*'\)/g,
    replacement: "secureLog.warn('Error en validación')"
  },
  {
    pattern: /console\.log\('✅[^']*'\)/g,
    replacement: "secureLog.info('Operación exitosa')"
  },
  {
    pattern: /console\.log\('⏳[^']*'\)/g,
    replacement: "secureLog.debug('Procesando operación')"
  },
  {
    pattern: /console\.log\('🔍[^']*'\)/g,
    replacement: "secureLog.debug('Verificando datos')"
  },
  {
    pattern: /console\.log\('🔐[^']*'\)/g,
    replacement: "secureLog.auth('Generando credenciales')"
  },
  {
    pattern: /console\.log\('👤[^']*'\)/g,
    replacement: "secureLog.info('Creando usuario')"
  },
  {
    pattern: /console\.log\('💳[^']*'\)/g,
    replacement: "secureLog.payment('Procesando pago')"
  },
  {
    pattern: /console\.log\('🔑[^']*'\)/g,
    replacement: "secureLog.auth('Estableciendo sesión')"
  },
  {
    pattern: /console\.log\('🎉[^']*'\)/g,
    replacement: "secureLog.info('Operación completada')"
  },
  
  // console.error
  {
    pattern: /console\.error\('💥[^']*'[^)]*\)/g,
    replacement: "secureLog.error('Error en operación', error)"
  },
  {
    pattern: /console\.error\('⚠️[^']*'[^)]*\)/g,
    replacement: "secureLog.warn('Advertencia en operación', error)"
  },
  {
    pattern: /console\.error\('Error[^']*'[^)]*\)/g,
    replacement: "secureLog.error('Error interno', error)"
  },

  // Logs específicos de queries
  {
    pattern: /console\.log\('✅ Usando métricas agregadas[^']*'\)/g,
    replacement: "secureLog.debug('Usando métricas optimizadas')"
  },
  {
    pattern: /console\.log\('🔄 Usando queries tradicionales[^']*'\)/g,
    replacement: "secureLog.info('Usando queries tradicionales')"
  }
];

// Función para verificar si el archivo ya tiene el import
function hasSecureLogImport(content) {
  return content.includes("import { secureLog }") || content.includes("from '@/lib/utils/secure-logger'");
}

// Función para agregar import si no existe
function addSecureLogImport(content) {
  if (hasSecureLogImport(content)) {
    return content;
  }

  // Buscar la línea donde agregar el import
  const lines = content.split('\n');
  let insertIndex = 0;

  // Buscar después de los imports existentes
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].startsWith("import {")) {
      insertIndex = i + 1;
    } else if (lines[i].trim() === '' && insertIndex > 0) {
      break;
    }
  }

  lines.splice(insertIndex, 0, "import { secureLog } from '@/lib/utils/secure-logger';");
  return lines.join('\n');
}

// Procesar archivos
let totalReplacements = 0;

filesToProcess.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  Saltando: ${filePath} (no existe)`);
    return;
  }

  console.log(`🔍 Procesando: ${filePath}`);
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let fileReplacements = 0;

  // Aplicar reemplazos
  replacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      fileReplacements += matches.length;
    }
  });

  if (fileReplacements > 0) {
    // Agregar import si se hicieron reemplazos
    content = addSecureLogImport(content);
    
    // Guardar archivo
    fs.writeFileSync(fullPath, content);
    console.log(`   ✅ ${fileReplacements} reemplazos aplicados`);
    totalReplacements += fileReplacements;
  } else {
    console.log(`   ✅ Sin cambios necesarios`);
  }
});

console.log('');
console.log(`🎉 Limpieza completada: ${totalReplacements} logs reemplazados`);
console.log('');
console.log('📋 Beneficios aplicados:');
console.log('   - Logs sanitizados automáticamente');
console.log('   - Información sensible protegida');
console.log('   - Logs de producción controlados');
console.log('   - Mejor debugging en desarrollo');
