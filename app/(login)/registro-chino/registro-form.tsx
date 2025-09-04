'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, Phone, Mail, User } from 'lucide-react';
import { signUpChino } from './actions';
import { ActionState } from '@/lib/auth/middleware';

// Códigos de país más comunes para Argentina y región
const codigosPais = [
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
];

export function RegistroChino() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUpChino,
    { error: '' }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-orange-500 p-3 rounded-full">
            <Users className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-2">
          ¡QUIERO SER OYENTE!
        </h1>
        <p className="text-center text-lg text-gray-600 mb-2">
          Únete al experimento periodístico más ambicioso
        </p>
        <p className="text-center text-sm text-orange-600 font-medium mb-8">
          🎙️ Durante 18 semanas, vos decidís el rumbo del programa
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-orange-100">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{state.error}</p>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2 text-orange-500" />
                Nombre *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Tu nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2 text-orange-500" />
                Apellido *
              </Label>
              <Input
                id="apellido"
                name="apellido"
                type="text"
                required
                placeholder="Tu apellido"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-orange-500" />
                E-mail *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Teléfono con código de país */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-orange-500" />
                Teléfono (WhatsApp) *
              </Label>
              <div className="flex gap-2">
                {/* Selector de código de país */}
                <Select name="codigoPais" defaultValue="+54">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {codigosPais.map((pais) => (
                      <SelectItem key={pais.code} value={pais.code}>
                        <span className="flex items-center">
                          <span className="mr-2">{pais.flag}</span>
                          {pais.code}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Número de teléfono */}
                <Input
                  name="telefono"
                  type="tel"
                  required
                  placeholder="11 1234-5678"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Necesitamos tu WhatsApp para enviarte actualizaciones importantes del programa
              </p>
            </div>

            {/* Botón de registro */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    CONVERTIRME EN OYENTE
                  </>
                )}
              </Button>
            </div>

            {/* Información adicional */}
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-sm text-orange-700 font-medium mb-1">
                💰 Precio: $18 USD por las 18 semanas
              </p>
              <p className="text-xs text-orange-600">
                Pago único • Sin renovación automática • 100% reembolsable
              </p>
            </div>

            {/* Links adicionales */}
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Al registrarte, aceptas formar parte del experimento periodístico más innovador de Latinoamérica
              </p>
              
              <div className="flex justify-center space-x-4 text-xs">
                <Link href="/terminos" className="text-orange-600 hover:text-orange-800">
                  Términos y condiciones
                </Link>
                <Link href="/privacidad" className="text-orange-600 hover:text-orange-800">
                  Privacidad
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
