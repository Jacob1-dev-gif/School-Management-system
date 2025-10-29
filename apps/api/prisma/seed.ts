import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create School
  const school = await prisma.school.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: process.env.SCHOOL_NAME || 'Demo High School',
      address: 'Monrovia, Liberia',
      phone: '+231-777-123456',
      email: 'info@demoschool.lr',
      motto: 'Education for Excellence',
      timezone: 'Africa/Monrovia',
      currency: 'LRD',
    },
  });
  console.log('✅ School created:', school.name);

  // Create Roles
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

  const createdRoles = {};
  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    createdRoles[role.name] = created;
  }
  console.log('✅ Roles created');

  // Create Permissions
  const permissions = [
    'MANAGE_USERS', 'VIEW_USERS',
    'MANAGE_ACADEMIC_YEAR', 'MANAGE_CLASSES', 'MANAGE_SUBJECTS',
    'MANAGE_STUDENTS', 'VIEW_STUDENTS',
    'MANAGE_ATTENDANCE', 'VIEW_ATTENDANCE',
    'MANAGE_ASSESSMENTS', 'VIEW_ASSESSMENTS',
    'GENERATE_REPORTS', 'VIEW_REPORTS',
    'MANAGE_FEES', 'PROCESS_PAYMENTS', 'VIEW_FINANCE',
    'VIEW_AUDIT_LOGS', 'MANAGE_SETTINGS',
  ];

  const createdPermissions = {};
  for (const perm of permissions) {
    const created = await prisma.permission.upsert({
      where: { name: perm },
      update: {},
      create: { name: perm, description: perm.replace(/_/g, ' ') },
    });
    createdPermissions[perm] = created;
  }
  console.log('✅ Permissions created');

  // Assign permissions to roles
  const adminPermissions = permissions; // Admin gets all
  const principalPermissions = permissions.filter(p => !p.includes('MANAGE_USERS'));
  const registrarPermissions = ['MANAGE_STUDENTS', 'VIEW_STUDENTS', 'MANAGE_CLASSES', 'VIEW_ATTENDANCE'];
  const teacherPermissions = ['VIEW_STUDENTS', 'MANAGE_ATTENDANCE', 'MANAGE_ASSESSMENTS', 'VIEW_ASSESSMENTS'];
  const accountantPermissions = ['MANAGE_FEES', 'PROCESS_PAYMENTS', 'VIEW_FINANCE'];

  async function assignPermissions(roleName: string, permList: string[]) {
    for (const perm of permList) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: createdRoles[roleName].id,
            permissionId: createdPermissions[perm].id,
          },
        },
        update: {},
        create: {
          roleId: createdRoles[roleName].id,
          permissionId: createdPermissions[perm].id,
        },
      });
    }
  }

  await assignPermissions('ADMIN', adminPermissions);
  await assignPermissions('PRINCIPAL', principalPermissions);
  await assignPermissions('REGISTRAR', registrarPermissions);
  await assignPermissions('TEACHER', teacherPermissions);
  await assignPermissions('ACCOUNTANT', accountantPermissions);
  console.log('✅ Role permissions assigned');

  // Create Admin User
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@school.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+231-777-000000',
      active: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: createdRoles['ADMIN'].id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: createdRoles['ADMIN'].id,
    },
  });
  console.log('✅ Admin user created:', adminEmail);

  // Create Academic Year
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
      current: true,
    },
  });
  console.log('✅ Academic year created:', academicYear.name);

  // Create Terms
  const terms = [
    {
      name: 'First Term',
      type: 'FIRST',
      startDate: new Date(`${currentYear}-09-01`),
      endDate: new Date(`${currentYear}-12-15`),
      current: true,
    },
    {
      name: 'Second Term',
      type: 'SECOND',
      startDate: new Date(`${currentYear + 1}-01-10`),
      endDate: new Date(`${currentYear + 1}-04-15`),
      current: false,
    },
    {
      name: 'Third Term',
      type: 'THIRD',
      startDate: new Date(`${currentYear + 1}-04-20`),
      endDate: new Date(`${currentYear + 1}-06-30`),
      current: false,
    },
  ];

  for (const term of terms) {
    await prisma.term.upsert({
      where: {
        academicYearId_type: {
          academicYearId: academicYear.id,
          type: term.type,
        },
      },
      update: {},
      create: {
        ...term,
        academicYearId: academicYear.id,
      },
    });
  }
  console.log('✅ Terms created');

  // Create Grade Scale (WASSCE/WAEC style)
  const gradeScale = await prisma.gradeScale.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'WASSCE Grade Scale',
      description: 'West African Senior School Certificate Examination grading',
      isDefault: true,
    },
  });

  const gradeBands = [
    { name: 'A1', minScore: 80, maxScore: 100, gpa: 4.0, description: 'Excellent' },
    { name: 'A2', minScore: 75, maxScore: 79, gpa: 3.75, description: 'Very Good' },
    { name: 'B2', minScore: 70, maxScore: 74, gpa: 3.5, description: 'Good' },
    { name: 'B3', minScore: 65, maxScore: 69, gpa: 3.0, description: 'Fairly Good' },
    { name: 'C4', minScore: 60, maxScore: 64, gpa: 2.5, description: 'Credit' },
    { name: 'C5', minScore: 55, maxScore: 59, gpa: 2.0, description: 'Credit' },
    { name: 'C6', minScore: 50, maxScore: 54, gpa: 1.5, description: 'Credit' },
    { name: 'D7', minScore: 45, maxScore: 49, gpa: 1.0, description: 'Pass' },
    { name: 'E8', minScore: 40, maxScore: 44, gpa: 0.5, description: 'Pass' },
    { name: 'F9', minScore: 0, maxScore: 39, gpa: 0.0, description: 'Fail' },
  ];

  for (const band of gradeBands) {
    await prisma.gradeBand.create({
      data: {
        ...band,
        gradeScaleId: gradeScale.id,
      },
    });
  }
  console.log('✅ Grade scale created');

  // Create Subjects
  const subjects = [
    { name: 'Mathematics', code: 'MATH' },
    { name: 'English Language', code: 'ENG' },
    { name: 'Science', code: 'SCI' },
    { name: 'Social Studies', code: 'SS' },
    { name: 'Physics', code: 'PHY' },
    { name: 'Chemistry', code: 'CHEM' },
    { name: 'Biology', code: 'BIO' },
    { name: 'History', code: 'HIST' },
    { name: 'Geography', code: 'GEO' },
    { name: 'Literature', code: 'LIT' },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject,
    });
  }
  console.log('✅ Subjects created');

  // Create Sample Classes
  const classes = [
    { name: 'Grade 10A', gradeLevel: 10, section: 'A', capacity: 40 },
    { name: 'Grade 10B', gradeLevel: 10, section: 'B', capacity: 40 },
    { name: 'Grade 11A', gradeLevel: 11, section: 'A', capacity: 35 },
    { name: 'Grade 12A', gradeLevel: 12, section: 'A', capacity: 30 },
  ];

  for (const cls of classes) {
    await prisma.class.create({
      data: {
        ...cls,
        academicYearId: academicYear.id,
      },
    });
  }
  console.log('✅ Sample classes created');

  // Create Notification Providers
  const emailProvider = await prisma.notificationProvider.upsert({
    where: { name: 'SMTP_EMAIL' },
    update: {},
    create: {
      name: 'SMTP_EMAIL',
      type: 'EMAIL',
      config: JSON.stringify({
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 1025,
      }),
      active: true,
    },
  });

  const smsProvider = await prisma.notificationProvider.upsert({
    where: { name: 'DEV_SMS' },
    update: {},
    create: {
      name: 'DEV_SMS',
      type: 'SMS',
      config: JSON.stringify({ provider: 'log' }),
      active: true,
    },
  });
  console.log('✅ Notification providers created');

  console.log('🎉 Database seeding completed!');
  console.log('');
  console.log('📧 Admin login:');
  console.log('   Email:', adminEmail);
  console.log('   Password:', adminPassword);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
