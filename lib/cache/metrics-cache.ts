// Cache inteligente para métricas - Optimizado para producción
// Evita recalcular constantemente en aplicaciones con alto tráfico

let metricsCache: {
  data: any;
  timestamp: number;
  ttl: number;
} | null = null;

// TTL: 2 minutos para mejor responsividad en producción
const CACHE_TTL = 2 * 60 * 1000; // 2 minutos en ms

export function isCacheValid(): boolean {
  if (!metricsCache) return false;
  
  const now = Date.now();
  return (now - metricsCache.timestamp) < metricsCache.ttl;
}

export function getCachedMetrics() {
  if (isCacheValid() && metricsCache?.data) {
    return {
      ...metricsCache.data,
      fromCache: true,
      cacheAge: Math.round((Date.now() - metricsCache.timestamp) / 1000)
    };
  }
  return null;
}

export function setCachedMetrics(data: any) {
  metricsCache = {
    data: { ...data, fromCache: false },
    timestamp: Date.now(),
    ttl: CACHE_TTL
  };
}

export function invalidateCache() {
  metricsCache = null;
  console.log('🗑️ Cache de métricas invalidado manualmente');
}

// Hook para invalidar cache cuando hay nuevas transacciones
export function invalidateCacheOnPayment() {
  // Llamar esta función después de pagos completados
  invalidateCache();
  console.log('💳 Cache invalidado por nuevo pago/registro');
}

// Función para forzar invalidación en caso de problemas
export function forceRefreshMetrics() {
  invalidateCache();
  // En caso de usar con fetch, podríamos agregar cache-busting
  const timestamp = Date.now();
  return timestamp;
}
