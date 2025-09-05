'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { secureLog } from '@/lib/utils/secure-logger';

interface Metrics {
  totalUsers: number;
  activeUsers: number;
  totalFunds: number;
  dineroTotalRecaudado: number;
  activeProposals: number;
  lastUpdated: string;
}

interface MetricsResponse {
  success: boolean;
  data?: Metrics;
  error?: string;
}

interface UseMetricsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // en milisegundos
  pauseOnHidden?: boolean; // pausar cuando la pestaña no es visible
  maxRetries?: number;
  minInterval?: number; // intervalo mínimo entre requests
}

/**
 * Hook optimizado para métricas que evita sobrecarga innecesaria
 * 
 * Características de optimización:
 * - Intervalo por defecto de 2 minutos (vs 30 segundos)
 * - Pausa automática cuando la pestaña no es visible
 * - Previene requests duplicados con debouncing
 * - Retry con backoff exponencial
 * - Actualización inteligente al volver a ser visible
 */
export function useMetrics(options: UseMetricsOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 2 * 60 * 1000, // 2 minutos por defecto (más conservador que 30s)
    pauseOnHidden = true,
    maxRetries = 3,
    minInterval = 10 * 1000 // 10 segundos mínimo entre requests
  } = options;

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTabVisible = useRef(true);
  const lastFetchTime = useRef<number>(0);
  const fetchAbortController = useRef<AbortController | null>(null);

  const fetchMetrics = useCallback(async (isRefresh = false, force = false) => {
    // Evitar fetch duplicados
    const now = Date.now();
    if (!force && now - lastFetchTime.current < minInterval) {
      secureLog.info('Fetch metrics bloqueado - muy pronto desde el último request');
      return;
    }

    // Si la pestaña no es visible y no es un refresh manual, no hacer fetch
    if (pauseOnHidden && !isTabVisible.current && !isRefresh) {
      secureLog.info('Fetch metrics omitido - pestaña no visible');
      return;
    }

    // Cancelar request anterior si existe
    if (fetchAbortController.current) {
      fetchAbortController.current.abort();
    }

    fetchAbortController.current = new AbortController();

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      lastFetchTime.current = now;

      const response = await fetch('/api/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: fetchAbortController.current.signal
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: MetricsResponse = await response.json();

      if (result.success && result.data) {
        setMetrics(result.data);
        setRetryCount(0); // Reset retry count on success
        if (isRefresh) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
        secureLog.info('Métricas actualizadas exitosamente');
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (err) {
      // Ignorar errores de abort
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      secureLog.error('Error al obtener métricas', err);
      setError(err instanceof Error ? err.message : 'Error al cargar métricas');
      
      // Retry logic con backoff exponencial solo si no es un abort
      if (retryCount < maxRetries && !isRefresh) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, 8s...
        secureLog.info(`Reintentando en ${retryDelay}ms (intento ${retryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMetrics(false, true);
        }, retryDelay);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      fetchAbortController.current = null;
    }
  }, [pauseOnHidden, maxRetries, retryCount, minInterval]);

  // Función para refresh manual
  const refreshMetrics = useCallback(() => {
    fetchMetrics(true, true);
  }, [fetchMetrics]);

  // Detectar visibilidad de la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasVisible = isTabVisible.current;
      isTabVisible.current = !document.hidden;
      
      secureLog.info(`Pestaña ${isTabVisible.current ? 'visible' : 'oculta'}`);
      
      // Si la pestaña vuelve a ser visible después de estar oculta
      // y han pasado más de 5 minutos, actualizar métricas
      if (!wasVisible && isTabVisible.current) {
        const timeSinceLastFetch = Date.now() - lastFetchTime.current;
        if (timeSinceLastFetch > 5 * 60 * 1000) { // 5 minutos
          secureLog.info('Actualizando métricas - pestaña visible después de 5+ minutos');
          fetchMetrics(false, true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchMetrics]);

  // Setup del intervalo inteligente
  useEffect(() => {
    // Primera carga
    fetchMetrics();

    if (autoRefresh) {
      secureLog.info(`Configurando auto-refresh cada ${refreshInterval / 1000} segundos`);
      intervalRef.current = setInterval(() => {
        fetchMetrics();
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        secureLog.info('Auto-refresh desactivado');
      }
      if (fetchAbortController.current) {
        fetchAbortController.current.abort();
      }
    };
  }, [autoRefresh, refreshInterval, fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    isRefreshing,
    showSuccess,
    refreshMetrics,
    retryCount,
    // Información de debugging
    lastFetchTime: lastFetchTime.current,
    isTabVisible: isTabVisible.current
  };
}

// Hook simplificado para casos donde no se necesita auto-refresh
export function useMetricsStatic() {
  return useMetrics({
    autoRefresh: false,
    pauseOnHidden: false
  });
}

// Hook para casos críticos donde se necesita actualización frecuente
export function useMetricsRealTime() {
  return useMetrics({
    autoRefresh: true,
    refreshInterval: 30 * 1000, // 30 segundos
    pauseOnHidden: true,
    maxRetries: 5,
    minInterval: 5 * 1000 // 5 segundos mínimo
  });
}
