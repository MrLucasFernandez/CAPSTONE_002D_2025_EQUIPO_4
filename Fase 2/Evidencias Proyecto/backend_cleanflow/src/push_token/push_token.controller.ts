import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PushService } from './push_token.service';
import { RegisterTokenDto, SendNotificationDto, SendToRoleDto, SendBroadcastDto } from './dto/push_token.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Push Tokens')
@Controller('push_token')
export class PushController {
  constructor(private readonly pushTokenService: PushService) {}

  @ApiBearerAuth()
  @Public()
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

  
  @ApiBearerAuth()
  @Roles('Administrador')
  @ApiBody({ type: SendToRoleDto })
  @ApiResponse({ status: 201, description: 'Notificación enviada a todos los usuarios del rol' })
  @Post('send-to-role')
  async sendToRole(@Body() dto: SendToRoleDto) {
    return this.pushTokenService.sendToRole(dto.rolNombre, dto.title, dto.body, dto.data);
  }

  @ApiBearerAuth()
  @Roles('Administrador')
  @ApiBody({schema: {
    example: {
      userIds: [1, 2, 3],
      title: 'Notificación importante',
      body: 'Mensaje para múltiples usuarios',
      data: { action: 'order_update' }
    },
  }})
  @ApiResponse({ status: 201, description: 'Notificación enviada a los usuarios especificados' })
  @Post('send-to-users')
  async sendToUsers(@Body() dto: { userIds: number[], title: string, body: string, data?: Record<string, string> }) {
    return this.pushTokenService.sendToUsers(dto.userIds, dto.title, dto.body, dto.data);
  }

  @ApiBearerAuth()
  @Roles('Administrador')
  @ApiBody({ type: SendBroadcastDto })
  @ApiResponse({ status: 201, description: 'Notificación de broadcast enviada a todos los usuarios' })
  @Post('send-broadcast')
  async sendBroadcast(@Body() dto: SendBroadcastDto) {
    return this.pushTokenService.sendBroadcast(dto.title, dto.body, dto.data);
  }
}