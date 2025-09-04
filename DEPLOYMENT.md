# 🚀 Guía de Despliegue - Radio Community

## 📋 Lista de Tareas para Producción

### 🗄️ **Configuración de Base de Datos VPS**

#### **Instalación PostgreSQL en Ubuntu/Debian VPS:**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Iniciar y habilitar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear usuario y base de datos
sudo -u postgres psql
CREATE USER radio_admin WITH PASSWORD 'secure_password_here';
CREATE DATABASE radio_community;
GRANT ALL PRIVILEGES ON DATABASE radio_community TO radio_admin;
\q

# Configurar acceso remoto (si es necesario)
sudo nano /etc/postgresql/*/main/postgresql.conf
# Cambiar: listen_addresses = 'localhost' a listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf  
# Agregar: host radio_community radio_admin 0.0.0.0/0 md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

#### **Variables de Entorno Producción:**
```env
# .env en VPS
POSTGRES_URL=postgresql://radio_admin:secure_password_here@localhost:5432/radio_community
AUTH_SECRET=generate-secure-random-string-here
BASE_URL=https://tu-dominio.com
MERCADOPAGO_ACCESS_TOKEN=prod-access-token
MERCADOPAGO_PUBLIC_KEY=prod-public-key
PAYPAL_CLIENT_ID=prod-client-id
PAYPAL_CLIENT_SECRET=prod-client-secret
```

### 🔧 **Pasos de Despliegue:**

1. **Clonar repositorio en VPS**
2. **Instalar Node.js y pnpm**
3. **Configurar PostgreSQL** (ver arriba)
4. **Configurar variables de entorno**
5. **Instalar dependencias:** `pnpm install`
6. **Ejecutar migraciones:** `pnpm db:migrate`
7. **Hacer seed inicial:** `pnpm db:seed`
8. **Build producción:** `pnpm build`
9. **Configurar PM2 o systemd**
10. **Configurar Nginx reverse proxy**
11. **Configurar SSL con Certbot**

### 📊 **Consideraciones de Rendimiento:**
- **Conexiones DB:** Configurar connection pooling
- **Cache:** Implementar Redis para sesiones
- **CDN:** Para archivos estáticos
- **Monitoring:** Logs y métricas de performance

### 💳 **Integración de Pagos:**
- **MercadoPago:** Configurar webhooks para $18 membresía
- **PayPal:** Configurar API para contribuciones
- **Testing:** Probar en sandbox antes de producción

---

**⚠️ RECORDATORIO:** 
- Cambiar todas las contraseñas por defecto
- Configurar backups automáticos de PostgreSQL
- Implementar monitoring de errores
- Configurar rate limiting para APIs
