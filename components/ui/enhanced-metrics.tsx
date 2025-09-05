/**
 * Enhanced Metrics Component with Better UX
 * Counters animados, loading states profesionales, y microinteracciones
 * Versión con CSS animations (sin framer-motion)
 */

'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar,
  RefreshCw, 
  Loader2,
  TrendingUp,
  Clock
} from 'lucide-react';

/**
 * Enhanced Metrics Component with Better UX
 * Counters animados, loading states profesionales, y microinteracciones
 * Versión con CSS animations (sin framer-motion)
 */

'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar,
  RefreshCw, 
  Loader2,
  TrendingUp,
  Clock
} from 'lucide-react';

interface MetricsData {
  totalUsers: number;
  dineroTotalRecaudado: number;
  weeksRemaining: number;
}

interface EnhancedMetricsProps {
  metrics: MetricsData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

// Hook para animar números
function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return count;
}

// Componente de métrica individual
function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  loading, 
  error, 
  prefix = "",
  suffix = "",
  color = "orange",
  delay = 0 
}: {
  icon: any;
  label: string;
  value: number;
  loading: boolean;
  error: boolean;
  prefix?: string;
  suffix?: string;
  color?: "orange" | "green" | "blue";
  delay?: number;
}) {
  const animatedValue = useCountUp(value, 2000);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorClasses = {
    orange: "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100",
    green: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100", 
    blue: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
  };

  return (
    <div className={`
      metric-card group relative transform transition-all duration-500 
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
    `}>
      <div className={`
        p-6 rounded-xl border-2 transition-all duration-300
        ${colorClasses[color]}
        hover:shadow-lg hover:scale-105 cursor-pointer
        ${loading ? 'animate-pulse' : ''}
      `}>
        {/* Icono */}
        <div className="flex items-center justify-center mb-3">
          <div className={`
            p-3 rounded-full transition-transform duration-200
            ${color === 'orange' ? 'bg-orange-100 group-hover:bg-orange-200' : ''}
            ${color === 'green' ? 'bg-green-100 group-hover:bg-green-200' : ''}
            ${color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' : ''}
            group-hover:scale-110
          `}>
            <Icon className={`h-6 w-6 ${
              color === 'orange' ? 'text-orange-600' : ''
            }${
              color === 'green' ? 'text-green-600' : ''
            }${
              color === 'blue' ? 'text-blue-600' : ''
            }`} />
          </div>
        </div>

        {/* Valor */}
        <div className="text-center">
          {loading ? (
            <div className="animate-fadeIn space-y-2">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : error ? (
            <div className="animate-bounceIn text-red-500">
              <div className="text-lg font-bold">--</div>
              <div className="text-xs text-red-400">Error</div>
            </div>
          ) : (
            <div className="animate-slideUp">
              <div className={`text-3xl font-bold transition-colors duration-300 ${
                color === 'orange' ? 'text-orange-700' : ''
              }${
                color === 'green' ? 'text-green-700' : ''
              }${
                color === 'blue' ? 'text-blue-700' : ''
              }`}>
                {prefix}{animatedValue.toLocaleString()}{suffix}
              </div>
              <div className="text-sm font-medium text-gray-600 mt-1">
                {label}
              </div>
            </div>
          )}
        </div>

        {/* Indicador de trending */}
        {!loading && !error && (
          <div className={`
            absolute top-3 right-3 transition-all duration-1000 delay-1500
            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
          `}>
            <TrendingUp className="h-4 w-4 text-green-500 animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal mejorado
export function EnhancedMetrics({ metrics, loading, error, onRefresh }: EnhancedMetricsProps) {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showError, setShowError] = useState(false);

  const handleRefresh = () => {
    setLastRefresh(new Date());
    onRefresh();
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <div className="border-t border-gray-200 pt-8">
      {/* Header con refresh */}
      <div className="flex items-center justify-between mb-6 animate-fadeIn">
        <div>
          <div className="text-sm font-medium text-gray-600">Datos en tiempo real</div>
          <div className="text-xs text-gray-400 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            Actualizado {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className={`
            p-2 rounded-full transition-all duration-200 transform
            hover:scale-110 active:scale-95
            ${loading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }
          `}
          title="Actualizar métricas"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <MetricCard
          icon={Users}
          label="Miembros Activos"
          value={metrics?.totalUsers || 0}
          loading={loading}
          error={!!error}
          color="blue"
          delay={0}
        />
        
        <MetricCard
          icon={Calendar}
          label="Semanas Restantes"
          value={metrics?.weeksRemaining || 18}
          loading={false} // Las semanas no cargan, son fijas
          error={false}
          color="orange"
          delay={0.2}
        />
        
        <MetricCard
          icon={DollarSign}
          label="Fondos Recaudados"
          value={metrics?.dineroTotalRecaudado || 0}
          loading={loading}
          error={!!error}
          prefix="$"
          color="green"
          delay={0.4}
        />
      </div>

      {/* Mensaje de error global */}
      {showError && error && (
        <div className={`
          mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center
          transition-all duration-300 animate-slideDown
        `}>
          <div className="text-red-600 text-sm font-medium">
            Error al cargar las métricas
          </div>
          <div className="text-red-500 text-xs mt-1">
            {error}
          </div>
          <button
            onClick={() => {
              setShowError(false);
              handleRefresh();
            }}
            className="mt-2 text-red-600 hover:text-red-700 text-xs underline transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounceIn {
          0% { 
            opacity: 0; 
            transform: scale(0.3); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05); 
          }
          70% { 
            transform: scale(0.9); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .metric-card {
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
