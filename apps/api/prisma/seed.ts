import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create school
  const school = await prisma.school.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Liberia Model High School',
      address: 'Monrovia, Liberia',
      phone: '+231-XXX-XXXX',
      email: 'info@modelschool.lr',
      motto: 'Excellence Through Education',
    },
  });

  console.log('Created school:', school.name);

  // Create roles
  const roles = [
    { name: 'ADMIN', description: 'System Administrator' },
    { name: 'PRINCIPAL', description: 'School Principal' },
    { name: 'REGISTRAR', description: 'School Registrar' },
    { name: 'TEACHER', description: 'Teacher' },
    { name: 'STUDENT', description: 'Student' },
    { name: 'PARENT', description: 'Parent/Guardian' },
    { name: 'ACCOUNTANT', description: 'Accountant' },
    { name: 'LIBRARIAN', description: 'Librarian' },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }

  console.log('Created roles');

  // Create permissions
  const resources = ['users', 'students', 'classes', 'subjects', 'attendance', 'assessments', 'fees', 'invoices', 'reports'];
  const actions = ['create', 'read', 'update', 'delete'];

  for (const resource of resources) {
    for (const action of actions) {
      await prisma.permission.upsert({
        where: { name: `${resource}:${action}` },
        update: {},
        create: {
          name: `${resource}:${action}`,
          resource,
          action,
          description: `Can ${action} ${resource}`,
        },
      });
    }
  }

  console.log('Created permissions');

  // Assign all permissions to ADMIN role
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole!.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole!.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('Assigned permissions to ADMIN role');

  // Create admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@school.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+231-XXX-XXXX',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole!.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole!.id,
    },
  });

  console.log('Created admin user:', adminEmail);

  // Create academic year
  const currentYear = new Date().getFullYear();
  const academicYear = await prisma.academicYear.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      schoolId: school.id,
      name: `${currentYear}/${currentYear + 1}`,
      startDate: new Date(`${currentYear}-09-01`),
      endDate: new Date(`${currentYear + 1}-06-30`),
      isCurrent: true,
    },
  });

  console.log('Created academic year:', academicYear.name);

  // Create terms
  const terms = [
    {
      name: 'FIRST',
      startDate: new Date(`${currentYear}-09-01`),
      endDate: new Date(`${currentYear}-12-15`),
      isCurrent: true,
    },
    {
      name: 'SECOND',
      startDate: new Date(`${currentYear + 1}-01-05`),
      endDate: new Date(`${currentYear + 1}-04-15`),
      isCurrent: false,
    },
    {
      name: 'THIRD',
      startDate: new Date(`${currentYear + 1}-04-20`),
      endDate: new Date(`${currentYear + 1}-06-30`),
      isCurrent: false,
    },
  ];

  for (const termData of terms) {
    await prisma.term.create({
      data: {
        ...termData,
        academicYearId: academicYear.id,
      },
    });
  }

  console.log('Created terms');

  // Create WASSCE grade scale
  const gradeScale = await prisma.gradeScale.create({
    data: {
      name: 'WASSCE Grading Scale',
      description: 'West African Senior School Certificate Examination grading scale',
      isDefault: true,
    },
  });

  const gradeBands = [
    { band: 'A1', minScore: 90, maxScore: 100, points: 1, description: 'Excellent' },
    { band: 'A2', minScore: 80, maxScore: 89, points: 2, description: 'Very Good' },
    { band: 'B3', minScore: 70, maxScore: 79, points: 3, description: 'Good' },
    { band: 'C4', minScore: 60, maxScore: 69, points: 4, description: 'Credit' },
    { band: 'C5', minScore: 50, maxScore: 59, points: 5, description: 'Credit' },
    { band: 'C6', minScore: 45, maxScore: 49, points: 6, description: 'Credit' },
    { band: 'D7', minScore: 40, maxScore: 44, points: 7, description: 'Pass' },
    { band: 'E8', minScore: 30, maxScore: 39, points: 8, description: 'Pass' },
    { band: 'F9', minScore: 0, maxScore: 29, points: 9, description: 'Fail' },
  ];

  for (const bandData of gradeBands) {
    await prisma.gradeBand.create({
      data: {
        ...bandData,
        gradeScaleId: gradeScale.id,
      },
    });
  }

  console.log('Created WASSCE grade scale');

  // Create sample subjects
  const subjects = [
    { name: 'Mathematics', code: 'MATH', credits: 4 },
    { name: 'English Language', code: 'ENG', credits: 4 },
    { name: 'Science', code: 'SCI', credits: 3 },
    { name: 'Social Studies', code: 'SS', credits: 3 },
    { name: 'Physical Education', code: 'PE', credits: 2 },
  ];

  for (const subjectData of subjects) {
    await prisma.subject.create({
      data: subjectData,
    });
  }

  console.log('Created sample subjects');

  // Create sample fees
  const fees = [
    { name: 'Tuition Fee', description: 'Annual tuition fee', amountLRD: 15000, amountUSD: 100, frequency: 'ANNUAL' },
    { name: 'Registration Fee', description: 'One-time registration', amountLRD: 5000, amountUSD: 35, frequency: 'ONE_TIME' },
    { name: 'Exam Fee', description: 'Per term exam fee', amountLRD: 3000, amountUSD: 20, frequency: 'TERM' },
  ];

  for (const feeData of fees) {
    await prisma.fee.create({
      data: feeData,
    });
  }

  console.log('Created sample fees');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
