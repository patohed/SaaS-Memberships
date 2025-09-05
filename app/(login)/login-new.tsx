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
  Mail
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
          <div className="flex items-center space-x-2">
            <CircleIcon className="h-10 w-10 text-orange-500" />
            <Radio className="h-8 w-8 text-orange-600" />
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
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  required
                  maxLength={50}
                  className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                  className="pl-10 pr-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
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

            {state?.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-600 text-sm">
                  {state.error === 'Invalid email or password. Please try again.' 
                    ? 'Email o contraseña incorrectos. Intentá de nuevo.'
                    : state.error
                  }
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-105 transition-all duration-200"
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
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-center text-xs text-gray-600 mb-3">Nuestra comunidad</p>
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
