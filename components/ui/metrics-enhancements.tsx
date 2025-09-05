/**
 * Enhanced Loading States y Micro-animaciones adicionales
 * Para una mejor experiencia de usuario
 */

'use client';

import { useEffect, useState } from 'react';
import { Loader2, Wifi } from 'lucide-react';

// Loading Pulse para números que van cambiando
export function NumberSkeleton({ width = "w-16" }: { width?: string }) {
  return (
    <div className={`${width} h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer`} />
  );
}

// Indicador de conexión en tiempo real
export function RealTimeIndicator({ isConnected = true }: { isConnected?: boolean }) {
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 300);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Wifi className={`h-4 w-4 transition-colors duration-300 ${
          isConnected ? 'text-green-500' : 'text-red-500'
        }`} />
        {isConnected && (
          <div className={`
            absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full transition-all duration-300
            ${pulseActive ? 'scale-125 opacity-100' : 'scale-100 opacity-70'}
          `} />
        )}
      </div>
      <span className={`text-xs font-medium ${
        isConnected ? 'text-green-600' : 'text-red-600'
      }`}>
        {isConnected ? 'En línea' : 'Desconectado'}
      </span>
    </div>
  );
}

// Loading overlay suave para toda la sección de métricas
export function MetricsLoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 transition-all duration-300">
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        <div className="text-sm text-gray-600 font-medium">Actualizando datos...</div>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Efecto de éxito al actualizar métricas
export function SuccessCheckmark({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-green-50/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 animate-fadeIn">
      <div className="flex flex-col items-center space-y-2">
        <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center animate-bounceIn">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-sm text-green-700 font-medium">¡Actualizado!</div>
      </div>
    </div>
  );
}

// Estilo de gradiente para números importantes
export function GradientNumber({ 
  children, 
  color = "orange" 
}: { 
  children: React.ReactNode; 
  color?: "orange" | "green" | "blue" 
}) {
  const gradientClasses = {
    orange: "bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent",
    green: "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent",
    blue: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
  };

  return (
    <span className={`font-bold ${gradientClasses[color]} animate-pulse-gentle`}>
      {children}
    </span>
  );
}

// CSS adicional para animaciones personalizadas
export function MetricsEnhancedStyles() {
  return (
    <style jsx global>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes bounceIn {
        0% { 
          opacity: 0; 
          transform: scale(0.3) rotate(-180deg); 
        }
        50% { 
          opacity: 1; 
          transform: scale(1.1) rotate(-10deg); 
        }
        70% { 
          transform: scale(0.9) rotate(5deg); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1) rotate(0deg); 
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse-gentle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      .animate-shimmer {
        animation: shimmer 2s linear infinite;
      }
      
      .animate-bounceIn {
        animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
      
      .animate-pulse-gentle {
        animation: pulse-gentle 3s ease-in-out infinite;
      }
      
      /* Hover effects mejorados */
      .metric-card-enhanced {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .metric-card-enhanced:hover {
        transform: translateY(-2px) scale(1.02);
        filter: brightness(1.05);
      }
      
      /* Loading dots animation */
      @keyframes loading-dots {
        0%, 20% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        80%, 100% { transform: scale(1); opacity: 1; }
      }
      
      .loading-dot {
        animation: loading-dots 1.4s ease-in-out infinite;
      }
      
      .loading-dot:nth-child(1) { animation-delay: 0s; }
      .loading-dot:nth-child(2) { animation-delay: 0.2s; }
      .loading-dot:nth-child(3) { animation-delay: 0.4s; }
    `}</style>
  );
}
