import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('pending'),
  membershipStatus: varchar('membership_status', { length: 20 }).notNull().default('pending'),
  membershipPaidAt: timestamp('membership_paid_at'),
  paymentMethod: varchar('payment_method', { length: 20 }),
  votingRights: boolean('voting_rights').notNull().default(false),
  score: integer('score').notNull().default(0),
  currentAmount: integer('current_amount').notNull().default(1800), // Monto pagado en centavos ($18)
  level: varchar('level', { length: 20 }).notNull().default('bronze'),
  levelUnlockedAt: timestamp('level_unlocked_at').defaultNow(),
  // Campos de perfil adicionales
  team: varchar('team', { length: 100 }), // Equipo de fútbol favorito
  musicalTaste: varchar('musical_taste', { length: 100 }), // Género musical favorito
  age: integer('age'), // Edad del usuario
  province: varchar('province', { length: 100 }), // Provincia donde vive
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Propuestas de la comunidad
export const proposals = pgTable('proposals', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, approved, rejected, completed
  votesFor: integer('votes_for').notNull().default(0),
  votesAgainst: integer('votes_against').notNull().default(0),
  targetAmount: integer('target_amount'), // Si requiere crowdfunding (en pesos argentinos)
  currentAmount: integer('current_amount').default(0),
  category: varchar('category', { length: 50 }), // programacion, infraestructura, eventos, etc.
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  votingEndsAt: timestamp('voting_ends_at'),
});

// Votos en propuestas
export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  proposalId: integer('proposal_id')
    .notNull()
    .references(() => proposals.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  voteType: varchar('vote_type', { length: 10 }).notNull(), // 'for' o 'against'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Contribuciones económicas a propuestas
export const contributions = pgTable('contributions', {
  id: serial('id').primaryKey(),
  proposalId: integer('proposal_id')
    .notNull()
    .references(() => proposals.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(), // Monto en pesos argentinos
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(),
  paymentId: varchar('payment_id', { length: 255 }), // ID del pago en MercadoPago/PayPal
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, completed, failed
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Comentarios en propuestas
export const proposalComments = pgTable('proposal_comments', {
  id: serial('id').primaryKey(),
  proposalId: integer('proposal_id')
    .notNull()
    .references(() => proposals.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Pagos de membresía ($18)
export const membershipPayments = pgTable('membership_payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull().default(1800), // $18 en centavos
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(),
  paymentId: varchar('payment_id', { length: 255 }), // ID del pago en MercadoPago/PayPal
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(),
  relatedId: integer('related_id'), // ID de la propuesta, voto, etc.
  points: integer('points').default(0), // Puntos ganados por esta actividad
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

// Sistema de puntajes - historial de actividades que otorgan puntos
export const scoreHistory = pgTable('score_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  activityType: varchar('activity_type', { length: 50 }).notNull(), // VOTE, CONTRIBUTE, COMMENT, CREATE_PROPOSAL
  points: integer('points').notNull(),
  relatedId: integer('related_id'), // ID de la propuesta, voto, comentario, etc.
  description: text('description'), // Descripción de la actividad
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// RELACIONES
export const usersRelations = relations(users, ({ many }) => ({
  proposals: many(proposals),
  votes: many(votes),
  contributions: many(contributions),
  comments: many(proposalComments),
  activityLogs: many(activityLogs),
  scoreHistory: many(scoreHistory),
  membershipPayments: many(membershipPayments),
}));

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  creator: one(users, {
    fields: [proposals.createdBy],
    references: [users.id],
  }),
  votes: many(votes),
  contributions: many(contributions),
  comments: many(proposalComments),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  proposal: one(proposals, {
    fields: [votes.proposalId],
    references: [proposals.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

export const contributionsRelations = relations(contributions, ({ one }) => ({
  proposal: one(proposals, {
    fields: [contributions.proposalId],
    references: [proposals.id],
  }),
  user: one(users, {
    fields: [contributions.userId],
    references: [users.id],
  }),
}));

export const proposalCommentsRelations = relations(proposalComments, ({ one }) => ({
  proposal: one(proposals, {
    fields: [proposalComments.proposalId],
    references: [proposals.id],
  }),
  user: one(users, {
    fields: [proposalComments.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const scoreHistoryRelations = relations(scoreHistory, ({ one }) => ({
  user: one(users, {
    fields: [scoreHistory.userId],
    references: [users.id],
  }),
}));

export const membershipPaymentsRelations = relations(membershipPayments, ({ one }) => ({
  user: one(users, {
    fields: [membershipPayments.userId],
    references: [users.id],
  }),
}));

// TIPOS TYPESCRIPT
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Proposal = typeof proposals.$inferSelect;
export type NewProposal = typeof proposals.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
export type Contribution = typeof contributions.$inferSelect;
export type NewContribution = typeof contributions.$inferInsert;
export type ProposalComment = typeof proposalComments.$inferSelect;
export type NewProposalComment = typeof proposalComments.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type ScoreHistory = typeof scoreHistory.$inferSelect;
export type NewScoreHistory = typeof scoreHistory.$inferInsert;
export type MembershipPayment = typeof membershipPayments.$inferSelect;
export type NewMembershipPayment = typeof membershipPayments.$inferInsert;

// Tipos compuestos útiles
export type ProposalWithDetails = Proposal & {
  creator: Pick<User, 'id' | 'name' | 'level'>;
  votes: Vote[];
  contributions: Contribution[];
  comments: (ProposalComment & {
    user: Pick<User, 'id' | 'name' | 'level'>;
  })[];
};

export type UserWithStats = User & {
  totalVotes: number;
  totalContributions: number;
  totalComments: number;
  proposalsCreated: number;
};

// Enums y constantes
export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  MEMBERSHIP_PAYMENT = 'MEMBERSHIP_PAYMENT',
  CREATE_PROPOSAL = 'CREATE_PROPOSAL',
  VOTE_PROPOSAL = 'VOTE_PROPOSAL',
  CONTRIBUTE_PROPOSAL = 'CONTRIBUTE_PROPOSAL',
  COMMENT_PROPOSAL = 'COMMENT_PROPOSAL',
  LEVEL_UP = 'LEVEL_UP',
}

export enum UserLevel {
  BRONZE = 'bronze',
  SILVER = 'silver', 
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

export enum MembershipStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

export enum ProposalStatus {
  ACTIVE = 'active',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

// Sistema de puntajes
export const POINTS = {
  VOTE: 5,
  CONTRIBUTE: 15,
  COMMENT: 3,
  CREATE_PROPOSAL: 25,
  PROPOSAL_APPROVED: 50,
} as const;

// Umbrales de niveles
export const LEVEL_THRESHOLDS = {
  [UserLevel.BRONZE]: 0,
  [UserLevel.SILVER]: 100,
  [UserLevel.GOLD]: 300,
  [UserLevel.PLATINUM]: 700,
  [UserLevel.DIAMOND]: 1500,
} as const;
