# Guía de Despliegue - Radio Community Demo

## Opción 1: Vercel (Recomendado)

### Prerrequisitos
- Cuenta en Vercel (gratuita): https://vercel.com
- Repositorio de GitHub con el código

### Pasos para desplegar:

1. **Subir el código a GitHub**:
   ```bash
   # En la carpeta radio-community
   git init
   git add .
   git commit -m "Initial commit - Radio Community Demo"
   git remote add origin https://github.com/tu-usuario/radio-community.git
   git push -u origin main
   ```

2. **Conectar con Vercel**:
   - Ve a https://vercel.com/dashboard
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js

3. **Configurar variables de entorno**:
   En Vercel dashboard > Project Settings > Environment Variables, agregar:
   ```
   POSTGRES_URL=tu-database-url-de-produccion
   AUTH_SECRET=generar-con-openssl-rand-hex-32
   BASE_URL=https://tu-proyecto.vercel.app
   MERCADOPAGO_ACCESS_TOKEN=your-mercadopago-access-token
   MERCADOPAGO_PUBLIC_KEY=your-mercadopago-public-key
   PAYPAL_CLIENT_ID=your-paypal-client-id
   PAYPAL_CLIENT_SECRET=your-paypal-client-secret
   STRIPE_SECRET_KEY=sk_test_placeholder
   STRIPE_WEBHOOK_SECRET=whsec_placeholder
   ```

4. **Deploy**:
   - Vercel desplegará automáticamente
   - URL disponible en pocos minutos

### Ventajas de Vercel:
- ✅ Despliegue automático desde GitHub
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Optimizado para Next.js
- ✅ Plan gratuito generoso
- ✅ Base de datos ya configurada (Neon)

---

## Opción 2: Railway

### Pasos:
1. **Cuenta en Railway**: https://railway.app
2. **Nuevo proyecto desde GitHub**
3. **Variables de entorno** (las mismas que Vercel)
4. **Deploy automático**

### Ventajas:
- ✅ Fácil configuración
- ✅ Soporte para PostgreSQL nativo
- ✅ Plan gratuito disponible

---

## Opción 3: Netlify

### Pasos:
1. **Cuenta en Netlify**: https://netlify.com
2. **Conectar repositorio**
3. **Build command**: `npm run build`
4. **Publish directory**: `.next`
5. **Variables de entorno**

### Nota:
- Netlify es más para sitios estáticos, pero funciona con Next.js

---

## Recomendación

**Usar Vercel** porque:
1. Creado por el equipo de Next.js
2. Integración perfecta
3. Ya tienes Neon PostgreSQL configurado
4. Despliegue en < 5 minutos
5. Plan gratuito suficiente para demos

## URLs de ejemplo después del despliegue:
- Vercel: `https://radio-community-demo.vercel.app`
- Railway: `https://radio-community-production.up.railway.app`
- Netlify: `https://radio-community-demo.netlify.app`

## Próximos pasos después del despliegue:
1. Configurar dominio personalizado (opcional)
2. Configurar MercadoPago para pagos reales
3. Configurar analytics
4. Configurar monitoring
