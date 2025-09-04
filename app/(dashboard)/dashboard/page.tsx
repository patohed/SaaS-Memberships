'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Users, 
  Radio, 
  Vote, 
  TrendingUp, 
  Clock,
  Star,
  Calendar,
  DollarSign,
  Trophy,
  Activity,
  User,
  Settings,
  LogOut,
  Bell,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';

// Componente del Header con info del usuario
function UserHeader() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-white text-orange-500 text-xl font-bold">
              JP
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">OYENTE #0005</h1>
            <p className="text-orange-100">Juan Pérez</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Miembro Activo
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Nivel Bronce
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-orange-100">Miembro desde</div>
          <div className="text-xl font-semibold">Sept 2025</div>
          <div className="text-sm text-orange-100">
            <Clock className="h-4 w-4 inline mr-1" />
            Estado: Al día
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de estadísticas generales
function CommunityStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">128</div>
          <div className="text-sm text-gray-600">Oyentes Activos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">$45,230</div>
          <div className="text-sm text-gray-600">Fondos Recaudados</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">17</div>
          <div className="text-sm text-gray-600">Semanas Restantes</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">4</div>
          <div className="text-sm text-gray-600">Propuestas Activas</div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente del countdown de próxima asamblea
function AssemblyCountdown() {
  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Próxima Asamblea de Oyentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">04</div>
              <div className="text-sm text-gray-600">DÍAS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">HRS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">45</div>
              <div className="text-sm text-gray-600">MIN</div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">
              Domingo 8 de Septiembre
            </p>
            <p className="text-sm text-gray-600">20:00 hs (ARG)</p>
            <Button className="mt-2 bg-blue-600 hover:bg-blue-700">
              <Bell className="h-4 w-4 mr-2" />
              Recordármelo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de votaciones activas
function ActiveVotations() {
  const votations = [
    {
      id: 1,
      title: "Invitado especial para el programa del lunes",
      description: "¿A quién te gustaría que entrevistemos próximamente?",
      options: [
        { name: "Milo Lockett", votes: 45 },
        { name: "Dolores Fonzi", votes: 32 },
        { name: "Santiago Motorizado", votes: 28 }
      ],
      timeLeft: "2 días",
      hasVoted: false
    },
    {
      id: 2,
      title: "Tema musical de la semana",
      description: "¿Qué género debería ser el foco del próximo programa musical?",
      options: [
        { name: "Rock Nacional", votes: 67 },
        { name: "Indie Argentino", votes: 43 },
        { name: "Folk Latinoamericano", votes: 25 }
      ],
      timeLeft: "5 días",
      hasVoted: true
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {votations.map((votation) => (
        <Card key={votation.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{votation.title}</CardTitle>
              <Badge variant={votation.hasVoted ? "default" : "secondary"}>
                {votation.hasVoted ? "Votado" : "Pendiente"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{votation.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {votation.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm">{option.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{option.votes} votos</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                {votation.timeLeft} restantes
              </span>
              <Button 
                size="sm" 
                disabled={votation.hasVoted}
                className={votation.hasVoted ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}
              >
                {votation.hasVoted ? "Ya votaste" : "Votar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Componente del perfil personal
function PersonalProfile() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Mi Perfil de Oyente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Información Personal</h4>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nombre:</span>
                  <span className="text-sm font-medium">Juan Pérez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">juan.perez@test.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">WhatsApp:</span>
                  <span className="text-sm font-medium">+54 11 1234-5678</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Estadísticas de Participación</h4>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Votaciones participadas:</span>
                  <span className="text-sm font-medium">8/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Propuestas enviadas:</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nivel de participación:</span>
                  <Badge variant="secondary" className="text-xs">Alto</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Enviar Propuesta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de actividad reciente
function RecentActivity() {
  const activities = [
    { 
      type: "vote", 
      description: "Votaste en 'Tema musical de la semana'", 
      time: "Hace 2 horas",
      icon: Vote 
    },
    { 
      type: "proposal", 
      description: "Tu propuesta 'Especial Rock Nacional' fue aprobada", 
      time: "Hace 1 día",
      icon: Star 
    },
    { 
      type: "participation", 
      description: "Participaste en la Asamblea de Septiembre", 
      time: "Hace 3 días",
      icon: Users 
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <activity.icon className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header del usuario */}
        <UserHeader />
        
        {/* Estadísticas generales */}
        <CommunityStats />
        
        {/* Countdown de asamblea */}
        <AssemblyCountdown />
        
        {/* Votaciones activas */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Votaciones Activas
        </h2>
        <ActiveVotations />
        
        {/* Grid de perfil y actividad */}
        <div className="grid lg:grid-cols-2 gap-6">
          <PersonalProfile />
          <RecentActivity />
        </div>
        
        {/* Botón de salir */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="text-gray-600">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
