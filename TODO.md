# 📝 TODOs - Radio Community

## 🔄 **Estado Actual del Proyecto**

### ✅ **Completado:**
- [x] Schema de base de datos transformado (teams → community)
- [x] Sistema de usuarios con gamificación (score, levels)
- [x] Campos de perfil social (equipo, música, edad, provincia)
- [x] Tablas para propuestas, votación y crowdfunding
- [x] Migración de base de datos generada
- [x] Estructura de proyecto renombrada a `radio-community`

### 🚧 **En Progreso:**
- [ ] Configuración de base de datos (pendiente para producción)

### 📋 **Próximos Pasos (Orden de Prioridad):**

#### **Fase 1: Backend Core**
- [ ] Actualizar queries.ts para nuevas tablas
- [ ] Crear funciones para sistema de puntajes
- [ ] Implementar lógica de niveles automática
- [ ] APIs para propuestas CRUD
- [ ] APIs para sistema de votación
- [ ] APIs para contribuciones/crowdfunding

#### **Fase 2: Autenticación y Usuarios**
- [ ] Actualizar middleware de autenticación
- [ ] Eliminar dependencias de Stripe de auth
- [ ] Formularios de registro con campos sociales
- [ ] Dashboard de usuario con perfil y estadísticas
- [ ] Sistema de roles (pending → member tras pago)

#### **Fase 3: UI/UX**
- [ ] Página principal con propuestas activas
- [ ] Formulario para crear propuestas
- [ ] Sistema de votación en tiempo real
- [ ] Dashboard de crowdfunding por propuesta
- [ ] Perfil de usuario con medallas/niveles
- [ ] Comentarios en propuestas

#### **Fase 4: Sistema de Pagos**
- [ ] Remover integración Stripe completa
- [ ] Integrar MercadoPago ($18 membresía)
- [ ] Integrar PayPal (contribuciones variables)
- [ ] Webhooks para confirmación de pagos
- [ ] Dashboard financiero transparente

#### **Fase 5: Features Avanzadas**
- [ ] Sistema de notificaciones
- [ ] Filtros por categorías de propuestas
- [ ] Búsqueda y ordenamiento
- [ ] Histórico de actividad del usuario
- [ ] Exportación de datos financieros
- [ ] Panel de administración

#### **Fase 6: Producción**
- [ ] Ver DEPLOYMENT.md
- [ ] Testing completo
- [ ] Performance optimization
- [ ] Security audit
- [ ] Backup strategies

---

## 🎯 **Métricas de Éxito:**
- Usuarios registrados y con membresía pagada
- Propuestas creadas y votadas mensualmente  
- Monto total recaudado via crowdfunding
- Engagement (comentarios, participación)
- Transparencia financiera implementada

---

**📅 Última actualización:** 4 de septiembre, 2025
**🎯 Prioridad actual:** Configurar entorno de desarrollo y completar Fase 1
