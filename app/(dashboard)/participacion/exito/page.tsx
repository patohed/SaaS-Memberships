'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Copy, 
  Eye, 
  EyeOff, 
  Heart,
  ArrowRight,
  CreditCard,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ExitoPage() {
  const searchParams = useSearchParams();
  const nombre = searchParams.get('nombre') || '';
  const apellido = searchParams.get('apellido') || '';
  const password = searchParams.get('password') || '';
  const metodo = searchParams.get('metodo') || 'mercadopago';
  
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Extraer email de usuario logueado (se puede obtener del contexto en implementación real)
  const email = searchParams.get('email') || 'usuario@email.com';

  const copyToClipboard = (text: string, type: 'password' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'password') {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const metodoPagoNombre = metodo === 'mercadopago' ? 'MercadoPago' : 'PayPal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header de éxito */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ¡Bienvenido a Radio Community, {nombre}!
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Tu pago fue procesado exitosamente y ya sos parte de la comunidad
          </p>
        </div>
      </section>

      {/* Información del pago */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {/* Confirmación del pago */}
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center text-green-700">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pago Confirmado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto pagado:</span>
                    <span className="font-semibold text-lg">18 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="font-semibold">{metodoPagoNombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-semibold text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprobado
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-semibold">{new Date().toLocaleDateString('es-AR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datos de acceso */}
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center text-orange-700">
                  <User className="h-5 w-5 mr-2" />
                  Datos de Acceso
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700 mb-4">
                    Tu cuenta ha sido creada automáticamente. Guardá estos datos para futuras sesiones:
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de acceso:
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                          {email}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(email, 'email')}
                          className="px-3"
                        >
                          {copiedEmail ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña temporal:
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                          {showPassword ? password : '••••••••'}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="px-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(password, 'password')}
                          className="px-3"
                        >
                          {copiedPassword ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-blue-700">
                      <strong>Importante:</strong> Podés cambiar tu contraseña desde tu perfil una vez que ingreses al dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Qué sigue */}
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">
                  ¿Qué pasa ahora?
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <strong>Acceso inmediato:</strong> Ya tenés acceso completo al dashboard de la comunidad
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <strong>Derechos de voto:</strong> Podés participar en todas las votaciones y propuestas
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <strong>Comunidad activa:</strong> Acceso a contenido exclusivo y eventos de miembros
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Ir al Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/dashboard/como-funciona" className="flex-1">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  Conocer la plataforma
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Si tenés algún problema, podés contactarnos a través del dashboard.</p>
              <p>¡Gracias por ser parte de Radio Community! 🎉</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
