'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Heart, 
  Vote,
  Shield,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Calendar,
  Radio,
  Star,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { pagarConMercadoPago, pagarConPayPal } from './actions';

export default function ParticipacionPage() {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [isPending, startTransition] = useTransition();
  const [processingMethod, setProcessingMethod] = useState<'mercadopago' | 'paypal' | null>(null);
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    codigoPais: '+54 Argentina'
  });

  const countryCodes = [
    '+54 Argentina',
    '+56 Chile', 
    '+57 Colombia',
    '+506 Costa Rica',
    '+593 Ecuador',
    '+503 El Salvador',
    '+34 España',
    '+502 Guatemala',
    '+504 Honduras',
    '+52 México',
    '+505 Nicaragua',
    '+507 Panamá',
    '+595 Paraguay',
    '+51 Perú',
    '+1 Puerto Rico',
    '+1 República Dominicana',
    '+598 Uruguay',
    '+58 Venezuela',
    '+1 Estados Unidos'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePagoMercadoPago = () => {
    setProcessingMethod('mercadopago');
    startTransition(async () => {
      await pagarConMercadoPago(
        userData.nombre,
        userData.apellido,
        userData.email,
        userData.telefono,
        userData.codigoPais
      );
    });
  };

  const handlePagoPayPal = () => {
    setProcessingMethod('paypal');
    startTransition(async () => {
      await pagarConPayPal(
        userData.nombre,
        userData.apellido,
        userData.email,
        userData.telefono,
        userData.codigoPais
      );
    });
  };

  const handleBackToForm = () => {
    setStep('form');
  };

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Header */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ¡Gracias {userData.nombre} {userData.apellido}!
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Estás a un paso de ser parte de Radio Community
            </p>
          </div>
        </section>

        {/* Confirmación de pago */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Tu aporte es de</h2>
                  <div className="text-4xl font-bold text-orange-600 mb-4">18 USD</div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      Es un pago único de <strong>18 USD</strong> por tu participación completa en el proyecto.
                    </p>
                    <p className="text-gray-700">
                      Son <strong>18 USD en total</strong> por las 18 semanas completas del proyecto.
                    </p>
                  </div>
                </div>

                {/* Métodos de pago */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-6 hover:border-orange-300 transition-colors">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-lg">
                        MP
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">MercadoPago</h3>
                        <p className="text-gray-600 text-sm">
                          Pagá con tarjeta de crédito, débito, efectivo o transferencia bancaria. 
                          Se cobrará en pesos argentinos. Disponible para Argentina y otros países de Latinoamérica.
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={handlePagoMercadoPago}
                      disabled={isPending}
                    >
                      {isPending && processingMethod === 'mercadopago' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        'Pagar con MercadoPago'
                      )}
                    </Button>
                  </div>

                  <div className="border rounded-lg p-6 hover:border-orange-300 transition-colors">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
                        PP
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">PayPal</h3>
                        <p className="text-gray-600 text-sm">
                          Pagá de forma segura con tu cuenta PayPal o tarjeta de crédito. 
                          Disponible internacionalmente con protección al comprador.
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handlePagoPayPal}
                      disabled={isPending}
                    >
                      {isPending && processingMethod === 'paypal' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        'Pagar con PayPal'
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Cotización USD aproximada: 1 USD = 1.300 ARS (actualizada hoy)
                  </p>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleBackToForm}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al formulario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Únete a Radio Community
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Conviértete en parte de la primera radio democrática de Argentina
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              127 miembros activos
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              18 semanas restantes
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              $42,350 recaudados
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona Radio Community?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un experimento democrático donde cada oyente es dueño de su programa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-2 hover:border-orange-200 transition-colors">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Haces tu aporte</h3>
                <p className="text-gray-600">
                  Con tu contribución te convertís en miembro activo de la comunidad
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-orange-200 transition-colors">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Votas propuestas</h3>
                <p className="text-gray-600">
                  Decidís sobre el contenido, los invitados y el futuro del programa
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-orange-200 transition-colors">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Radio className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Construimos juntos</h3>
                <p className="text-gray-600">
                  El programa se hace realidad según las decisiones de la comunidad
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Descripción del proyecto */}
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Durante 18 semanas, el periodismo depende de vos. Todos los que aporten 18 dólares (1 dólar por semana) 
              serán participantes de una experiencia única: ser una comunidad activa detrás de un programa de radio.
            </p>
          </div>

          {/* Asamblea */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-8 mb-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Asamblea comunitaria</h3>
            <p className="text-lg text-gray-700 mb-4">
              Cada viernes, en los últimos 18 minutos del programa, vamos a decidir juntos sobre qué hacer 
              con el 18% de los fondos compartidos.
            </p>
            <p className="text-gray-600">
              ¿Hacemos una fiesta a fin de año? ¿Lo donamos? ¿O lo acumulamos para hacer algo aún más grande? 
              La comunidad decide en vivo, porque ustedes son los verdaderos dueños.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario de registro */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl">
                <Star className="h-6 w-6 inline mr-2" />
                QUIERO SER OYENTE
              </CardTitle>
              <p className="opacity-90">
                Completá tus datos para ser parte de la comunidad
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información personal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre" 
                      placeholder="Tu nombre" 
                      className="mt-1"
                      value={userData.nombre}
                      onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input 
                      id="apellido" 
                      placeholder="Tu apellido" 
                      className="mt-1"
                      value={userData.apellido}
                      onChange={(e) => setUserData({...userData, apellido: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="mt-1"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    required
                  />
                </div>

                {/* Teléfono con código de país */}
                <div>
                  <Label htmlFor="telefono">Teléfono (WhatsApp)</Label>
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    <div className="col-span-2">
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={userData.codigoPais}
                        onChange={(e) => setUserData({...userData, codigoPais: e.target.value})}
                      >
                        {countryCodes.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="11 1234 5678"
                        value={userData.telefono}
                        onChange={(e) => setUserData({...userData, telefono: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Botón de envío */}
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg py-6"
                  disabled={!userData.nombre || !userData.apellido || !userData.email || !userData.telefono}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  QUIERO SER OYENTE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Al continuar, accedés a una página segura para completar tu aporte de 18 USD
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ rápido */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Esto es una suscripción que me va a cobrar todos los meses?</h4>
                <p className="text-gray-600">
                  No, es un <strong>pago único de 18 USD</strong> por todo el proyecto completo de 18 semanas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Cómo me asocio a Radio Community?</h4>
                <p className="text-gray-600">
                  Es fácil: elegís si pagar con MercadoPago o PayPal, hacés el aporte y ¡listo! Te creamos tu cuenta automáticamente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Cómo funcionan las votaciones?</h4>
                <p className="text-gray-600">
                  Cada viernes hay votaciones sobre diferentes aspectos del programa. Un miembro = un voto.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
