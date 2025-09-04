'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Radio, 
  Users, 
  Calendar,
  ExternalLink,
  Star,
  Volume2,
  Mic,
  Music,
  Award
} from 'lucide-react';
import { useState } from 'react';

export default function NovedadesPage() {
  const [filtro, setFiltro] = useState<'todas' | 'programas' | 'comunidad' | 'eventos' | 'logros'>('todas');

  const novedades = [
    {
      id: 1,
      tipo: 'programas',
      titulo: 'Nuevo programa especial: "Voces de América Latina"',
      descripcion: 'Presentamos una nueva serie semanal donde exploraremos la música y cultura de diferentes países latinoamericanos. Cada domingo a las 20:00 hs.',
      fecha: '2024-09-01',
      autor: 'Equipo Editorial',
      categoria: 'Programa Nuevo',
      icono: Mic,
      color: 'bg-blue-500',
      importante: true,
      imagen: '/api/placeholder/400/200'
    },
    {
      id: 2,
      tipo: 'comunidad',
      titulo: '¡Ya somos 1000 oyentes activos!',
      descripcion: 'Celebramos este increíble hito que alcanzamos gracias a toda la comunidad. Como agradecimiento, haremos un programa especial el próximo viernes.',
      fecha: '2024-08-30',
      autor: 'Administración',
      categoria: 'Milestone',
      icono: Users,
      color: 'bg-green-500',
      importante: true
    },
    {
      id: 3,
      tipo: 'eventos',
      titulo: 'Encuentro presencial en Buenos Aires',
      descripcion: 'Te invitamos al primer encuentro presencial de la comunidad Radio Community. Será el sábado 14 de septiembre en el Café Tortoni.',
      fecha: '2024-08-28',
      autor: 'Eventos Comunidad',
      categoria: 'Evento',
      icono: Calendar,
      color: 'bg-purple-500',
      enlace: 'https://eventbrite.com/radio-community-ba'
    },
    {
      id: 4,
      tipo: 'programas',
      titulo: 'Cambios en la programación semanal',
      descripcion: 'A partir del lunes 4 de septiembre, "Buenas Tardes Comunidad" se trasladará a las 18:00 hs para llegar a más oyentes.',
      fecha: '2024-08-27',
      autor: 'Programación',
      categoria: 'Cambio Horario',
      icono: Radio,
      color: 'bg-orange-500'
    },
    {
      id: 5,
      tipo: 'logros',
      titulo: 'Nueva funcionalidad: Sistema de puntos',
      descripcion: 'Introducimos el sistema de puntos donde podrás ganar recompensas por tu participación activa en votaciones, comentarios y escucha de programas.',
      fecha: '2024-08-25',
      autor: 'Desarrollo',
      categoria: 'Nueva Función',
      icono: Award,
      color: 'bg-yellow-500'
    },
    {
      id: 6,
      tipo: 'programas',
      titulo: 'Entrevista exclusiva con Jorge Drexler',
      descripcion: 'El próximo miércoles tendremos una entrevista especial con Jorge Drexler, donde hablará sobre su nuevo álbum y su relación con la radio.',
      fecha: '2024-08-24',
      autor: 'Produción',
      categoria: 'Entrevista Especial',
      icono: Star,
      color: 'bg-red-500',
      importante: true
    },
    {
      id: 7,
      tipo: 'comunidad',
      titulo: 'Nuevas votaciones disponibles',
      descripcion: 'Ya puedes participar en las nuevas votaciones sobre invitados especiales, temas musicales y horarios de programas especiales.',
      fecha: '2024-08-23',
      autor: 'Comunidad',
      categoria: 'Votaciones',
      icono: Bell,
      color: 'bg-indigo-500'
    },
    {
      id: 8,
      tipo: 'programas',
      titulo: 'Playlist colaborativa del mes',
      descripcion: 'Este mes la playlist será armada por los oyentes. Envía tus sugerencias y vota por tus canciones favoritas para el programa del viernes.',
      fecha: '2024-08-22',
      autor: 'Música',
      categoria: 'Playlist',
      icono: Music,
      color: 'bg-pink-500'
    }
  ];

  const novedadesFiltradas = filtro === 'todas' 
    ? novedades 
    : novedades.filter(novedad => novedad.tipo === filtro);

  const contadores = {
    todas: novedades.length,
    programas: novedades.filter(n => n.tipo === 'programas').length,
    comunidad: novedades.filter(n => n.tipo === 'comunidad').length,
    eventos: novedades.filter(n => n.tipo === 'eventos').length,
    logros: novedades.filter(n => n.tipo === 'logros').length
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const obtenerColor = (tipo: string) => {
    const colores = {
      programas: 'bg-blue-100 text-blue-800',
      comunidad: 'bg-green-100 text-green-800',
      eventos: 'bg-purple-100 text-purple-800',
      logros: 'bg-yellow-100 text-yellow-800'
    };
    return colores[tipo as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Novedades</h1>
          <p className="text-gray-600">
            Mantente al día con las últimas noticias, eventos y actualizaciones de Radio Community.
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Bell className="h-4 w-4 mr-2" />
          Suscribirse a notificaciones
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todas', label: 'Todas', count: contadores.todas },
          { id: 'programas', label: 'Programas', count: contadores.programas },
          { id: 'comunidad', label: 'Comunidad', count: contadores.comunidad },
          { id: 'eventos', label: 'Eventos', count: contadores.eventos },
          { id: 'logros', label: 'Logros', count: contadores.logros }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFiltro(item.id as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filtro === item.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* Novedades importantes destacadas */}
      {filtro === 'todas' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Destacadas
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {novedades
              .filter(novedad => novedad.importante)
              .slice(0, 2)
              .map((novedad) => {
                const Icono = novedad.icono;
                return (
                  <Card key={novedad.id} className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${novedad.color} bg-opacity-20`}>
                            <Icono className={`h-5 w-5 text-white`} />
                          </div>
                          <Badge className="bg-yellow-500 text-white">
                            Destacada
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-600">
                          {formatearFecha(novedad.fecha)}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {novedad.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 mb-3">{novedad.descripcion}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={obtenerColor(novedad.tipo)}>
                          {novedad.categoria}
                        </Badge>
                        {novedad.enlace && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver más
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Lista de novedades */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {filtro === 'todas' ? 'Todas las novedades' : `Novedades de ${filtro}`}
        </h2>
        <div className="space-y-4">
          {novedadesFiltradas.map((novedad) => {
            const Icono = novedad.icono;
            return (
              <Card key={novedad.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${novedad.color}`}>
                      <Icono className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                          {novedad.titulo}
                          {novedad.importante && (
                            <Star className="inline h-4 w-4 ml-2 text-yellow-500" />
                          )}
                        </h3>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {formatearFecha(novedad.fecha)}
                          </span>
                          <Badge variant="secondary" className={obtenerColor(novedad.tipo)}>
                            {novedad.categoria}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{novedad.descripcion}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Por {novedad.autor}</span>
                        <div className="flex space-x-2">
                          {novedad.enlace && (
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver más
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Volume2 className="h-4 w-4 mr-1" />
                            Escuchar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sección de suscripción */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">¿No quieres perderte ninguna novedad?</h3>
              <p className="opacity-90">
                Suscríbete a nuestras notificaciones y recibe las actualizaciones directamente en tu correo.
              </p>
            </div>
            <Button variant="secondary" size="lg">
              <Bell className="h-5 w-5 mr-2" />
              Suscribirme
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
