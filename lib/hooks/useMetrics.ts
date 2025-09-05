'use client';

import { useState, useEffect } from 'react';
import { secureLog } from '@/lib/utils/secure-logger';

interface Metrics {
  totalUsers: number;
  activeUsers: number;
  totalFunds: number;
  dineroTotalRecaudado: number; // Dinero total entre TODOS los usuarios
  activeProposals: number;
  lastUpdated: string;
}

interface MetricsResponse {
  success: boolean;
  data?: Metrics;
  error?: string;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchMetrics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Disable cache to get fresh data
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: MetricsResponse = await response.json();

      if (result.success && result.data) {
        setMetrics(result.data);
        if (isRefresh) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (err) {
      secureLog.error('Error al obtener métricas', err);
      setError(err instanceof Error ? err.message : 'Error al cargar métricas');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics(false);
  }, []);

  // Función para refrescar manualmente
  const refreshMetrics = () => {
    fetchMetrics(true);
  };

  return { 
    metrics, 
    loading, 
    error, 
    isRefreshing,
    showSuccess,
    refreshMetrics 
  };
}
