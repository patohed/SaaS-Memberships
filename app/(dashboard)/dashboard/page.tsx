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
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { signOut } from '@/app/(login)/actions';
import { useMetrics } from '@/lib/hooks/useMetrics';
import { MetricSkeleton, CommunityLoading } from '@/components/ui/loading-animations';

// Tipo para el usuario con información adicional
interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
  membershipStatus: string;
  paymentMethod?: string;
  votingRights: boolean;
  score: number;
  level: string;
  currentAmount?: number; // Monto pagado en centavos
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Componente del Header con info del usuario
function UserHeader() {
  const { data: user, isLoading } = useSWR<UserType>('/api/user', fetcher);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white/20 rounded-full animate-pulse flex items-center justify-center">
            <div className="h-8 w-8 bg-white/30 rounded-full animate-bounce"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-3 w-16 bg-white/20 rounded animate-pulse"></div>
              <div className="h-3 w-12 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl mb-6">
        <div className="text-center">
          <p>Error al cargar los datos del usuario</p>
        </div>
      </div>
    );
  }

  // Obtener iniciales del nombre del usuario
  const initials = user.name
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  // Formatear fecha de creación
  const memberSince = user.createdAt 
    ? new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(new Date(user.createdAt))
    : 'N/A';

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-white text-orange-500 text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">OYENTE #{user.id?.toString().padStart(4, '0')}</h1>
            <p className="text-orange-100">{user.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {user.membershipStatus === 'active' ? 'Miembro Activo' : 'Miembro Pendiente'}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Nivel {user.level === 'bronze' ? 'Bronce' : user.level === 'silver' ? 'Plata' : 'Oro'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-orange-100">Miembro desde</p>
          <p className="font-semibold">{memberSince}</p>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">Estado: {user.votingRights ? 'Al día' : 'Pendiente'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de estadísticas generales
function CommunityStats() {
  const { data: user } = useSWR<UserType>('/api/user', fetcher);
  const { metrics, loading: metricsLoading, error: metricsError } = useMetrics();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            ${((user?.currentAmount || 1800) / 100).toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">Tu Aporte</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {metricsLoading ? (
              <MetricSkeleton type="users" size="md" />
            ) : metricsError ? (
              <span className="text-red-500 text-sm">Error</span>
            ) : (
              metrics?.totalUsers || 0
            )}
          </div>
          <div className="text-sm text-gray-600">Oyentes Activos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {metricsLoading ? (
              <MetricSkeleton type="currency" size="lg" />
            ) : metricsError ? (
              <span className="text-red-500 text-sm">Error</span>
            ) : (
              `$${metrics?.dineroTotalRecaudado || 0}`
            )}
          </div>
          <div className="text-sm text-gray-600">Fondos Recaudados</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {metricsLoading ? (
              <MetricSkeleton variant="radio" size="md" />
            ) : (
              "18"
            )}
          </div>
          <div className="text-sm text-gray-600">Semanas Restantes</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {metricsLoading ? (
              <MetricSkeleton type="activity" size="md" />
            ) : metricsError ? (
              <span className="text-red-500 text-sm">Error</span>
            ) : (
              metrics?.activeProposals || 0
            )}
          </div>
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
  const { data: user, isLoading } = useSWR<UserType>('/api/user', fetcher);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Mi Perfil de Oyente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Mi Perfil de Oyente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Error al cargar los datos del perfil</p>
        </CardContent>
      </Card>
    );
  }

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
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Método de pago:</span>
                  <span className="text-sm font-medium">
                    {user.paymentMethod === 'mercadopago' ? 'MercadoPago' : 
                     user.paymentMethod === 'paypal' ? 'PayPal' : 
                     'No especificado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto actual:</span>
                  <span className="text-sm font-medium text-green-600">
                    ${((user.currentAmount || 1800) / 100).toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Estadísticas de Participación</h4>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado de membresía:</span>
                  <Badge variant={user.membershipStatus === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {user.membershipStatus === 'active' ? 'Activo' : 'Pendiente'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Derechos de voto:</span>
                  <Badge variant={user.votingRights ? 'default' : 'secondary'} className="text-xs">
                    {user.votingRights ? 'Habilitado' : 'Pendiente'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nivel:</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.level === 'bronze' ? 'Bronce' : user.level === 'silver' ? 'Plata' : 'Oro'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Puntuación:</span>
                  <span className="text-sm font-medium">{user.score} pts</span>
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
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

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
          <Button variant="outline" className="text-gray-600" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
