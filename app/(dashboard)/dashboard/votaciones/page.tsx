'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Vote, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function VotacionesPage() {
  const [votes, setVotes] = useState<Record<string, string>>({});

  const votacionesActivas = [
    {
      id: 'invitado-1',
      titulo: 'Invitado especial para el programa del lunes',
      descripcion: '¿A quién te gustaría que entrevistemos próximamente?',
      opciones: [
        { id: 'milo', nombre: 'Milo Lockett', votos: 45 },
        { id: 'dolores', nombre: 'Dolores Fonzi', votos: 32 },
        { id: 'santiago', nombre: 'Santiago Motorizado', votos: 28 },
        { id: 'otro', nombre: 'Proponer otro invitado', votos: 12 }
      ],
      tiempoRestante: '2 días',
      estado: 'activa'
    },
    {
      id: 'tema-musical',
      titulo: 'Tema musical de la semana',
      descripcion: '¿Qué género debería ser el foco del próximo programa musical?',
      opciones: [
        { id: 'rock', nombre: 'Rock Nacional', votos: 67 },
        { id: 'indie', nombre: 'Indie Argentino', votos: 43 },
        { id: 'folk', nombre: 'Folk Latinoamericano', votos: 25 },
        { id: 'tango', nombre: 'Tango Moderno', votos: 18 }
      ],
      tiempoRestante: '5 días',
      estado: 'votado'
    },
    {
      id: 'horario-programa',
      titulo: 'Mejor horario para programas especiales',
      descripcion: '¿Cuál sería el mejor horario para los programas especiales de fin de semana?',
      opciones: [
        { id: 'sabado-tarde', nombre: 'Sábado 15:00 hs', votos: 89 },
        { id: 'sabado-noche', nombre: 'Sábado 21:00 hs', votos: 56 },
        { id: 'domingo-tarde', nombre: 'Domingo 17:00 hs', votos: 73 },
        { id: 'domingo-noche', nombre: 'Domingo 20:00 hs', votos: 41 }
      ],
      tiempoRestante: '1 semana',
      estado: 'activa'
    }
  ];

  const votacionesCerradas = [
    {
      id: 'formato-noticias',
      titulo: 'Formato del segmento de noticias',
      descripcion: 'Votación cerrada sobre el estilo del noticiero.',
      ganadora: 'Formato conversacional',
      fechaCierre: '28 de Agosto',
      totalVotos: 184
    },
    {
      id: 'musica-apertura',
      titulo: 'Música de apertura del programa',
      descripcion: 'Selección de la cortina musical principal.',
      ganadora: 'Tema original compuesto por la comunidad',
      fechaCierre: '22 de Agosto',
      totalVotos: 156
    }
  ];

  const handleVote = (votacionId: string, opcionId: string) => {
    setVotes({ ...votes, [votacionId]: opcionId });
  };

  const getTotalVotos = (opciones: any[]) => {
    return opciones.reduce((total, opcion) => total + opcion.votos, 0);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Votaciones</h1>
        <p className="text-gray-600">
          Participa en las decisiones de la comunidad. Tu voto cuenta para construir el programa que todos queremos.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Vote className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Participadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">128</p>
                <p className="text-sm text-gray-600">Oyentes votando</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">67%</p>
                <p className="text-sm text-gray-600">Participación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Votaciones Activas */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Vote className="h-6 w-6 mr-2 text-orange-500" />
          Votaciones Activas
        </h2>
        <div className="space-y-6">
          {votacionesActivas.map((votacion) => {
            const totalVotos = getTotalVotos(votacion.opciones);
            const yaVotaste = votes[votacion.id] || (votacion.estado === 'votado');
            
            return (
              <Card key={votacion.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{votacion.titulo}</CardTitle>
                      <p className="text-gray-600 mt-1">{votacion.descripcion}</p>
                    </div>
                    <Badge 
                      variant={yaVotaste ? "secondary" : "default"}
                      className={yaVotaste ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    >
                      {yaVotaste ? "Ya votaste" : "Pendiente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {votacion.opciones.map((opcion) => {
                      const porcentaje = totalVotos > 0 ? ((opcion.votos / totalVotos) * 100).toFixed(1) : '0';
                      const isSelected = votes[votacion.id] === opcion.id;
                      
                      return (
                        <div 
                          key={opcion.id}
                          className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => !yaVotaste && handleVote(votacion.id, opcion.id)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{opcion.nombre}</span>
                            <span className="text-sm text-gray-600">
                              {opcion.votos} votos ({porcentaje}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all"
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {votacion.tiempoRestante} restantes
                    </div>
                    {yaVotaste ? (
                      <Button disabled variant="secondary">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Ya votaste
                      </Button>
                    ) : votes[votacion.id] ? (
                      <Button 
                        onClick={() => {
                          // Aquí iría la lógica para enviar el voto
                          alert(`Voto registrado: ${votacion.opciones.find(o => o.id === votes[votacion.id])?.nombre}`);
                        }}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Confirmar Voto
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Selecciona una opción
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Votaciones Cerradas */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
          Votaciones Cerradas
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {votacionesCerradas.map((votacion) => (
            <Card key={votacion.id} className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{votacion.titulo}</CardTitle>
                <p className="text-sm text-gray-600">{votacion.descripcion}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Resultado ganador:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {votacion.ganadora}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total de votos: {votacion.totalVotos}</span>
                    <span>Cerrada: {votacion.fechaCierre}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
