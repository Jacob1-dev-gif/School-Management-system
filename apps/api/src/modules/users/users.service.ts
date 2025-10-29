import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles?: string[];
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (data.roles && data.roles.length > 0) {
      for (const roleName of data.roles) {
        const role = await this.prisma.role.findUnique({
          where: { name: roleName },
        });
        if (role) {
          await this.prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: role.id,
            },
          });
        }
      }
    }

    const { password: _, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async update(id: string, data: Partial<{ email: string; firstName: string; lastName: string; roles: string[] }>) {
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (data.roles) {
      // Remove existing roles
      await this.prisma.userRole.deleteMany({
        where: { userId: id },
      });

      // Add new roles
      for (const roleName of data.roles) {
        const role = await this.prisma.role.findUnique({
          where: { name: roleName },
        });
        if (role) {
          await this.prisma.userRole.create({
            data: {
              userId: id,
              roleId: role.id,
            },
          });
        }
      }
    }

    const { password: _, ...result } = user;
    return result;
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
