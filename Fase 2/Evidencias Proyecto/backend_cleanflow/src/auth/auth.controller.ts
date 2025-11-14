import { Controller, Post, Body, UnauthorizedException, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './public.decorator';
import type { Response, Request } from 'express';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiBody({
    schema: {
      example: {
        correo: 'usuario@demo.com',
        contrasena: '123456',
        nombreUsuario: 'Juan',
        apellidoUsuario: 'Pérez',
        rut: '12345678-9',
        telefono: 912345678,
        direccionUsuario: 'Calle Falsa 123',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  async register(
    @Body()
    data: {
      correo: string;
      contrasena: string;
      nombreUsuario: string;
      telefono?: number;
      apellidoUsuario?: string;
      rut: string;
      direccionUsuario?: string;
    },
  ) {
    return this.authService.register(data);
  }

  @Public()
  @Post('login')
  @ApiBody({
    schema: {
      example: {
        correo: 'usuario@demo.com',
        contrasena: '123456',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario autenticado correctamente' })
  async login(
    @Body() data: { correo: string; contrasena: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const usuario = await this.authService.validarUsuario(data.correo, data.contrasena);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const { access_token, refresh_token, usuario: dataUsuario } =
      await this.authService.login(usuario);

    const isProduction = process.env.NODE_ENV === 'production';

    // Configuración reutilizable de cookies según entorno
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    } as const;

    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refresh_token', refresh_token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { message: 'Login exitoso', usuario: dataUsuario };
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      example: {
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Token renovado correctamente' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh_token = req.cookies?.refresh_token;
    if (!refresh_token) throw new UnauthorizedException('Token requerido');

    const { access_token } = await this.authService.refreshToken(refresh_token);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    } as const;

    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    return { message: 'Token renovado correctamente' };
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiResponse({ status: 200, description: 'Usuario desconectado correctamente' })
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    } as const;

    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);

    return { message: 'Sesión cerrada correctamente' };
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Información del usuario logueado' })
  @Get('me')
  async me(@Req() req) {
    return this.authService.getProfile(req.user.idUsuario);
  }
}
