'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Headphones, 
  TrendingUp, 
  Award, 
  Calendar,
  Download,
  Eye
} from 'lucide-react';
import { useState } from 'react';

export default function EstadisticasPage() {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'trimestre' | 'año'>('mes');

  const statsGenerales = {
    totalOyentes: 1247,
    crecimientoOyentes: '+12.5%',
    promedioEscucha: 89,
    crecimientoEscucha: '+8.2%',
    programasEscuchados: 156,
    horasTotal: 2340,
    votacionesParticipadas: 8,
    puntuacionPromedio: 4.7
  };

  const estadisticasPersonales = {
    tiempoEscucha: '47 horas',
    programasFavoritos: 12,
    votacionesParticipadas: 8,
    comentarios: 23,
    puntosGanados: 285,
    nivel: 'Oyente Comprometido',
    posicionRanking: 47
  };

  const topProgramas = [
    { nombre: 'Buenas Tardes Comunidad', audiencia: 892, crecimiento: '+15%' },
    { nombre: 'Música Sin Fronteras', audiencia: 743, crecimiento: '+22%' },
    { nombre: 'Noticias de la Semana', audiencia: 567, crecimiento: '+8%' },
    { nombre: 'Entrevistas Especiales', audiencia: 445, crecimiento: '+35%' },
    { nombre: 'Tarde de Tangos', audiencia: 334, crecimiento: '+5%' }
  ];

  const metricas = {
    semana: {
      nuevosOyentes: 89,
      horasEscuchadas: 1240,
      interacciones: 267,
      votosEmitidos: 445
    },
    mes: {
      nuevosOyentes: 312,
      horasEscuchadas: 4890,
      interacciones: 1123,
      votosEmitidos: 1567
    },
    trimestre: {
      nuevosOyentes: 845,
      horasEscuchadas: 12400,
      interacciones: 2890,
      votosEmitidos: 4230
    },
    año: {
      nuevosOyentes: 2340,
      horasEscuchadas: 45600,
      interacciones: 8900,
      votosEmitidos: 12400
    }
  };

  const metricaActual = metricas[periodo];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadísticas</h1>
          <p className="text-gray-600">
            Descubre el impacto de la comunidad y tu participación en Radio Community.
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['semana', 'mes', 'trimestre', 'año'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1 rounded text-sm capitalize transition-all ${
                  periodo === p
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metricaActual.nuevosOyentes}</p>
                <p className="text-sm text-gray-600">Nuevos oyentes</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {statsGenerales.crecimientoOyentes}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metricaActual.horasEscuchadas}</p>
                <p className="text-sm text-gray-600">Horas escuchadas</p>
              </div>
              <Headphones className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {statsGenerales.crecimientoEscucha}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metricaActual.interacciones}</p>
                <p className="text-sm text-gray-600">Interacciones</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                +18%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metricaActual.votosEmitidos}</p>
                <p className="text-sm text-gray-600">Votos emitidos</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                +25%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estadísticas personales */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-orange-500" />
              Tus Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tiempo de escucha total</span>
                <span className="font-semibold">{estadisticasPersonales.tiempoEscucha}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Programas favoritos</span>
                <span className="font-semibold">{estadisticasPersonales.programasFavoritos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Votaciones participadas</span>
                <span className="font-semibold">{estadisticasPersonales.votacionesParticipadas}/12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Comentarios realizados</span>
                <span className="font-semibold">{estadisticasPersonales.comentarios}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Puntos ganados</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {estadisticasPersonales.puntosGanados} pts
                </Badge>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">Nivel actual</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {estadisticasPersonales.nivel}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Posición en ranking</span>
                <span className="font-bold text-orange-600">
                  #{estadisticasPersonales.posicionRanking}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top programas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Programas Más Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProgramas.map((programa, index) => (
                <div key={programa.nombre} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{programa.nombre}</p>
                    <p className="text-xs text-gray-600">{programa.audiencia} oyentes</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      parseFloat(programa.crecimiento) > 20 ? 'bg-green-100 text-green-800' :
                      parseFloat(programa.crecimiento) > 10 ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {programa.crecimiento}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de actividad semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-500" />
            Actividad Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => (
              <div key={dia} className="text-center">
                <p className="text-xs text-gray-600 mb-2">{dia}</p>
                <div className="space-y-1">
                  {[1, 2, 3, 4].map((hora) => {
                    const intensidad = Math.random();
                    return (
                      <div
                        key={hora}
                        className={`h-3 rounded-sm ${
                          intensidad > 0.7 ? 'bg-orange-600' :
                          intensidad > 0.4 ? 'bg-orange-400' :
                          intensidad > 0.2 ? 'bg-orange-200' :
                          'bg-gray-100'
                        }`}
                        title={`${dia} - ${hora * 6}:00 hs`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Menos</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-600 rounded-sm"></div>
            </div>
            <span>Más</span>
          </div>
        </CardContent>
      </Card>

      {/* Logros y badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Logros Desbloqueados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-yellow-800">Oyente Fiel</p>
                <p className="text-xs text-yellow-600">Escuchaste 10 programas completos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">Participativo</p>
                <p className="text-xs text-blue-600">Votaste en 5 decisiones comunitarias</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800">En Crecimiento</p>
                <p className="text-xs text-green-600">Aumentaste tu actividad un 50%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
