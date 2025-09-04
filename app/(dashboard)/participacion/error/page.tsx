'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'error-general';

  const getErrorInfo = (reason: string) => {
    switch (reason) {
      case 'email-existente':
        return {
          title: 'Email ya registrado',
          message: 'Ya existe una cuenta con este email. Si ya sos miembro, podés iniciar sesión directamente.',
          icon: <AlertTriangle className="h-20 w-20 text-yellow-500" />,
          color: 'yellow',
          solutions: [
            'Iniciá sesión con tus datos existentes',
            'Verificá que hayas usado el email correcto',
            'Si olvidaste tu contraseña, contactanos para recuperarla'
          ],
          primaryAction: '/sign-in',
          primaryText: 'Iniciar sesión',
          showLoginLink: true
        };
      case 'datos-incompletos':
        return {
          title: 'Datos incompletos',
          message: 'Faltan algunos datos requeridos para completar tu registro.',
          icon: <AlertTriangle className="h-20 w-20 text-yellow-500" />,
          color: 'yellow',
          solutions: [
            'Completá todos los campos del formulario',
            'Verificá que tu email sea válido',
            'Asegurate de ingresar un teléfono válido'
          ],
          primaryAction: '/participacion',
          primaryText: 'Completar datos',
          showLoginLink: false
        };
      case 'datos-invalidos':
        return {
          title: 'Datos inválidos',
          message: 'Algunos de los datos ingresados no son válidos. Por favor, verificalos.',
          icon: <AlertTriangle className="h-20 w-20 text-yellow-500" />,
          color: 'yellow',
          solutions: [
            'Verificá que tu email tenga un formato correcto',
            'El teléfono debe tener al menos 5 dígitos',
            'Nombre y apellido deben tener al menos 2 caracteres'
          ],
          primaryAction: '/participacion',
          primaryText: 'Corregir datos',
          showLoginLink: false
        };
      case 'datos-duplicados':
        return {
          title: 'Datos duplicados',
          message: 'Algunos de tus datos ya están registrados en el sistema.',
          icon: <AlertTriangle className="h-20 w-20 text-yellow-500" />,
          color: 'yellow',
          solutions: [
            'Verificá si ya tenés una cuenta creada',
            'Intentá usar un email diferente',
            'Contactanos si creés que es un error'
          ],
          primaryAction: '/sign-in',
          primaryText: 'Verificar cuenta',
          showLoginLink: true
        };
      case 'error-base-datos':
        return {
          title: 'Error del sistema',
          message: 'Hay un problema temporal con nuestros servidores. Intentá más tarde.',
          icon: <XCircle className="h-20 w-20 text-red-500" />,
          color: 'red',
          solutions: [
            'Intentá nuevamente en unos minutos',
            'El problema es temporal y se solucionará pronto',
            'Contactanos si persiste por más de una hora'
          ],
          primaryAction: '/participacion',
          primaryText: 'Reintentar',
          showLoginLink: false
        };
      case 'error-creacion':
        return {
          title: 'Error al crear cuenta',
          message: 'Hubo un problema al crear tu cuenta. Por favor, intentá nuevamente.',
          icon: <XCircle className="h-20 w-20 text-red-500" />,
          color: 'red',
          solutions: [
            'Verificá tu conexión a internet',
            'Intentá usar un email diferente',
            'Contactanos si el problema persiste'
          ],
          primaryAction: '/participacion',
          primaryText: 'Intentar de nuevo',
          showLoginLink: false
        };
      case 'pago-rechazado':
        return {
          title: 'Pago rechazado',
          message: 'Tu método de pago fue rechazado. Verificá tus datos e intentá nuevamente.',
          icon: <XCircle className="h-20 w-20 text-red-500" />,
          color: 'red',
          solutions: [
            'Verificá los datos de tu tarjeta',
            'Asegurate de tener fondos suficientes',
            'Probá con otro método de pago'
          ],
          primaryAction: '/participacion',
          primaryText: 'Intentar de nuevo',
          showLoginLink: false
        };
      default:
        return {
          title: 'Error inesperado',
          message: 'Ocurrió un error inesperado. Por favor, intentá nuevamente más tarde.',
          icon: <XCircle className="h-20 w-20 text-red-500" />,
          color: 'red',
          solutions: [
            'Intentá nuevamente en unos minutos',
            'Verificá tu conexión a internet',
            'Contactanos si el problema persiste'
          ],
          primaryAction: '/participacion',
          primaryText: 'Volver a intentar',
          showLoginLink: false
        };
    }
  };

  const errorInfo = getErrorInfo(reason);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header de error */}
      <section className={`py-16 bg-gradient-to-r from-${errorInfo.color}-500 to-red-500 text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            {errorInfo.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {errorInfo.title}
          </h1>
          <p className="text-xl mb-8 opacity-90">
            {errorInfo.message}
          </p>
        </div>
      </section>

      {/* Información del error y soluciones */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Posibles soluciones */}
            <Card className={`border-2 border-${errorInfo.color}-200 shadow-lg`}>
              <CardHeader className={`bg-${errorInfo.color}-50`}>
                <CardTitle className={`flex items-center text-${errorInfo.color}-700`}>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Posibles soluciones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {errorInfo.solutions.map((solution, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`w-6 h-6 bg-${errorInfo.color}-100 rounded-full flex items-center justify-center mt-0.5`}>
                        <span className={`text-${errorInfo.color}-600 text-sm font-bold`}>{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{solution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center text-blue-700">
                  <Mail className="h-5 w-5 mr-2" />
                  ¿Necesitas ayuda?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  Si el problema persiste o necesitás ayuda adicional, no dudes en contactarnos.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Email de soporte:</strong> soporte@radiocommunity.ar<br />
                    <strong>Horario de atención:</strong> Lunes a viernes de 9 a 18hs
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={errorInfo.primaryAction} className="flex-1">
                <Button 
                  size="lg" 
                  className={`w-full bg-gradient-to-r from-${errorInfo.color}-500 to-red-500 hover:from-${errorInfo.color}-600 hover:to-red-600 text-white`}
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  {errorInfo.primaryText}
                </Button>
              </Link>
              
              {errorInfo.showLoginLink && (
                <Link href="/sign-in" className="flex-1">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Ya soy miembro
                  </Button>
                </Link>
              )}
              
              <Link href="/" className="flex-1">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Volver al inicio
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Radio Community - Tu comunidad, tu programa</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
