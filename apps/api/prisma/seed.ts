import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { WASSCE_GRADE_BANDS, UserRole as UserRoleEnum, Permission } from '@school/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create permissions
  const permissions = await Promise.all(
    Object.values(Permission).map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name, description: `Permission: ${name}` },
      }),
    ),
  );

  console.log('✅ Created permissions');

  // Create roles with permissions
  const rolePermissions = {
    [UserRoleEnum.ADMIN]: Object.values(Permission),
    [UserRoleEnum.PRINCIPAL]: [
      Permission.VIEW_USERS,
      Permission.MANAGE_STUDENTS,
      Permission.VIEW_STUDENTS,
      Permission.MANAGE_ACADEMICS,
      Permission.VIEW_ACADEMICS,
      Permission.VIEW_ATTENDANCE,
      Permission.VIEW_ASSESSMENTS,
      Permission.VIEW_FINANCE,
      Permission.GENERATE_REPORTS,
      Permission.VIEW_REPORTS,
      Permission.VIEW_AUDIT_LOGS,
    ],
    [UserRoleEnum.REGISTRAR]: [
      Permission.MANAGE_STUDENTS,
      Permission.VIEW_STUDENTS,
      Permission.MANAGE_ACADEMICS,
      Permission.VIEW_ACADEMICS,
      Permission.VIEW_ATTENDANCE,
      Permission.VIEW_ASSESSMENTS,
      Permission.GENERATE_REPORTS,
      Permission.VIEW_REPORTS,
    ],
    [UserRoleEnum.TEACHER]: [
      Permission.VIEW_STUDENTS,
      Permission.MANAGE_ATTENDANCE,
      Permission.VIEW_ATTENDANCE,
      Permission.MANAGE_ASSESSMENTS,
      Permission.VIEW_ASSESSMENTS,
      Permission.VIEW_REPORTS,
    ],
    [UserRoleEnum.STUDENT]: [Permission.VIEW_REPORTS],
    [UserRoleEnum.PARENT]: [Permission.VIEW_REPORTS, Permission.VIEW_FINANCE],
    [UserRoleEnum.ACCOUNTANT]: [
      Permission.MANAGE_FINANCE,
      Permission.VIEW_FINANCE,
      Permission.PROCESS_PAYMENTS,
      Permission.GENERATE_REPORTS,
      Permission.VIEW_REPORTS,
    ],
    [UserRoleEnum.LIBRARIAN]: [Permission.VIEW_STUDENTS],
  };

  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `Role: ${roleName}` },
    });

    for (const permName of permissionNames) {
      const permission = permissions.find((p) => p.name === permName);
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  console.log('✅ Created roles with permissions');

  // Create admin user
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
    },
  });

  const adminRole = await prisma.role.findUnique({
    where: { name: UserRoleEnum.ADMIN },
  });

  if (adminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });
  }

  console.log(`✅ Created admin user: ${adminEmail}`);

  // Create sample school
  const school = await prisma.school.upsert({
    where: { code: 'DEMO-001' },
    update: {},
    create: {
      name: 'Demo High School',
      code: 'DEMO-001',
      address: 'Monrovia, Liberia',
      phone: '+231-XXX-XXXX',
      email: 'info@demoschool.lr',
    },
  });

  console.log('✅ Created sample school');

  // Create academic year
  const currentYear = new Date().getFullYear();
  const academicYear = await prisma.academicYear.upsert({
    where: { id: 'temp-id-for-upsert' },
    update: {},
    create: {
      schoolId: school.id,
      name: `${currentYear}/${currentYear + 1}`,
      startDate: new Date(`${currentYear}-09-01`),
      endDate: new Date(`${currentYear + 1}-06-30`),
      isCurrent: true,
    },
  }).catch(async () => {
    // If upsert fails, try to find or create
    const existing = await prisma.academicYear.findFirst({
      where: { schoolId: school.id, name: `${currentYear}/${currentYear + 1}` },
    });
    if (existing) return existing;
    
    return prisma.academicYear.create({
      data: {
        schoolId: school.id,
        name: `${currentYear}/${currentYear + 1}`,
        startDate: new Date(`${currentYear}-09-01`),
        endDate: new Date(`${currentYear + 1}-06-30`),
        isCurrent: true,
      },
    });
  });

  console.log('✅ Created academic year');

  // Create terms
  const term1 = await prisma.term.upsert({
    where: { id: 'temp-term1-id' },
    update: {},
    create: {
      academicYearId: academicYear.id,
      name: 'First Term',
      startDate: new Date(`${currentYear}-09-01`),
      endDate: new Date(`${currentYear}-12-20`),
      isCurrent: true,
    },
  }).catch(async () => {
    const existing = await prisma.term.findFirst({
      where: { academicYearId: academicYear.id, name: 'First Term' },
    });
    if (existing) return existing;
    
    return prisma.term.create({
      data: {
        academicYearId: academicYear.id,
        name: 'First Term',
        startDate: new Date(`${currentYear}-09-01`),
        endDate: new Date(`${currentYear}-12-20`),
        isCurrent: true,
      },
    });
  });

  const term2 = await prisma.term.upsert({
    where: { id: 'temp-term2-id' },
    update: {},
    create: {
      academicYearId: academicYear.id,
      name: 'Second Term',
      startDate: new Date(`${currentYear + 1}-01-10`),
      endDate: new Date(`${currentYear + 1}-04-15`),
      isCurrent: false,
    },
  }).catch(async () => {
    const existing = await prisma.term.findFirst({
      where: { academicYearId: academicYear.id, name: 'Second Term' },
    });
    if (existing) return existing;
    
    return prisma.term.create({
      data: {
        academicYearId: academicYear.id,
        name: 'Second Term',
        startDate: new Date(`${currentYear + 1}-01-10`),
        endDate: new Date(`${currentYear + 1}-04-15`),
        isCurrent: false,
      },
    });
  });

  const term3 = await prisma.term.upsert({
    where: { id: 'temp-term3-id' },
    update: {},
    create: {
      academicYearId: academicYear.id,
      name: 'Third Term',
      startDate: new Date(`${currentYear + 1}-04-20`),
      endDate: new Date(`${currentYear + 1}-06-30`),
      isCurrent: false,
    },
  }).catch(async () => {
    const existing = await prisma.term.findFirst({
      where: { academicYearId: academicYear.id, name: 'Third Term' },
    });
    if (existing) return existing;
    
    return prisma.term.create({
      data: {
        academicYearId: academicYear.id,
        name: 'Third Term',
        startDate: new Date(`${currentYear + 1}-04-20`),
        endDate: new Date(`${currentYear + 1}-06-30`),
        isCurrent: false,
      },
    });
  });

  console.log('✅ Created terms');

  // Create WASSCE grade scale
  const gradeScale = await prisma.gradeScale.upsert({
    where: { id: 'temp-grade-scale-id' },
    update: {},
    create: {
      name: 'WASSCE Standard',
      isDefault: true,
    },
  }).catch(async () => {
    const existing = await prisma.gradeScale.findFirst({
      where: { name: 'WASSCE Standard' },
    });
    if (existing) return existing;
    
    return prisma.gradeScale.create({
      data: {
        name: 'WASSCE Standard',
        isDefault: true,
      },
    });
  });

  for (const band of WASSCE_GRADE_BANDS) {
    await prisma.gradeBand.upsert({
      where: { id: `temp-${band.grade}` },
      update: {},
      create: {
        gradeScaleId: gradeScale.id,
        grade: band.grade,
        minScore: band.minScore,
        maxScore: band.maxScore,
        gradePoint: band.gradePoint,
        description: band.description,
      },
    }).catch(async () => {
      const existing = await prisma.gradeBand.findFirst({
        where: { gradeScaleId: gradeScale.id, grade: band.grade },
      });
      if (existing) return existing;
      
      return prisma.gradeBand.create({
        data: {
          gradeScaleId: gradeScale.id,
          grade: band.grade,
          minScore: band.minScore,
          maxScore: band.maxScore,
          gradePoint: band.gradePoint,
          description: band.description,
        },
      });
    });
  }

  console.log('✅ Created WASSCE grade scale');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
