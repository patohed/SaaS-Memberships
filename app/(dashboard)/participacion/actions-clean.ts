/**
 * Application Layer - Actions (Refactorizado con Clean Architecture)
 * Server Actions que actúan como adaptadores entre Next.js y los Use Cases
 */

'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getContainer } from '@/lib/infrastructure/di-container';
import { 
  RegisterUserDTO,
  UseCaseError 
} from '@/lib/application/use-cases';
import { secureLog } from '@/lib/utils/secure-logger';

// Esquema para validación de entrada
const participacionSchema = z.object({
  nombre: z.string().min(2).max(50),
  apellido: z.string().min(2).max(50),
  email: z.string().email(),
  telefono: z.string().min(5).max(20),
  codigoPais: z.string(),
  metodoPago: z.enum(['mercadopago', 'paypal'])
});

/**
 * Server Action para procesar registro de usuario y pago
 * Refactorizado para usar Clean Architecture
 */
export async function procesarPagoSimulado(formData: FormData) {
  secureLog.payment('Iniciando procesamiento de pago');
  
  try {
    // 1. Extraer y validar datos de entrada
    const rawData = {
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      codigoPais: formData.get('codigoPais') as string,
      metodoPago: formData.get('metodoPago') as string
    };

    secureLog.debug('Datos recibidos', rawData);

    // 2. Validar que todos los campos estén presentes
    if (!rawData.nombre || !rawData.apellido || !rawData.email || 
        !rawData.telefono || !rawData.codigoPais || !rawData.metodoPago) {
      secureLog.warn('Error en validación - datos incompletos');
      redirect('/participacion/error?reason=datos-incompletos');
    }

    // 3. Validar datos con Zod
    const validatedData = participacionSchema.parse(rawData);
    secureLog.info('Validación exitosa');

    // 4. Crear DTO para el use case
    const registerUserDTO: RegisterUserDTO = {
      nombre: validatedData.nombre.trim(),
      apellido: validatedData.apellido.trim(),
      email: validatedData.email.toLowerCase().trim(),
      telefono: validatedData.telefono,
      codigoPais: validatedData.codigoPais,
      metodoPago: validatedData.metodoPago
    };

    // 5. Obtener container de dependencias y ejecutar use case
    const container = getContainer();
    const registerUserUseCase = container.getRegisterUserUseCase();
    
    secureLog.debug('Ejecutando use case de registro');
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await registerUserUseCase.execute(registerUserDTO);
    
    secureLog.info('Registro completado exitosamente');

    // 6. Redirigir a página de éxito con datos del resultado
    const params = new URLSearchParams({
      nombre: result.user.nombre,
      apellido: result.user.apellido,
      email: result.user.email,
      password: result.temporaryPassword,
      metodo: result.payment.method
    });

    redirect(`/participacion/exito?${params.toString()}`);

  } catch (error: any) {
    secureLog.error('Error en procesamiento de pago', error);
    
    // Manejar errores específicos del dominio
    if (error instanceof UseCaseError) {
      switch (error.code) {
        case 'EMAIL_ALREADY_EXISTS':
          redirect('/participacion/error?reason=email-existente');
        case 'USER_CREATION_FAILED':
          redirect('/participacion/error?reason=error-creacion');
        default:
          redirect('/participacion/error?reason=error-negocio');
      }
    }
    
    // Manejar errores de validación Zod
    if (error.name === 'ZodError') {
      secureLog.warn('Error en validación Zod');
      redirect('/participacion/error?reason=datos-invalidos');
    }
    
    // Si es un redirect de Next.js, lo dejamos pasar
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // Error general no manejado
    secureLog.error('Error general no manejado', error);
    redirect('/participacion/error?reason=error-general');
  }
}

/**
 * Action específica para MercadoPago
 * Mantiene la misma API pública para compatibilidad
 */
export async function pagarConMercadoPago(
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  codigoPais: string
) {
  const formData = new FormData();
  formData.set('nombre', nombre);
  formData.set('apellido', apellido);
  formData.set('email', email);
  formData.set('telefono', telefono);
  formData.set('codigoPais', codigoPais);
  formData.set('metodoPago', 'mercadopago');

  return procesarPagoSimulado(formData);
}

/**
 * Action específica para PayPal  
 * Mantiene la misma API pública para compatibilidad
 */
export async function pagarConPayPal(
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  codigoPais: string
) {
  const formData = new FormData();
  formData.set('nombre', nombre);
  formData.set('apellido', apellido);
  formData.set('email', email);
  formData.set('telefono', telefono);
  formData.set('codigoPais', codigoPais);
  formData.set('metodoPago', 'paypal');

  return procesarPagoSimulado(formData);
}

/**
 * Action para verificar si un email ya existe
 * Ejemplo de use case simple
 */
export async function verificarEmailExistente(email: string): Promise<boolean> {
  try {
    const container = getContainer();
    const checkUserExistsUseCase = container.getCheckUserExistsUseCase();
    
    return await checkUserExistsUseCase.execute(email);
  } catch (error) {
    secureLog.error('Error verificando email', error);
    return false; // Asumir que no existe en caso de error
  }
}

/**
 * Action para obtener métricas del dashboard
 * Refactorizado para usar Clean Architecture  
 */
export async function obtenerMetricas() {
  try {
    const container = getContainer();
    const getMetricsUseCase = container.getGetMetricsUseCase();
    
    const metrics = await getMetricsUseCase.execute();
    
    return {
      success: true,
      data: metrics
    };
  } catch (error) {
    secureLog.error('Error obteniendo métricas', error);
    
    if (error instanceof UseCaseError) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
    
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}
