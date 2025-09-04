'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useActionState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CircleIcon, 
  Loader2, 
  Info, 
  Eye, 
  EyeOff, 
  Radio,
  Lock,
  Mail,
  Headphones
} from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn, // Siempre usar signIn ahora
    { error: '' }
  );

  // Detectar si estamos en /sign-up para mostrar mensaje especial
  const isSignUpUrl = pathname === '/sign-up';

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <Radio className="h-12 w-12 text-orange-500" />
            <Headphones className="h-10 w-10 text-orange-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenido de vuelta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresá a tu cuenta de Radio Community
        </p>
        
        {isSignUpUrl && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-orange-700">
                <p className="font-medium mb-1">¿Nuevo en Radio Community?</p>
                <p className="mb-3">
                  Para ser parte de nuestra comunidad, necesitás{' '}
                  <Link href="/participacion" className="underline font-medium hover:text-orange-800">
                    hacer tu aporte mensual
                  </Link>{' '}
                  primero. Si ya sos miembro, ingresá con tus datos.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-3 flex items-center"
              >
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  required
                  maxLength={50}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 sm:text-sm h-12"
                  placeholder="Ingresá tu email"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-3 flex items-center"
              >
                <Lock className="h-4 w-4 text-gray-500 mr-2" />
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={
                    mode === 'signin' ? 'current-password' : 'new-password'
                  }
                  defaultValue={state.password}
                  required
                  minLength={8}
                  maxLength={100}
                  className="pr-12 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 sm:text-sm h-12"
                  placeholder="Ingresá tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-red-700 text-sm font-medium">
                      {state.error === 'Invalid email or password. Please try again.' 
                        ? 'Email o contraseña incorrectos. Intentá de nuevo.'
                        : state.error
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Iniciar sesión
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿No tenés cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/participacion"
                className="w-full flex justify-center items-center py-3 px-4 border-2 border-orange-500 rounded-lg shadow-sm text-sm font-medium text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                <Radio className="mr-2 h-4 w-4" />
                Convertite en miembro
              </Link>
            </div>
          </div>

          {/* Estadísticas de la comunidad */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
            <p className="text-center text-xs text-gray-600 mb-3 font-medium">Nuestra comunidad</p>
            <div className="flex justify-around text-xs">
              <div className="text-center">
                <div className="font-bold text-orange-600 text-lg">127</div>
                <div className="text-gray-500">Miembros activos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600 text-lg">18</div>
                <div className="text-gray-500">Semanas restantes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600 text-lg">$42K</div>
                <div className="text-gray-500">Recaudado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Link para volver */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
