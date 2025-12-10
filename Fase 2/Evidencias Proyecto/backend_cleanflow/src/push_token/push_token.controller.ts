import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PushService } from './push_token.service';
import { RegisterTokenDto, SendNotificationDto } from './dto/push_token.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Push Tokens')
@Controller('push_token')
export class PushController {
  constructor(private readonly pushTokenService: PushService) {}

  @ApiBearerAuth()
  @Roles('Administrador', 'Empleado')
  @ApiBody({schema: {
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      platform: 'ios',
    },
  }})
  @ApiResponse({ status: 201, description: 'Token registrado correctamente' })
  @Post('register')
  async register(@Body() dto: RegisterTokenDto, @Req() req) {
    const userId = req.user.idUsuario;
    return this.pushTokenService.registerToken(userId, dto.token, dto.platform);
  }

  @ApiBearerAuth()
  @Roles('Administrador', 'Empleado')
  @ApiBody({schema: {
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    },
  }})
  @ApiResponse({ status: 201, description: 'Token eliminado correctamente' })
  @Post('unregister')
  async unregister(@Body() dto: { token: string }) {
    return this.pushTokenService.unregisterToken(dto.token);
  }

  @ApiBearerAuth()
  @Roles('Administrador', 'Empleado')
  @ApiBody({ type: SendNotificationDto })
  @ApiResponse({ status: 201, description: 'Notificación enviada correctamente' })
  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto) {
    return this.pushTokenService.sendToUser(dto.userId, dto.title, dto.body, dto.data);
  }
}