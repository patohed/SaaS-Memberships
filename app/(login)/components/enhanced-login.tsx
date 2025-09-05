'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useActionState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CircleIcon, 
  Loader2, 
  Info, 
  Eye, 
  EyeOff, 
  Radio,
  Lock,
  Mail,
  ArrowRight
} from 'lucide-react';
import { signIn } from '../actions';
import { ActionState } from '@/lib/auth/middleware';

export function EnhancedLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn,
    { error: '' }
  );

  // Detectar si estamos en /sign-up para mostrar mensaje especial
  const isSignUpUrl = pathname === '/sign-up';

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    await formAction(formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <CircleIcon className="h-10 w-10 text-orange-500" />
              <Radio className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-gray-600">
            Ingresá a tu cuenta de Radio Community
          </p>
        </div>

        {/* Mensaje especial para /sign-up */}
        {isSignUpUrl && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-orange-900 mb-1">
                    ¿Nuevo en Radio Community?
                  </p>
                  <p className="text-orange-800 mb-3">
                    Para ser parte de nuestra comunidad, necesitás hacer tu aporte primero.
                  </p>
                  <Link 
                    href="/participacion" 
                    className="inline-flex items-center text-orange-700 hover:text-orange-900 font-medium underline"
                  >
                    Convertite en miembro
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulario de Login */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Iniciar sesión</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              {/* Campos ocultos */}
              <input type="hidden" name="redirect" value={redirect || ''} />
              <input type="hidden" name="priceId" value={priceId || ''} />
              <input type="hidden" name="inviteId" value={inviteId || ''} />
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={state.email}
                    required
                    maxLength={50}
                    className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    defaultValue={state.password}
                    required
                    minLength={8}
                    maxLength={100}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {state?.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-red-600 text-sm">
                      {state.error === 'Invalid email or password. Please try again.' 
                        ? 'Email o contraseña incorrectos. Intentá de nuevo.'
                        : state.error
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={pending || isLoading}
              >
                {(pending || isLoading) ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Iniciar sesión
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Links adicionales */}
        <div className="space-y-4">
          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                ¿No tenés cuenta?
              </span>
            </div>
          </div>

          {/* Call to Action */}
          <Link href="/participacion">
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-medium rounded-lg"
            >
              <Radio className="mr-2 h-5 w-5" />
              Convertite en miembro de Radio Community
            </Button>
          </Link>

          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Nuestra comunidad</p>
              <div className="flex justify-around text-xs">
                <div>
                  <div className="font-bold text-orange-600">127</div>
                  <div className="text-gray-500">Miembros</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">18</div>
                  <div className="text-gray-500">Semanas</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">$42K</div>
                  <div className="text-gray-500">Recaudado</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
