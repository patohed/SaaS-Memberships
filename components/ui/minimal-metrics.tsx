/**
 * Minimal Metrics Component - Diseño mejorado con números rojos y textos negros
 * Versión visual más atractiva y moderna
 */

'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';

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

// Hook para contador animado más suave y atractivo
function useAnimatedCounter(target: number, duration: number = 2000) {
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
      
      // Easing más dramático para mejor efecto visual
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(target * easeOutExpo));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    const delay = Math.random() * 300; // Delay aleatorio para efecto staggered
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

// Loading dots con color rojo
function LoadingDots() {
  return (
    <div className="flex space-x-1 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// Componente de métrica individual con diseño atractivo
function AttractiveMetricItem({ 
  icon,
  value, 
  label, 
  loading, 
  error,
  prefix = "",
  suffix = "",
  description = ""
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  loading: boolean;
  error: boolean;
  prefix?: string;
  suffix?: string;
  description?: string;
}) {
  const { count, isAnimating } = useAnimatedCounter(value, 1800);

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200">
      {/* Icono con fondo de color */}
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
          <div className="text-red-500 group-hover:text-red-600 transition-colors duration-300">
            {icon}
          </div>
        </div>
      </div>

      {/* Número principal */}
      <div className="text-center mb-3">
        {loading ? (
          <div className="h-12 flex items-center justify-center">
            <LoadingDots />
          </div>
        ) : error ? (
          <span className="text-4xl font-bold text-gray-300">--</span>
        ) : (
          <div className={`text-4xl md:text-5xl font-bold text-red-600 transition-all duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
            {prefix}{count.toLocaleString()}{suffix}
          </div>
        )}
      </div>

      {/* Label principal */}
      <div className="text-center mb-2">
        <div className="text-lg font-semibold text-black uppercase tracking-wide">
          {label}
        </div>
      </div>

      {/* Descripción opcional */}
      {description && (
        <div className="text-center text-sm text-gray-600">
          {description}
        </div>
      )}
    </div>
  );
}

// Componente principal con diseño atractivo
export function MinimalMetrics({ metrics, loading, error, onRefresh }: MinimalMetricsProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleRefresh = () => {
    setLastUpdate(new Date());
    onRefresh();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header elegante */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 px-4 py-2 rounded-full border border-red-200">
          <TrendingUp className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium text-black uppercase tracking-wide">
            Métricas en Tiempo Real
          </span>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className={`
              text-red-500 hover:text-red-600 transition-all duration-300
              ${loading ? 'animate-spin' : 'hover:rotate-180'}
            `}
            title="Actualizar métricas"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Grid de métricas atractivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AttractiveMetricItem
          icon={<Users className="h-6 w-6" />}
          value={metrics?.totalUsers || 0}
          label="Miembros Activos"
          description="Usuarios registrados"
          loading={loading}
          error={!!error}
        />
        
        <AttractiveMetricItem
          icon={<DollarSign className="h-6 w-6" />}
          value={metrics?.dineroTotalRecaudado || 0}
          label="Fondos Recaudados"
          description="Total acumulado"
          loading={loading}
          error={!!error}
          prefix="$"
        />
        
        <AttractiveMetricItem
          icon={<Clock className="h-6 w-6" />}
          value={metrics?.weeksRemaining || 18}
          label="Semanas Restantes"
          description="Para completar campaña"
          loading={false}
          error={false}
        />
      </div>

      {/* Barra decorativa */}
      <div className="h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-full mb-6"></div>

      {/* Footer con información adicional */}
      <div className="text-center space-y-2">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600 mb-2">Error al cargar las métricas</p>
            <button
              onClick={handleRefresh}
              className="text-sm text-red-500 hover:text-red-700 font-medium underline transition-colors"
            >
              Reintentar carga
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Datos actualizados automáticamente cada 30 segundos
          </p>
        )}
        
        <div className="text-xs text-gray-400">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
