'use client';

import { Radio, Users, DollarSign, Activity } from 'lucide-react';

interface MetricSkeletonProps {
  type?: 'number' | 'currency' | 'users' | 'activity';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'radio';
}

export function MetricSkeleton({ 
  type = 'number', 
  size = 'md',
  variant = 'default' 
}: MetricSkeletonProps) {
  const sizeClasses = {
    sm: 'h-6 w-12',
    md: 'h-8 w-16', 
    lg: 'h-10 w-20'
  };

  if (variant === 'radio') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="relative">
          <Radio className="h-6 w-6 text-orange-300 animate-pulse" />
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-400 rounded-full animate-ping"></div>
        </div>
        <div className={`bg-gradient-to-r from-gray-200 to-gray-300 ${sizeClasses[size]} rounded animate-pulse`}></div>
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'currency':
        return <DollarSign className="h-5 w-5 text-green-300 animate-pulse" />;
      case 'users':
        return <Users className="h-5 w-5 text-blue-300 animate-pulse" />;
      case 'activity':
        return <Activity className="h-5 w-5 text-purple-300 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {getIcon()}
      <div className="space-y-1">
        <div className={`bg-gradient-to-r from-orange-200 to-orange-300 ${sizeClasses[size]} rounded animate-pulse`}></div>
        <div className="bg-gray-200 h-2 w-8 rounded animate-pulse mx-auto"></div>
      </div>
    </div>
  );
}

interface RadioLoadingProps {
  message?: string;
}

export function RadioLoading({ message = "Conectando con la radio..." }: RadioLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        {/* Ondas de radio animadas */}
        <div className="absolute inset-0 animate-ping">
          <div className="h-20 w-20 border-2 border-orange-300 rounded-full opacity-75"></div>
        </div>
        <div className="absolute inset-2 animate-ping" style={{ animationDelay: '0.5s' }}>
          <div className="h-16 w-16 border-2 border-orange-400 rounded-full opacity-50"></div>
        </div>
        <div className="absolute inset-4 animate-ping" style={{ animationDelay: '1s' }}>
          <div className="h-12 w-12 border-2 border-orange-500 rounded-full opacity-25"></div>
        </div>
        
        {/* Icono central */}
        <div className="relative z-10 flex items-center justify-center h-20 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
          <Radio className="h-8 w-8 text-white animate-pulse" />
        </div>
        
        {/* Punto de señal */}
        <div className="absolute top-2 right-2 h-3 w-3 bg-green-400 rounded-full animate-bounce"></div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 font-medium">{message}</p>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <div className="h-1 w-1 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="h-1 w-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-1 w-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

interface CommunityLoadingProps {
  message?: string;
}

export function CommunityLoading({ message = "Cargando datos de la comunidad..." }: CommunityLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <div className="relative">
        {/* Círculo de usuarios animado */}
        <div className="flex items-center justify-center h-16 w-16">
          <div className="absolute animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
          <div className="absolute animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500" style={{ animationDuration: '1.5s' }}></div>
          <Users className="h-6 w-6 text-orange-500 z-10" />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 text-sm font-medium">{message}</p>
        <div className="w-24 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

interface MetricsGridSkeletonProps {
  count?: number;
}

export function MetricsGridSkeleton({ count = 4 }: MetricsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center space-y-3">
            <MetricSkeleton 
              type={index === 0 ? 'users' : index === 1 ? 'currency' : 'activity'} 
              size="lg"
            />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
