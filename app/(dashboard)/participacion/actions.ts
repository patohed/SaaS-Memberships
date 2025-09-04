'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { users, membershipPayments, type NewUser } from '@/lib/db/schema';
import { hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

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
  console.log('🚀 Iniciando procesarPagoSimulado');
  
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

    console.log('📝 Datos recibidos:', data);

    // Validar que todos los campos estén presentes
    if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.codigoPais || !data.metodoPago) {
      console.log('❌ Datos faltantes');
      redirect('/participacion/error?reason=datos-incompletos');
    }

    // Validar datos con Zod
    const validatedData = participacionSchema.parse(data);
    console.log('✅ Datos validados correctamente');

    // Simular delay de procesamiento de pago
    console.log('⏳ Simulando procesamiento de pago...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar si el usuario ya existe (por email)
    console.log('🔍 Verificando usuario existente por email...');
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
    console.log('🔐 Generando contraseña temporal...');
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hashPassword(tempPassword);
    console.log('✅ Contraseña hasheada');

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

    console.log('👤 Creando usuario en BD...');
    let createdUser;
    
    try {
      const result = await db.insert(users).values(newUser).returning();
      createdUser = result[0];
    } catch (dbError: any) {
      console.error('💥 Error de base de datos:', dbError);
      
      // Manejar error de email duplicado específicamente
      if (dbError.code === '23505' && dbError.constraint === 'users_email_unique') {
        console.log('❌ Email duplicado detectado en BD');
        redirect('/participacion/error?reason=email-existente');
      }
      
      // Manejar otros errores de constrains
      if (dbError.code === '23505') {
        console.log('❌ Violación de restricción única');
        redirect('/participacion/error?reason=datos-duplicados');
      }
      
      // Error general de base de datos
      console.log('❌ Error general de base de datos');
      redirect('/participacion/error?reason=error-base-datos');
    }

    if (!createdUser) {
      console.log('❌ Error al crear usuario - resultado vacío');
      redirect('/participacion/error?reason=error-creacion');
    }

    console.log('✅ Usuario creado:', createdUser.id);

    // Crear registro de pago de membresía ($18)
    console.log('💳 Creando registro de pago...');
    try {
      const paymentData = {
        userId: createdUser.id,
        amount: 1800, // $18 en centavos
        paymentMethod: validatedData.metodoPago,
        paymentId: `sim_${Date.now()}_${createdUser.id}`, // ID simulado
        status: 'completed' as const
      };
      
      await db.insert(membershipPayments).values(paymentData);
      console.log('✅ Registro de pago creado');
    } catch (paymentError) {
      console.error('⚠️ Error al crear registro de pago:', paymentError);
      // Continuamos sin registro de pago, el usuario ya fue creado
    }

    // Establecer sesión automáticamente
    console.log('🔑 Estableciendo sesión...');
    try {
      await setSession(createdUser);
      console.log('✅ Sesión establecida');
    } catch (sessionError) {
      console.error('⚠️ Error al establecer sesión:', sessionError);
      // Continuamos sin sesión, el usuario puede hacer login manual
    }

    // Redirigir a página de éxito con datos del usuario
    console.log('🎉 Redirigiendo a página de éxito...');
    redirect(`/participacion/exito?nombre=${encodeURIComponent(validatedData.nombre)}&apellido=${encodeURIComponent(validatedData.apellido)}&email=${encodeURIComponent(validatedData.email)}&password=${tempPassword}&metodo=${validatedData.metodoPago}`);

  } catch (error: any) {
    console.error('💥 Error en procesarPagoSimulado:', error);
    
    // Manejar errores específicos de validación Zod
    if (error.name === 'ZodError') {
      console.log('❌ Error de validación de datos');
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
  const formData = new FormData();
  formData.set('nombre', nombre);
  formData.set('apellido', apellido);
  formData.set('email', email);
  formData.set('telefono', telefono);
  formData.set('codigoPais', codigoPais);
  formData.set('metodoPago', 'mercadopago');

  return procesarPagoSimulado(formData);
}

// Action específica para PayPal
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
