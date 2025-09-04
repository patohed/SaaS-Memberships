'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, type NewUser } from '@/lib/db/schema';
import { hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { validatedAction } from '@/lib/auth/middleware';

const signUpChinoSchema = z.object({
  // Campos básicos del formulario simplificado
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos').max(20),
  codigoPais: z.string().min(1, 'El código de país es requerido').default('+54'),
  
  // Campos opcionales para compatibilidad
  password: z.string().optional().default('temp123456'), // Password temporal
});

export const signUpChino = validatedAction(signUpChinoSchema, async (data, formData) => {
  const { 
    nombre, 
    apellido,
    email, 
    telefono,
    codigoPais,
    password 
  } = data;

  // Combinar nombre y apellido para el campo name de la DB
  const fullName = `${nombre} ${apellido}`;
  const telefonoCompleto = `${codigoPais} ${telefono}`;

  // Verificar si el usuario ya existe
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: 'Ya existe un usuario con este email. ¿Quieres iniciar sesión?',
      email,
      nombre,
      apellido
    };
  }

  const passwordHash = await hashPassword(password);

  const newUser: NewUser = {
    name: fullName,
    email,
    passwordHash,
    age: 25, // Edad por defecto temporal
    province: 'Buenos Aires', // Provincia por defecto temporal
    musicalTaste: null,
    // Usamos el campo bio para guardar el teléfono
    role: 'member',
    membershipStatus: 'pending',
    score: 0,
    level: 'bronze'
  };

  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    return {
      error: 'Error al crear el usuario. Por favor intenta nuevamente.',
      email,
      nombre,
      apellido
    };
  }

  await setSession(createdUser);

  // Redirigir a una página de confirmación o pago
  redirect('/dashboard');
});
