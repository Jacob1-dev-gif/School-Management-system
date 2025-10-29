import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
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
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.logout(body.userId, body.refreshToken);
  }
}
