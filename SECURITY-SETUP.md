# 🔐 Guía de Seguridad - Radio Community

## ⚡ Configuración Rápida

```bash
# 1. Configurar variables de entorno de forma segura
npm run setup:security

# 2. Verificar seguridad del proyecto
npm run security:audit

# 3. Configurar base de datos (actualizar POSTGRES_URL en .env)
npm run db:setup

# 4. Iniciar servidor
npm run dev
```

## 🛡️ Scripts de Seguridad

### Auditoría y Mantenimiento
- `npm run security:audit`: Auditoría automática completa
- `npm run security:check`: Verificar vulnerabilidades y dependencias desactualizadas
- `npm run security:update`: Actualizar dependencias y verificar seguridad
- `npm run setup:security`: Configurar variables de entorno seguras

## 🛡️ Variables de Entorno

### Requeridas
- `POSTGRES_URL`: URL de conexión a PostgreSQL
- `AUTH_SECRET`: Clave secreta para JWT (mínimo 32 caracteres)
- `BASE_URL`: URL base de la aplicación

### Opcionales (Pagos)
- `MERCADOPAGO_ACCESS_TOKEN`: Token de acceso de MercadoPago
- `MERCADOPAGO_PUBLIC_KEY`: Clave pública de MercadoPago
- `PAYPAL_CLIENT_ID`: ID de cliente PayPal
- `PAYPAL_CLIENT_SECRET`: Secreto de cliente PayPal

## 🔒 Mejores Prácticas

### ✅ Hacer
- Usar `npm run setup:security` para generar claves seguras
- Mantener `.env` fuera del control de versiones
- Usar variables de entorno del hosting en producción
- Rotar secretos periódicamente

### ❌ NO Hacer
- Nunca subir archivos `.env` a Git
- No usar contraseñas débiles o por defecto
- No compartir credenciales en texto plano
- No reutilizar secretos entre entornos

## 🚨 Checklist de Seguridad

- [ ] `.env` está en `.gitignore`
- [ ] `AUTH_SECRET` tiene 64+ caracteres hexadecimales
- [ ] `POSTGRES_URL` contiene credenciales reales
- [ ] Variables de pago configuradas (si se usan)
- [ ] Secretos diferentes entre desarrollo/producción

## 📋 Validación

El sistema incluye validación automática que verifica:
- Variables requeridas presentes
- Fortaleza de claves secretas
- Detección de valores placeholder

## 🔧 Solución de Problemas

### Error: "Variables de entorno faltantes"
```bash
npm run setup:security
```

### Error: "AUTH_SECRET muy débil"
```bash
# Regenerar con:
openssl rand -hex 32
```

### Error de conexión a base de datos
1. Verificar `POSTGRES_URL` en `.env`
2. Confirmar acceso desde tu IP
3. Verificar credenciales

## 📞 Soporte

Si encuentras problemas de seguridad, reporta inmediatamente siguiendo las pautas en `SECURITY.md`.
