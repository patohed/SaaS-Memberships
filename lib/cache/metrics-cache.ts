// Cache inteligente para métricas - Optimizado para producción
// Evita recalcular constantemente en aplicaciones con alto tráfico

let metricsCache: {
  data: any;
  timestamp: number;
  ttl: number;
} | null = null;

// TTL: 5 minutos para datos que no cambian constantemente
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos en ms

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
}

// Hook para invalidar cache cuando hay nuevas transacciones
export function invalidateCacheOnPayment() {
  // Llamar esta función después de pagos completados
  invalidateCache();
}
