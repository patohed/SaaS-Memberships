'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Users, 
  Vote, 
  DollarSign, 
  Award, 
  Radio,
  Heart,
  Star,
  Headphones,
  Gift,
  MessageCircle,
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function ComoFuncionaPage() {
  const pasos = [
    {
      numero: 1,
      titulo: 'Regístrate como Oyente',
      descripcion: 'Completa tu registro con tus datos básicos y conviértete en parte de la comunidad.',
      icono: Users,
      color: 'bg-blue-500',
      detalles: [
        'Registro gratuito y sencillo',
        'Confirma tu email y teléfono',
        'Accede a tu panel personalizado'
      ]
    },
    {
      numero: 2,
      titulo: 'Participa en las Decisiones',
      descripcion: 'Vota en las decisiones importantes sobre programación, invitados y contenido.',
      icono: Vote,
      color: 'bg-green-500',
      detalles: [
        'Votaciones semanales sobre contenido',
        'Propón invitados y temas',
        'Influye en la programación'
      ]
    },
    {
      numero: 3,
      titulo: 'Contribuye Mensualmente',
      descripcion: 'Con tu aporte mensual de $18 USD mantienes la radio independiente y sin publicidad.',
      icono: Heart,
      color: 'bg-red-500',
      detalles: [
        'Aporte mensual de $18 USD',
        'Radio sin publicidad comercial',
        'Financiación transparente'
      ]
    },
    {
      numero: 4,
      titulo: 'Gana Puntos y Recompensas',
      descripcion: 'Acumula puntos por tu participación y canjéalos por beneficios exclusivos.',
      icono: Award,
      color: 'bg-yellow-500',
      detalles: [
        'Puntos por votar y participar',
        'Acceso a contenido exclusivo',
        'Beneficios especiales'
      ]
    }
  ];

  const formasParticipar = [
    {
      titulo: 'Escuchar Programas',
      descripcion: 'Disfruta nuestra programación diaria y especiales',
      puntos: '+2 puntos por programa',
      icono: Headphones,
      color: 'text-blue-600'
    },
    {
      titulo: 'Votar en Decisiones',
      descripcion: 'Participa en las votaciones sobre contenido',
      puntos: '+10 puntos por voto',
      icono: Vote,
      color: 'text-green-600'
    },
    {
      titulo: 'Comentar y Opinar',
      descripcion: 'Deja tus comentarios en los programas',
      puntos: '+5 puntos por comentario',
      icono: MessageCircle,
      color: 'text-purple-600'
    },
    {
      titulo: 'Asistir a Eventos',
      descripción: 'Participa en eventos presenciales',
      puntos: '+25 puntos por evento',
      icono: Calendar,
      color: 'text-orange-600'
    }
  ];

  const nivelesOyente = [
    {
      nivel: 'Oyente Nuevo',
      puntos: '0 - 100 pts',
      beneficios: ['Acceso a programación regular', 'Participación en votaciones básicas'],
      color: 'bg-gray-100 text-gray-800'
    },
    {
      nivel: 'Oyente Activo',
      puntos: '100 - 300 pts',
      beneficios: ['Proponer temas para programas', 'Acceso a chat en vivo', 'Descuentos en eventos'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      nivel: 'Oyente Comprometido',
      puntos: '300 - 600 pts',
      beneficios: ['Participar en focus groups', 'Contenido exclusivo mensual', 'Meet & greet con invitados'],
      color: 'bg-green-100 text-green-800'
    },
    {
      nivel: 'Oyente VIP',
      puntos: '600+ pts',
      beneficios: ['Acceso VIP a eventos', 'Llamadas mensuales con el equipo', 'Menciones especiales'],
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const faqs = [
    {
      pregunta: '¿Por qué cuesta $18 USD al mes?',
      respuesta: 'Este modelo nos permite mantener la radio completamente independiente, sin publicidad comercial que interrumpa la experiencia. Los $18 cubren todos los costos de producción, tecnología y equipo humano.'
    },
    {
      pregunta: '¿Qué pasa si no puedo pagar un mes?',
      respuesta: 'Entendemos que pueden surgir dificultades. Contáctanos y buscaremos una solución juntos. La comunidad es lo más importante.'
    },
    {
      pregunta: '¿Cómo funciona el sistema de votaciones?',
      respuesta: 'Cada semana proponemos diferentes decisiones: invitados, temas musicales, horarios especiales. Tu voto tiene el mismo peso que el de cualquier otro oyente.'
    },
    {
      pregunta: '¿Puedo cancelar mi membresía cuando quiera?',
      respuesta: 'Por supuesto. Puedes cancelar tu membresía en cualquier momento desde tu panel de oyente, sin preguntas ni penalizaciones.'
    },
    {
      pregunta: '¿Hay algún compromiso mínimo?',
      respuesta: 'No hay compromiso mínimo. Creemos en la libertad de elección y que la calidad del contenido debe ser la razón para quedarse.'
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo Funciona Radio Community?</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Radio Community es más que una radio: es una comunidad donde cada oyente tiene voz y voto. 
          Descubre cómo ser parte activa de este proyecto independiente.
        </p>
      </div>

      {/* Pasos principales */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-8">Cómo Empezar</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pasos.map((paso, index) => {
            const Icono = paso.icono;
            return (
              <Card key={paso.numero} className="relative text-center">
                <CardHeader className="pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full ${paso.color} flex items-center justify-center mb-4`}>
                    <Icono className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="secondary" className="mx-auto mb-2">
                    Paso {paso.numero}
                  </Badge>
                  <CardTitle className="text-lg">{paso.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{paso.descripcion}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {paso.detalles.map((detalle, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {detalle}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {index < pasos.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Formas de participar */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Formas de Participar y Ganar Puntos</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {formasParticipar.map((forma) => {
            const Icono = forma.icono;
            return (
              <Card key={forma.titulo} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Icono className={`h-10 w-10 ${forma.color}`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{forma.titulo}</h3>
                      <p className="text-gray-600 text-sm">{forma.descripcion}</p>
                      <Badge className="mt-2 bg-orange-100 text-orange-800">
                        {forma.puntos}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sistema de niveles */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Niveles de Oyente</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nivelesOyente.map((nivel) => (
            <Card key={nivel.nivel} className="text-center">
              <CardHeader>
                <Badge className={nivel.color}>
                  {nivel.puntos}
                </Badge>
                <CardTitle className="text-lg">{nivel.nivel}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  {nivel.beneficios.map((beneficio, idx) => (
                    <li key={idx} className="flex items-start">
                      <Star className="h-3 w-3 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Información sobre la contribución */}
      <Card className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="h-6 w-6 mr-2" />
                ¿Por qué una Radio de Pago?
              </h3>
              <p className="text-lg opacity-90 mb-4">
                Creemos en el contenido de calidad, sin interrupciones publicitarias. 
                Tu contribución mensual nos permite:
              </p>
              <ul className="space-y-2 opacity-90">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Mantener total independencia editorial
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Producir contenido sin publicidad
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Remunerar justamente al equipo
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Invertir en tecnología de calidad
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <DollarSign className="h-12 w-12 mx-auto mb-4" />
                <div className="text-4xl font-bold">$18</div>
                <div className="text-lg opacity-90">USD por mes</div>
                <div className="text-sm opacity-75 mt-2">
                  Aproximadamente $0.60 por día
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
                  {faq.pregunta}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed pl-7">
                  {faq.respuesta}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-center">
        <CardContent className="p-8">
          <Radio className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">¿Listo para ser parte?</h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Únete a Radio Community y sé parte de una comunidad que construye su propia radio. 
            Tu voz importa, tus ideas cuentan.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-2" />
            Quiero ser Oyente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
