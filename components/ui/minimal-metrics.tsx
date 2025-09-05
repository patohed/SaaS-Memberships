/**
 * Minimal Metrics Component - Estilo buenastardeschina.com.ar
 * Diseño sobrio, una sola paleta de colores, animaciones sutiles
 */

'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface MetricsData {
  totalUsers: number;
  dineroTotalRecaudado: number;
  weeksRemaining: number;
}

interface MinimalMetricsProps {
  metrics: MetricsData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

// Hook para contador animado más suave
function useAnimatedCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    setIsAnimating(true);
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing más suave
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(target * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    const delay = Math.random() * 200; // Pequeño delay aleatorio
    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);
    
    return () => {
      clearTimeout(timer);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return { count, isAnimating };
}

// Loading dots simple
function LoadingDots() {
  return (
    <div className="flex space-x-1 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

// Componente de métrica individual minimalista
function MinimalMetricItem({ 
  value, 
  label, 
  loading, 
  error,
  prefix = "",
  suffix = "" 
}: {
  value: number;
  label: string;
  loading: boolean;
  error: boolean;
  prefix?: string;
  suffix?: string;
}) {
  const { count, isAnimating } = useAnimatedCounter(value, 1200);

  return (
    <div className="text-center">
      <div className="text-lg font-medium text-gray-900 mb-1">
        {loading ? (
          <LoadingDots />
        ) : error ? (
          <span className="text-gray-400">--</span>
        ) : (
          <span className={`${isAnimating ? 'text-gray-600' : 'text-gray-900'} transition-colors duration-300`}>
            {prefix}{count.toLocaleString()}{suffix}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

// Componente principal minimalista
export function MinimalMetrics({ metrics, loading, error, onRefresh }: MinimalMetricsProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleRefresh = () => {
    setLastUpdate(new Date());
    onRefresh();
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      {/* Header discreto */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          En vivo
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className={`
            text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200
            ${loading ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}
          `}
          title="Actualizar"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
      
      {/* Grid simple de 3 columnas */}
      <div className="grid grid-cols-3 gap-8 max-w-sm mx-auto">
        <MinimalMetricItem
          value={metrics?.totalUsers || 0}
          label="Miembros"
          loading={loading}
          error={!!error}
        />
        
        <MinimalMetricItem
          value={metrics?.weeksRemaining || 18}
          label="Semanas"
          loading={false}
          error={false}
        />
        
        <MinimalMetricItem
          value={metrics?.dineroTotalRecaudado || 0}
          label="Recaudado"
          loading={loading}
          error={!!error}
          prefix="$"
        />
      </div>

      {/* Error state muy discreto */}
      {error && (
        <div className="mt-4 text-center">
          <button
            onClick={handleRefresh}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Timestamp muy pequeño */}
      <div className="mt-4 text-center text-xs text-gray-300">
        {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
}
