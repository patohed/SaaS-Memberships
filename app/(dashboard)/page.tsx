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
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

// Componente de estadísticas en tiempo real
function CommunityStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">127</div>
        <div className="text-sm text-gray-600">Miembros activos</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">18</div>
        <div className="text-sm text-gray-600">Semanas restantes</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">$42,350</div>
        <div className="text-sm text-gray-600">Fondos recaudados</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">3</div>
        <div className="text-sm text-gray-600">Propuestas activas</div>
      </div>
    </div>
  );
}

// Componente de countdown
function CountdownTimer() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl mb-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Próxima Asamblea Comunitaria</h3>
        <div className="flex justify-center space-x-4 text-2xl font-bold">
          <div>
            <span className="block">05</span>
            <span className="text-xs">DÍAS</span>
          </div>
          <div>
            <span className="block">14</span>
            <span className="text-xs">HRS</span>
          </div>
          <div>
            <span className="block">27</span>
            <span className="text-xs">MIN</span>
          </div>
        </div>
        <p className="text-sm mt-2 opacity-90">¡Tu voz cuenta! Participa en las decisiones</p>
      </div>
    </div>
  );
}

// Componente de propuestas activas
function ActiveProposals() {
  const proposals = [
    {
      title: "Nuevo programa de música independiente",
      description: "Espacio dedicado a artistas emergentes de toda Latinoamérica",
      votes: 89,
      funding: 75,
      category: "Programación"
    },
    {
      title: "Mejoras en el estudio de grabación",
      description: "Equipamiento profesional para mejor calidad de audio",
      votes: 156,
      funding: 45,
      category: "Infraestructura"
    },
    {
      title: "Festival comunitario 2025",
      description: "Evento presencial con bandas locales y oyentes",
      votes: 203,
      funding: 92,
      category: "Eventos"
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Propuestas en Votación
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {proposals.map((proposal, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <Badge variant="secondary" className="w-fit mb-2">
                {proposal.category}
              </Badge>
              <h3 className="font-semibold text-lg leading-tight">{proposal.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{proposal.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <Vote className="h-4 w-4 mr-1" />
                      {proposal.votes} votos
                    </span>
                    <span className="text-green-600 font-medium">{proposal.funding}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${proposal.funding}%` }}
                    ></div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Ver propuesta completa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Estadísticas superiores */}
          <CommunityStats />
          
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Radio className="h-4 w-4 mr-2" />
              En vivo · 24/7
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              La comunidad
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                dueña de su programa
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Durante <strong>18 semanas</strong>, el periodismo depende de vos.
            </p>
            
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Un experimento único donde cada miembro decide el rumbo del programa, 
              vota las propuestas y construye el futuro del periodismo independiente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/participacion">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Users className="mr-2 h-5 w-5" />
                  QUIERO SER OYENTE
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full">
                <Music className="mr-2 h-5 w-5" />
                Escuchar ahora
              </Button>
            </div>
          </div>

          {/* Countdown */}
          <CountdownTimer />
        </div>
      </section>

      {/* Propuestas activas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ActiveProposals />
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            ¿Cómo funciona el Proyecto 18?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Un experimento único donde cada oyente tiene voz y voto en el futuro del periodismo independiente
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Únete como oyente</h3>
              <p className="text-gray-600">
                Regístrate y conviértete en oyente activo. Tu membresía te da acceso completo 
                a las decisiones y participación en el programa.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Participa y vota</h3>
              <p className="text-gray-600">
                Revisa las propuestas, participa en debates y vota por los temas 
                que crees que deben ser tratados en el programa.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Ve el impacto</h3>
              <p className="text-gray-600">
                Mira cómo tus decisiones toman forma en episodios reales, entrevistas 
                y contenidos que reflejan los intereses de la comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué ser parte */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Más que una radio, una experiencia colectiva
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mic className="h-6 w-6 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Tu voz importa</h3>
                    <p className="text-gray-600">Cada propuesta, cada voto, cada sugerencia cuenta para construir la radio que todos queremos.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Target className="h-6 w-6 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Transparencia total</h3>
                    <p className="text-gray-600">Ve exactamente cómo se usan los fondos, qué proyectos se financian y el progreso en tiempo real.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="h-6 w-6 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Contenido único</h3>
                    <p className="text-gray-600">Programas creados por y para la comunidad, con la música y temas que realmente te interesan.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Beneficios de miembro</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3" />
                    Acceso a asambleas exclusivas
                  </li>
                  <li className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-3" />
                    Participación en decisiones de presupuesto
                  </li>
                  <li className="flex items-center">
                    <Music className="h-5 w-5 mr-3" />
                    Requests prioritarios en programas
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    Comunidad privada en Discord
                  </li>
                </ul>
                
                <div className="mt-6 pt-6 border-t border-orange-400">
                  <p className="text-lg font-semibold">Membresía: $18/mes</p>
                  <p className="text-sm opacity-90">Cancela cuando quieras</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para hacer historia juntos?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Únete a los 127 miembros que ya están construyendo el futuro de la radio comunitaria
          </p>
          
          <Link href="/registro-chino">
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
            18 semanas · 1 comunidad · Tu radio
          </p>
        </div>
      </section>
    </main>
  );
}
