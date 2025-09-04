import { db } from './drizzle';
import { users, proposals, votes, contributions, proposalComments, membershipPayments, scoreHistory } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function seed() {
  console.log('🌱 Starting seed process for Radio Community...');

  // IMPORTANTE: En producción, usar contraseñas generadas aleatoriamente
  // Para esta demo, usar una contraseña segura y cambiarla después del despliegue
  const password = process.env.DEMO_USER_PASSWORD || 'secure-demo-password-123';
  const passwordHash = await hashPassword(password);

  const testUsers = [
    {
      name: 'Juan Pérez',
      email: 'juan@radio.com',
      passwordHash: passwordHash,
      role: 'member',
      membershipStatus: 'active',
      membershipPaidAt: new Date(),
      paymentMethod: 'mercadopago',
      votingRights: true,
      score: 150,
      level: 'silver',
      team: 'Boca Juniors',
      musicalTaste: 'Rock Nacional',
      age: 35,
      province: 'Buenos Aires',
    },
    {
      name: 'María González',
      email: 'maria@radio.com', 
      passwordHash: passwordHash,
      role: 'member',
      membershipStatus: 'active',
      membershipPaidAt: new Date(),
      paymentMethod: 'paypal',
      votingRights: true,
      score: 420,
      level: 'gold',
      team: 'River Plate',
      musicalTaste: 'Cumbia',
      age: 28,
      province: 'Córdoba',
    },
    {
      name: 'Carlos Mendoza',
      email: 'carlos@radio.com',
      passwordHash: passwordHash,
      role: 'admin',
      membershipStatus: 'active',
      membershipPaidAt: new Date(),
      paymentMethod: 'mercadopago',
      votingRights: true,
      score: 850,
      level: 'platinum',
      team: 'Independiente',
      musicalTaste: 'Tango',
      age: 45,
      province: 'Santa Fe',
    },
    {
      name: 'Ana López',
      email: 'ana@radio.com',
      passwordHash: passwordHash,
      role: 'pending',
      membershipStatus: 'pending',
      votingRights: false,
      score: 0,
      level: 'bronze',
      team: 'San Lorenzo',
      musicalTaste: 'Pop',
      age: 23,
      province: 'Mendoza',
    }
  ];

  console.log('👥 Creating test users...');
  const createdUsers = await db.insert(users).values(testUsers).returning();
  console.log(`✅ Created ${createdUsers.length} users`);

  // Crear propuestas de prueba
  const testProposals = [
    {
      title: 'Nuevo programa de música local',
      description: 'Propuesta para crear un programa semanal dedicado exclusivamente a artistas locales de nuestra provincia.',
      createdBy: createdUsers[0].id,
      status: 'active',
      votesFor: 8,
      votesAgainst: 2,
      targetAmount: 50000, // $500 en centavos
      currentAmount: 25000,
      category: 'programacion',
    },
    {
      title: 'Mejora del equipo de transmisión',
      description: 'Necesitamos actualizar el equipo de audio para mejorar la calidad de transmisión. Esto incluye nuevos micrófonos y mezcladora.',
      createdBy: createdUsers[1].id,
      status: 'active', 
      votesFor: 15,
      votesAgainst: 1,
      targetAmount: 120000, // $1200
      currentAmount: 80000,
      category: 'infraestructura',
    },
    {
      title: 'Festival de radio comunitaria',
      description: 'Organizar un festival anual donde se presenten todas las radios comunitarias de la región.',
      createdBy: createdUsers[2].id,
      status: 'approved',
      votesFor: 25,
      votesAgainst: 3,
      targetAmount: 200000, // $2000
      currentAmount: 200000,
      category: 'eventos',
    }
  ];

  console.log('📋 Creating test proposals...');
  const createdProposals = await db.insert(proposals).values(testProposals).returning();
  console.log(`✅ Created ${createdProposals.length} proposals`);

  // Crear votos de prueba
  const testVotes = [
    { proposalId: createdProposals[0].id, userId: createdUsers[0].id, voteType: 'for' },
    { proposalId: createdProposals[0].id, userId: createdUsers[1].id, voteType: 'for' },
    { proposalId: createdProposals[0].id, userId: createdUsers[2].id, voteType: 'against' },
    { proposalId: createdProposals[1].id, userId: createdUsers[0].id, voteType: 'for' },
    { proposalId: createdProposals[1].id, userId: createdUsers[1].id, voteType: 'for' },
    { proposalId: createdProposals[2].id, userId: createdUsers[2].id, voteType: 'for' },
  ];

  console.log('🗳️ Creating test votes...');
  await db.insert(votes).values(testVotes);
  console.log(`✅ Created ${testVotes.length} votes`);

  // Crear comentarios de prueba
  const testComments = [
    {
      proposalId: createdProposals[0].id,
      userId: createdUsers[1].id,
      comment: '¡Excelente idea! Los artistas locales necesitan más exposición.',
    },
    {
      proposalId: createdProposals[1].id,
      userId: createdUsers[0].id,
      comment: 'Es fundamental mejorar la calidad del audio. Apoyo totalmente.',
    },
    {
      proposalId: createdProposals[2].id,
      userId: createdUsers[1].id,
      comment: 'Un festival sería genial para conectar con otras radios comunitarias.',
    }
  ];

  console.log('💬 Creating test comments...');
  await db.insert(proposalComments).values(testComments);
  console.log(`✅ Created ${testComments.length} comments`);

  // Crear pagos de membresía
  const membershipPaymentsData = [
    {
      userId: createdUsers[0].id,
      amount: 1800, // $18
      paymentMethod: 'mercadopago',
      paymentId: 'mp_123456789',
      status: 'completed',
    },
    {
      userId: createdUsers[1].id,
      amount: 1800,
      paymentMethod: 'paypal',
      paymentId: 'pp_987654321',
      status: 'completed',
    },
    {
      userId: createdUsers[2].id,
      amount: 1800,
      paymentMethod: 'mercadopago', 
      paymentId: 'mp_555666777',
      status: 'completed',
    }
  ];

  console.log('💳 Creating membership payments...');
  await db.insert(membershipPayments).values(membershipPaymentsData);
  console.log(`✅ Created ${membershipPaymentsData.length} membership payments`);

  // Crear historial de puntajes
  const scoreHistoryData = [
    { userId: createdUsers[0].id, activityType: 'VOTE_PROPOSAL', points: 5, description: 'Votó en propuesta de música local' },
    { userId: createdUsers[0].id, activityType: 'COMMENT_PROPOSAL', points: 3, description: 'Comentó en propuesta de equipo' },
    { userId: createdUsers[1].id, activityType: 'CREATE_PROPOSAL', points: 25, description: 'Creó propuesta de mejora de equipo' },
    { userId: createdUsers[1].id, activityType: 'VOTE_PROPOSAL', points: 5, description: 'Votó en propuesta de música local' },
    { userId: createdUsers[2].id, activityType: 'CREATE_PROPOSAL', points: 25, description: 'Creó propuesta de festival' },
    { userId: createdUsers[2].id, activityType: 'PROPOSAL_APPROVED', points: 50, description: 'Su propuesta de festival fue aprobada' },
  ];

  console.log('📊 Creating score history...');
  await db.insert(scoreHistory).values(scoreHistoryData);
  console.log(`✅ Created ${scoreHistoryData.length} score history entries`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`👥 Users: ${createdUsers.length} (3 active members, 1 pending)`);
  console.log(`📋 Proposals: ${createdProposals.length}`);
  console.log(`🗳️ Votes: ${testVotes.length}`);
  console.log(`💬 Comments: ${testComments.length}`);
  console.log(`💳 Membership payments: ${membershipPaymentsData.length}`);
  console.log(`📊 Score entries: ${scoreHistoryData.length}`);
}

seed()
  .catch((error) => {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('🏁 Seed process finished. Exiting...');
    process.exit(0);
  });
