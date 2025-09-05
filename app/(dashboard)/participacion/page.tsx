'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Heart, 
  Radio,
  ArrowLeft,
  Loader2,
  Headphones,
  User,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Shield,
  Vote
} from 'lucide-react';
import Link from 'next/link';
import { pagarConMercadoPago, pagarConPayPal } from './actions';
import { useMetrics } from '@/lib/hooks/useMetrics';

export default function ParticipacionPage() {
  const { metrics, loading: metricsLoading } = useMetrics();
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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

  const handlePagoMercadoPago = async () => {
    setProcessingMethod('mercadopago');
    setIsProcessingPayment(true);
    
    try {
      // No usar startTransition para permitir redirects
      await pagarConMercadoPago(
        userData.nombre,
        userData.apellido,
        userData.email,
        userData.telefono,
        userData.codigoPais
      );
    } catch (error) {
      console.error('Error en pago MercadoPago:', error);
      setProcessingMethod(null);
      setIsProcessingPayment(false);
    }
  };

  const handlePagoPayPal = async () => {
    setProcessingMethod('paypal');
    setIsProcessingPayment(true);
    
    try {
      // No usar startTransition para permitir redirects
      await pagarConPayPal(
        userData.nombre,
        userData.apellido,
        userData.email,
        userData.telefono,
        userData.codigoPais
      );
    } catch (error) {
      console.error('Error en pago PayPal:', error);
      setProcessingMethod(null);
      setIsProcessingPayment(false);
    }
  };

  const handleBackToForm = () => {
    setStep('form');
  };

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="min-h-screen flex flex-col justify-center">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            
            {/* Logo/Icono central */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <Radio className="h-12 w-12 text-orange-500" />
                <CreditCard className="h-10 w-10 text-orange-600" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Finalizar Membresía
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Elegí tu método de pago preferido
            </p>

            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Button
                    onClick={handlePagoMercadoPago}
                    disabled={isProcessingPayment}
                    className="w-full flex justify-center items-center py-4 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {processingMethod === 'mercadopago' && isProcessingPayment ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pagar con MercadoPago
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handlePagoPayPal}
                    disabled={isProcessingPayment}
                    className="w-full flex justify-center items-center py-4 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {processingMethod === 'paypal' && isProcessingPayment ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-5 w-5" />
                        Pagar con PayPal
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm text-gray-600">
                      Pago seguro · $18/mes · Cancela cuando quieras
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleBackToForm}
              variant="outline"
              className="mt-6 text-gray-500 hover:text-orange-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a editar datos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header minimalista */}
      <div className="min-h-screen flex flex-col justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Logo/Icono central */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Radio className="h-12 w-12 text-orange-500" />
              <Headphones className="h-10 w-10 text-orange-600" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Convertite en Oyente
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              Únete a la comunidad que decide el futuro de la radio
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              $18/mes · 18 semanas · Tu voz cuenta
            </p>
          </div>

          {/* Formulario minimalista */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Información personal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      Nombre
                    </Label>
                    <Input 
                      id="nombre" 
                      placeholder="Ingresá tu nombre" 
                      className="h-12 px-4"
                      value={userData.nombre}
                      onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      Apellido
                    </Label>
                    <Input 
                      id="apellido" 
                      placeholder="Ingresá tu apellido" 
                      className="h-12 px-4"
                      value={userData.apellido}
                      onChange={(e) => setUserData({...userData, apellido: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Ingresá tu email" 
                    className="h-12 px-4"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    required
                  />
                </div>

                {/* Teléfono con código de país */}
                <div>
                  <Label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    Teléfono (WhatsApp)
                  </Label>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <select
                        className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                        placeholder="Ej: 11 1234 5678"
                        className="h-12 px-4"
                        value={userData.telefono}
                        onChange={(e) => setUserData({...userData, telefono: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Beneficios resumidos */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-3 text-center">
                    ¿Qué incluye tu membresía?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <Vote className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="font-medium">Voto en decisiones</p>
                    </div>
                    <div className="text-center">
                      <Radio className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="font-medium">Acceso exclusivo</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="font-medium">Comunidad activa</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full flex justify-center items-center py-4 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-lg font-medium"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Continuar al Pago
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Links de navegación */}
          <div className="mt-8 text-center space-y-4">
            <Link 
              href="/sign-in" 
              className="text-sm text-gray-500 hover:text-orange-600 transition-colors block"
            >
              ¿Ya sos miembro? Iniciá sesión
            </Link>
            
            <Link 
              href="/" 
              className="text-sm text-gray-500 hover:text-orange-600 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Volver al inicio
            </Link>
          </div>

          {/* Estadísticas minimalistas */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {metricsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded mx-auto"></div>
                  ) : (
                    metrics?.activeUsers || 0
                  )}
                </div>
                <div className="text-xs text-gray-500">Miembros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">18</div>
                <div className="text-xs text-gray-500">Semanas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {metricsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mx-auto"></div>
                  ) : (
                    `$${metrics?.dineroTotalRecaudado || 0}`
                  )}
                </div>
                <div className="text-xs text-gray-500">Fondos Recaudados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
