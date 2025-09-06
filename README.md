# 🎙️ Radio Community - SaaS Memberships Demo

Una plataforma de radio comunitaria donde cada oyente tiene voz y voto en las decisiones del programa.

**Demo**: [Próximamente en Vercel]

## ✨ Características

### 🏠 Landing Page
- Diseño minimalista y profesional
- Estadísticas en tiempo real de la comunidad
- Call-to-action para registro de oyentes
- Información del proyecto de 18 semanas

### 👤 Sistema de Usuarios
- Registro personalizado para oyentes
- Autenticación segura con JWT
- Perfiles de usuario con estadísticas
- Sistema de niveles y puntos

### 🗳️ Dashboard Completo
- **Mi Perfil**: Información personal y estadísticas de participación
- **Votaciones**: Sistema democrático de decisiones comunitarias
- **Estadísticas**: Métricas personales y de la comunidad
- **Novedades**: Centro de noticias y actualizaciones
- **Cómo Funciona**: Guía completa del sistema de membresía

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## Running Locally

[Install](https://docs.stripe.com/stripe-cli) and log in to your Stripe account:

```bash
stripe login
```

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can also create new users through the `/sign-up` route.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

You can listen for Stripe webhooks locally through their CLI to handle subscription change events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Testing Payments

Are in progress... :D




