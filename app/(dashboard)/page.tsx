'use client';

import Link from 'next/link';
import { useMetrics } from '@/lib/hooks/useMetrics-optimized';
import { MinimalMetrics } from '@/components/ui/minimal-metrics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Users, 
  Radio, 
  Vote, 
  Heart, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Music,
  Mic,
  Target,
  Star,
  Calendar,
  DollarSign,
  Headphones,
  LogIn
} from 'lucide-react';

export default function HomePage() {
  // Usar hook optimizado con configuración inteligente
  const { 
    metrics, 
    loading, 
    error, 
    isRefreshing, 
    showSuccess, 
    refreshMetrics,
    isTabVisible 
  } = useMetrics({
    autoRefresh: true,
    refreshInterval: 2 * 60 * 1000, // 2 minutos para producción
    pauseOnHidden: false, // NO pausar en producción para mejor UX
    maxRetries: 3,
    minInterval: 15 * 1000 // Mínimo 15 segundos entre requests
  });
  
  return (
    <main className="min-h-screen">
      {/* Hero Section Minimalista - Diseño limpio y profesional */}
      <section className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Logo/Icono central */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Radio className="h-16 w-16 text-orange-500" />
              <Headphones className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          
          {/* Título principal */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Radio Community
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-xl mx-auto">
            La radio donde cada oyente es dueño del programa
          </p>

          {/* Acceso Oyentes - Botón principal */}
          <div className="space-y-6 mb-12">
            <Link href="/participacion">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-6 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 min-w-[280px]"
              >
                <Headphones className="mr-3 h-6 w-6" />
                ACCESO OYENTES
              </Button>
            </Link>
            
            {/* Texto pequeño de login */}
            <div className="text-center">
              <Link 
                href="/sign-in" 
                className="text-sm text-gray-500 hover:text-orange-600 transition-colors inline-flex items-center"
              >
                <LogIn className="mr-1 h-4 w-4" />
                Si ya sos miembro inicia sesión
              </Link>
            </div>
          </div>

          {/* Estadísticas minimalistas */}
          <MinimalMetrics 
            metrics={metrics ? {
              totalUsers: metrics.totalUsers || 0, // Cambiado de activeUsers a totalUsers
              dineroTotalRecaudado: metrics.dineroTotalRecaudado || 0,
              weeksRemaining: 18
            } : null}
            loading={loading}
            error={error}
            onRefresh={refreshMetrics}
          />
        </div>
      </section>

      {/* Sección informativa reducida */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Un experimento único de periodismo independiente
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Durante 18 semanas, cada miembro vota las propuestas y decide el rumbo del programa.
            Tu aporte mensual te da voz y voto en el futuro de la radio.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Apoyá</h3>
              <p className="text-gray-600 text-sm">Con tu aporte mensual sostenés el proyecto</p>
            </div>
            <div>
              <Vote className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Votá</h3>
              <p className="text-gray-600 text-sm">Decidí sobre propuestas y el futuro del programa</p>
            </div>
            <div>
              <Radio className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Escuchá</h3>
              <p className="text-gray-600 text-sm">Disfrutá de contenido creado por la comunidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final minimalista */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Comenzá tu membresía
          </h2>
          <p className="text-lg text-orange-100 mb-8">
            {loading ? (
              'Cargando datos de la comunidad...'
            ) : error ? (
              'Únete a nuestra comunidad activa'
            ) : (
              `Únete a los ${metrics?.totalUsers || 0} miembros activos`
            )}
          </p>
          
          <Link href="/participacion">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Users className="mr-2 h-5 w-5" />
              COMENZAR AHORA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <p className="text-sm text-orange-200 mt-4">
            $18/mes · Cancela cuando quieras
          </p>
        </div>
      </section>
    </main>
  );
}
