'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { users, membershipPayments, type NewUser } from '@/lib/db/schema';
import { hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { invalidateCacheOnPayment } from '@/lib/cache/metrics-cache';
import { secureLog } from '@/lib/utils/secure-logger';

// Esquema para los datos de participación
const participacionSchema = z.object({
  nombre: z.string().min(2).max(50),
  apellido: z.string().min(2).max(50),
  email: z.string().email(),
  telefono: z.string().min(5).max(20),
  codigoPais: z.string(),
  metodoPago: z.enum(['mercadopago', 'paypal'])
});

export async function procesarPagoSimulado(formData: FormData) {
  secureLog.payment('Iniciando procesamiento de pago');
  
  try {
    // Extraer datos del formulario
    const data = {
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      codigoPais: formData.get('codigoPais') as string,
      metodoPago: formData.get('metodoPago') as string
    };

    secureLog.debug('Datos recibidos', data);

    // Validar que todos los campos estén presentes
    if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.codigoPais || !data.metodoPago) {
      secureLog.warn('Error en validación');
      redirect('/participacion/error?reason=datos-incompletos');
    }

    // Validar datos con Zod
    const validatedData = participacionSchema.parse(data);
    secureLog.info('Operación exitosa');

    // Simular delay de procesamiento de pago
    secureLog.debug('Procesando operación');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar si el usuario ya existe (por email)
    secureLog.debug('Verificando datos');
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('❌ Email ya registrado:', validatedData.email);
      redirect('/participacion/error?reason=email-existente');
    }

    // Generar contraseña temporal
    secureLog.auth('Generando credenciales');
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hashPassword(tempPassword);
    secureLog.info('Operación exitosa');

    // Crear nuevo usuario con datos completos
    const newUser: NewUser = {
      email: validatedData.email.toLowerCase().trim(),
      name: `${validatedData.nombre.trim()} ${validatedData.apellido.trim()}`,
      passwordHash,
      role: 'member',
      membershipStatus: 'active', // Activo porque ya "pagó"
      membershipPaidAt: new Date(),
      paymentMethod: validatedData.metodoPago,
      votingRights: true, // Derechos de voto habilitados
      score: 0,
      currentAmount: 1800, // $18 en centavos
      level: 'bronze',
      // Datos adicionales del perfil
      team: null,
      musicalTaste: null,
      age: null,
      province: null
    };

    secureLog.info('Creando usuario');
    let createdUser;
    
    try {
      const result = await db.insert(users).values(newUser).returning();
      createdUser = result[0];
    } catch (dbError: any) {
      secureLog.error('Error en operación', dbError);
      
      // Manejar error de email duplicado específicamente
      if (dbError.code === '23505' && dbError.constraint === 'users_email_unique') {
        secureLog.warn('Error en validación');
        redirect('/participacion/error?reason=email-existente');
      }
      
      // Manejar otros errores de constrains
      if (dbError.code === '23505') {
        secureLog.warn('Error en validación');
        redirect('/participacion/error?reason=datos-duplicados');
      }
      
      // Error general de base de datos
      secureLog.warn('Error en validación');
      redirect('/participacion/error?reason=error-base-datos');
    }

    if (!createdUser) {
      secureLog.warn('Error en validación');
      redirect('/participacion/error?reason=error-creacion');
    }

    console.log('✅ Usuario creado:', createdUser.id);

    // Crear registro de pago de membresía ($18)
    secureLog.payment('Procesando pago');
    try {
      const paymentData = {
        userId: createdUser.id,
        amount: 1800, // $18 en centavos
        paymentMethod: validatedData.metodoPago,
        paymentId: `sim_${Date.now()}_${createdUser.id}`, // ID simulado
        status: 'completed' as const
      };
      
      await db.insert(membershipPayments).values(paymentData);
      secureLog.info('Operación exitosa');
      
      // Invalidar cache de métricas para reflejar el nuevo pago
      await invalidateCacheOnPayment();
    } catch (paymentError) {
      secureLog.warn('Advertencia en operación', paymentError);
      // Continuamos sin registro de pago, el usuario ya fue creado
    }

    // Establecer sesión automáticamente
    secureLog.auth('Estableciendo sesión');
    try {
      await setSession(createdUser);
      secureLog.info('Operación exitosa');
    } catch (sessionError) {
      secureLog.warn('Advertencia en operación', sessionError);
      // Continuamos sin sesión, el usuario puede hacer login manual
    }

    // Redirigir a página de éxito con datos del usuario
    secureLog.info('Operación completada');
    redirect(`/participacion/exito?nombre=${encodeURIComponent(validatedData.nombre)}&apellido=${encodeURIComponent(validatedData.apellido)}&email=${encodeURIComponent(validatedData.email)}&password=${tempPassword}&metodo=${validatedData.metodoPago}`);

  } catch (error: any) {
    secureLog.error('Error en operación', error);
    
    // Manejar errores específicos de validación Zod
    if (error.name === 'ZodError') {
      secureLog.warn('Error en validación');
      redirect('/participacion/error?reason=datos-invalidos');
    }
    
    // Si es un redirect, lo dejamos pasar
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // Error general no manejado
    redirect('/participacion/error?reason=error-general');
  }
}

// Action específica para MercadoPago
export async function pagarConMercadoPago(
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  codigoPais: string
) {
  secureLog.payment('Iniciando pago con MercadoPago');
  
  try {
    // Simular procesamiento de MercadoPago (2-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simular respuesta exitosa de MercadoPago
    const simulatedResponse = {
      status: 'approved',
      payment_id: `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_method: 'mercadopago'
    };
    
    secureLog.payment('Pago MercadoPago simulado exitoso', { payment_id: simulatedResponse.payment_id });
    
    // Procesar el pago internamente
    const formData = new FormData();
    formData.set('nombre', nombre);
    formData.set('apellido', apellido);
    formData.set('email', email);
    formData.set('telefono', telefono);
    formData.set('codigoPais', codigoPais);
    formData.set('metodoPago', 'mercadopago');

    return procesarPagoSimulado(formData);
    
  } catch (error) {
    secureLog.error('Error en pago MercadoPago', error);
    redirect('/participacion/error?reason=error-mercadopago');
  }
}

// Action específica para PayPal
export async function pagarConPayPal(
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  codigoPais: string
) {
  secureLog.payment('Iniciando pago con PayPal');
  
  try {
    // Simular procesamiento de PayPal (3-4 segundos)
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    // Simular respuesta exitosa de PayPal
    const simulatedResponse = {
      status: 'COMPLETED',
      payment_id: `pp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_method: 'paypal'
    };
    
    secureLog.payment('Pago PayPal simulado exitoso', { payment_id: simulatedResponse.payment_id });
    
    // Procesar el pago internamente
    const formData = new FormData();
    formData.set('nombre', nombre);
    formData.set('apellido', apellido);
    formData.set('email', email);
    formData.set('telefono', telefono);
    formData.set('codigoPais', codigoPais);
    formData.set('metodoPago', 'paypal');

    return procesarPagoSimulado(formData);
    
  } catch (error) {
    secureLog.error('Error en pago PayPal', error);
    redirect('/participacion/error?reason=error-paypal');
  }
}
