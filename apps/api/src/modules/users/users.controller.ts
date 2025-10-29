import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { createUserSchema, updateUserSchema } from '@school/shared';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('ADMIN', 'PRINCIPAL')
  @ApiOperation({ summary: 'Create user' })
  create(@Body() body: any) {
    const data = createUserSchema.parse(body);
    return this.usersService.create(data);
  }

  @Get()
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'PRINCIPAL', 'REGISTRAR')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN', 'PRINCIPAL')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() body: any) {
    const data = updateUserSchema.parse(body);
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
