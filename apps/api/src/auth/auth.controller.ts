import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { loginSchema, refreshTokenSchema, resetPasswordRequestSchema } from '@school/shared';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@school.local' },
        password: { type: 'string', example: 'Admin123!' },
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: { refreshToken: string }) {
    const parsed = refreshTokenSchema.parse(body);
    return this.authService.refresh(parsed.refreshToken);
  }

  @Post('password-reset/request')
  @ApiOperation({ summary: 'Request password reset' })
  async resetPasswordRequest(@Body() body: { email: string }) {
    const parsed = resetPasswordRequestSchema.parse(body);
    return this.authService.resetPasswordRequest(parsed.email);
  }

  @Post('password-reset/confirm')
  @ApiOperation({ summary: 'Confirm password reset' })
  async resetPasswordConfirm(@Body() body: { token: string; password: string }) {
    return this.authService.resetPasswordConfirm(body.token, body.password);
  }
}
