/**
 * Pulso · Seed demo
 *
 * Carga datos plausibles argentinos:
 *  - Nativos Consultora como institución demo (regla del usuario).
 *  - 1 superadmin (Nativos staff).
 *  - 2 profesionales con matrícula y especialidad.
 *  - 3 ciudadanos con perfil clínico realista.
 *  - 1 farmacia.
 *  - Eventos clínicos, consentimientos vigentes y un QR de emergencia activo.
 *
 * Las contraseñas demo son fijas y se imprimen al final.
 */

import 'dotenv/config';
import { randomUUID, createHash, scryptSync, randomBytes } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';

// Supabase usa SSL self-signed; PrismaPg acepta ssl config bajo poolConfig.
const url = new URL(process.env.DATABASE_URL ?? '');
const adapter = new PrismaPg({
  host: url.hostname,
  port: Number(url.port || '5432'),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, '') || 'postgres',
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

const GENESIS_HASH = '0'.repeat(64);

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function appendAudit(opts: {
  actorId: string | null;
  actorRole: Role | null;
  action:
    | 'AUTH_LOGIN_SUCCESS'
    | 'PROFILE_UPDATE'
    | 'EMERGENCY_QR_GENERATED'
    | 'CONSENT_GRANTED'
    | 'CLINICAL_RECORD_CREATED';
  targetType: string;
  targetId: string;
  payload: Record<string, unknown>;
}) {
  const last = await prisma.auditLog.findFirst({ orderBy: { sequenceNum: 'desc' } });
  const previousHash = last?.currentHash ?? GENESIS_HASH;
  const payloadHash = sha256(JSON.stringify(opts.payload));
  const canonical = [
    previousHash,
    payloadHash,
    opts.actorId ?? '',
    opts.action,
    opts.targetType,
    opts.targetId,
  ].join('|');
  const currentHash = sha256(canonical);
  return prisma.auditLog.create({
    data: {
      actorId: opts.actorId,
      actorRole: opts.actorRole,
      action: opts.action,
      targetType: opts.targetType,
      targetId: opts.targetId,
      outcome: 'SUCCESS',
      payloadHash,
      previousHash,
      currentHash,
    },
  });
}

async function main() {
  console.log('🌱 Sembrando Pulso con datos demo...');

  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.emergencyAccessLog.deleteMany(),
    prisma.emergencyAccess.deleteMany(),
    prisma.clinicalDocument.deleteMany(),
    prisma.clinicalRecord.deleteMany(),
    prisma.consent.deleteMany(),
    prisma.micaConversation.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.institutionMembership.deleteMany(),
    prisma.professionalProfile.deleteMany(),
    prisma.citizenProfile.deleteMany(),
    prisma.institution.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ---------- Institución: Nativos Consultora ----------
  const nativos = await prisma.institution.create({
    data: {
      cuit: '30-71234567-9',
      razonSocial: 'Nativos Consultora Digital',
      fantasyName: 'Nativos',
      tipo: 'OTRO',
      provincia: 'CABA',
      localidad: 'Ciudad Autónoma de Buenos Aires',
      direccion: 'Av. Corrientes 1234, Piso 8',
      email: 'hola@nativos.consulting',
      verificadoAt: new Date(),
    },
  });

  const hospitalUNQ = await prisma.institution.create({
    data: {
      cuit: '30-99887766-2',
      razonSocial: 'Hospital Universitario Nacional Demo',
      fantasyName: 'Hospital Universitario Demo',
      tipo: 'HOSPITAL_PUBLICO',
      provincia: 'BUENOS_AIRES',
      localidad: 'Bernal',
      direccion: 'Av. Rivadavia 2358',
      verificadoAt: new Date(),
    },
  });

  // ---------- Superadmin Nativos ----------
  const superadmin = await prisma.user.create({
    data: {
      email: 'admin@pulso.demo',
      passwordHash: hashPassword('Pulso2026!'),
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      mfaEnabled: true,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.institutionMembership.create({
    data: {
      userId: superadmin.id,
      institutionId: nativos.id,
      rolEnInstitucion: 'Director de Plataforma',
    },
  });

  // ---------- Profesionales ----------
  const drGonzalez = await prisma.user.create({
    data: {
      email: 'martin.gonzalez@pulso.demo',
      passwordHash: hashPassword('Pulso2026!'),
      role: 'PROFESIONAL',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      professionalProfile: {
        create: {
          nombre: 'Martín',
          apellido: 'González',
          matriculaNacional: 'MN 123456',
          matriculaProvincial: 'MP CABA 78910',
          provinciaMatricula: 'CABA',
          especialidades: ['CLINICA_MEDICA', 'EMERGENTOLOGIA'],
          verificadoAt: new Date(),
        },
      },
    },
    include: { professionalProfile: true },
  });

  const draFernandez = await prisma.user.create({
    data: {
      email: 'lucia.fernandez@pulso.demo',
      passwordHash: hashPassword('Pulso2026!'),
      role: 'PROFESIONAL',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      professionalProfile: {
        create: {
          nombre: 'Lucía',
          apellido: 'Fernández',
          matriculaNacional: 'MN 234567',
          matriculaProvincial: 'MP BSAS 45612',
          provinciaMatricula: 'BUENOS_AIRES',
          especialidades: ['PEDIATRIA'],
          verificadoAt: new Date(),
        },
      },
    },
    include: { professionalProfile: true },
  });

  // ---------- Farmacia ----------
  await prisma.user.create({
    data: {
      email: 'farmacia.central@pulso.demo',
      passwordHash: hashPassword('Pulso2026!'),
      role: 'FARMACIA',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  // ---------- Ciudadanos ----------
  const ciudadanos = [
    {
      email: 'ana.martini@pulso.demo',
      dni: '32145678',
      cuil: '27-32145678-4',
      nombre: 'Ana',
      apellido: 'Martini',
      fechaNacimiento: new Date('1985-04-12'),
      sexoBiologico: 'FEMENINO' as const,
      generoAutopercibido: 'FEMENINO' as const,
      provincia: 'CABA' as const,
      localidad: 'Palermo',
      telefono: '+54 9 11 4567 8910',
      grupoSanguineo: 'O_POSITIVO' as const,
      contactoEmergencia: {
        nombre: 'Carlos Martini',
        telefono: '+54 9 11 5566 7788',
        relacion: 'CONYUGE',
      },
      cobertura: {
        tipo: 'OBRA_SOCIAL',
        obraSocial: 'OSDE',
        numeroAfiliado: '60123456789-01',
        plan: '210',
      },
      alergias: [
        { sustancia: 'Penicilina', severidad: 'SEVERA', notas: 'Diagnosticada en 2010' },
        { sustancia: 'Polen de gramíneas', severidad: 'LEVE' },
      ],
      condicionesCriticas: [
        { codigo: 'I10', nombre: 'Hipertensión arterial esencial', desde: '2018-03-01' },
      ],
      medicacionHabitual: [
        {
          nombre: 'Enalapril',
          presentacion: '10 mg',
          posologia: '1 comprimido cada 12 horas',
          motivo: 'Hipertensión',
          desde: '2018-03-15',
        },
      ],
    },
    {
      email: 'pablo.diaz@pulso.demo',
      dni: '28456789',
      cuil: '20-28456789-2',
      nombre: 'Pablo',
      apellido: 'Díaz',
      fechaNacimiento: new Date('1978-11-30'),
      sexoBiologico: 'MASCULINO' as const,
      provincia: 'BUENOS_AIRES' as const,
      localidad: 'La Plata',
      telefono: '+54 9 221 412 3456',
      grupoSanguineo: 'A_POSITIVO' as const,
      contactoEmergencia: {
        nombre: 'María Díaz',
        telefono: '+54 9 221 555 6677',
        relacion: 'HERMANO',
      },
      cobertura: {
        tipo: 'PUBLICA',
      },
      alergias: [],
      condicionesCriticas: [
        { codigo: 'E11', nombre: 'Diabetes mellitus tipo 2', desde: '2020-08-10' },
      ],
      medicacionHabitual: [
        {
          nombre: 'Metformina',
          presentacion: '850 mg',
          posologia: '1 comprimido con cada comida principal',
          motivo: 'Diabetes tipo 2',
          desde: '2020-09-01',
        },
      ],
    },
    {
      email: 'sofia.lopez@pulso.demo',
      dni: '40123987',
      cuil: '27-40123987-1',
      nombre: 'Sofía',
      apellido: 'López',
      fechaNacimiento: new Date('1998-07-22'),
      sexoBiologico: 'FEMENINO' as const,
      generoAutopercibido: 'FEMENINO' as const,
      provincia: 'CORDOBA' as const,
      localidad: 'Córdoba Capital',
      telefono: '+54 9 351 234 5678',
      grupoSanguineo: 'B_NEGATIVO' as const,
      contactoEmergencia: {
        nombre: 'Elena López',
        telefono: '+54 9 351 678 9012',
        relacion: 'MADRE',
      },
      cobertura: {
        tipo: 'PREPAGA',
        prepaga: 'Swiss Medical',
        numeroAfiliado: 'SM-7891234',
        plan: 'SMG20',
      },
      alergias: [{ sustancia: 'Maní', severidad: 'ANAFILACTICA', notas: 'Lleva epinefrina.' }],
      condicionesCriticas: [{ codigo: 'J45', nombre: 'Asma bronquial', desde: '2010-05-01' }],
      medicacionHabitual: [
        {
          nombre: 'Salbutamol',
          presentacion: 'aerosol 100 mcg',
          posologia: 'A demanda en crisis',
          motivo: 'Asma',
        },
      ],
    },
  ];

  const ciudadanoUsers = [];
  for (const c of ciudadanos) {
    const u = await prisma.user.create({
      data: {
        email: c.email,
        passwordHash: hashPassword('Pulso2026!'),
        role: 'CIUDADANO',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
        citizenProfile: {
          create: {
            dni: c.dni,
            cuil: c.cuil,
            nombre: c.nombre,
            apellido: c.apellido,
            fechaNacimiento: c.fechaNacimiento,
            sexoBiologico: c.sexoBiologico,
            generoAutopercibido: c.generoAutopercibido,
            provincia: c.provincia,
            localidad: c.localidad,
            telefono: c.telefono,
            grupoSanguineo: c.grupoSanguineo,
            contactoEmergencia: c.contactoEmergencia,
            cobertura: c.cobertura,
            alergias: c.alergias,
            condicionesCriticas: c.condicionesCriticas,
            medicacionHabitual: c.medicacionHabitual,
          },
        },
      },
      include: { citizenProfile: true },
    });
    ciudadanoUsers.push(u);
  }

  const ana = ciudadanoUsers[0]!;
  const pablo = ciudadanoUsers[1]!;
  const sofia = ciudadanoUsers[2]!;

  // ---------- Consentimientos vigentes ----------
  const consentAna = await prisma.consent.create({
    data: {
      ciudadanoId: ana.id,
      profesionalId: drGonzalez.professionalProfile!.id,
      scopes: ['PERFIL_COMPLETO', 'TIMELINE_CLINICO', 'CARGA_EVOLUCION'],
      motivo: 'Control clínico anual',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });
  await appendAudit({
    actorId: ana.id,
    actorRole: 'CIUDADANO',
    action: 'CONSENT_GRANTED',
    targetType: 'Consent',
    targetId: consentAna.id,
    payload: { scopes: consentAna.scopes },
  });

  await prisma.consent.create({
    data: {
      ciudadanoId: sofia.id,
      profesionalId: draFernandez.professionalProfile!.id,
      scopes: ['PERFIL_COMPLETO', 'TIMELINE_CLINICO'],
      motivo: 'Seguimiento de asma',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
  });

  // ---------- Eventos clínicos ----------
  const evolucionAna = await prisma.clinicalRecord.create({
    data: {
      ciudadanoId: ana.citizenProfile!.id,
      profesionalId: drGonzalez.professionalProfile!.id,
      institucionId: nativos.id,
      tipo: 'EVOLUCION',
      titulo: 'Control de tensión arterial',
      descripcion:
        'Paciente refiere buena adherencia al enalapril. TA 128/82. Continúa esquema actual. Próximo control en 3 meses.',
      ocurridoEn: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    },
  });
  await appendAudit({
    actorId: drGonzalez.id,
    actorRole: 'PROFESIONAL',
    action: 'CLINICAL_RECORD_CREATED',
    targetType: 'ClinicalRecord',
    targetId: evolucionAna.id,
    payload: { tipo: 'EVOLUCION', ciudadanoId: ana.id },
  });

  await prisma.clinicalRecord.create({
    data: {
      ciudadanoId: pablo.citizenProfile!.id,
      institucionId: hospitalUNQ.id,
      tipo: 'ESTUDIO',
      titulo: 'Hemoglobina glicosilada',
      descripcion: 'HbA1c: 6.8%. Buen control glucémico.',
      ocurridoEn: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
  });

  await prisma.clinicalRecord.create({
    data: {
      ciudadanoId: sofia.citizenProfile!.id,
      profesionalId: draFernandez.professionalProfile!.id,
      tipo: 'CONSULTA',
      titulo: 'Crisis asmática leve',
      descripcion:
        'Crisis controlada con salbutamol. Sin necesidad de internación. Refuerzo de plan de acción.',
      ocurridoEn: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  });

  // ---------- QR de emergencia activo (Ana) ----------
  const qr = await prisma.emergencyAccess.create({
    data: {
      userId: ana.id,
      token: randomUUID().replace(/-/g, ''),
      ttl: 'D_30',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });
  await appendAudit({
    actorId: ana.id,
    actorRole: 'CIUDADANO',
    action: 'EMERGENCY_QR_GENERATED',
    targetType: 'EmergencyAccess',
    targetId: qr.id,
    payload: { ttl: 'D_30' },
  });

  console.log('\n✅ Seed completo.');
  console.log('─────────────────────────────────────────────');
  console.log('Cuentas demo (contraseña: Pulso2026!)');
  console.log('─────────────────────────────────────────────');
  console.log('  · admin@pulso.demo            — SUPERADMIN');
  console.log('  · martin.gonzalez@pulso.demo  — PROFESIONAL');
  console.log('  · lucia.fernandez@pulso.demo  — PROFESIONAL');
  console.log('  · farmacia.central@pulso.demo — FARMACIA');
  console.log('  · ana.martini@pulso.demo      — CIUDADANO');
  console.log('  · pablo.diaz@pulso.demo       — CIUDADANO');
  console.log('  · sofia.lopez@pulso.demo      — CIUDADANO');
  console.log('─────────────────────────────────────────────');
  console.log(`\n  · QR demo activo de Ana Martini → token: ${qr.token}`);
  console.log(`    URL pública: /q/${qr.token}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
