import { Controller, Post, Body, UnauthorizedException, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './public.decorator';
import type { Response, Request } from 'express';


@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
                direccionUsuario: 'Calle Falsa 123'
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })

    async register(@Body() data:  { correo: string; contrasena: string, nombreUsuario: string, telefono?: number, 
                                    apellidoUsuario?: string, rut: string, direccionUsuario?: string }) {
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
    async login(@Body() data: { correo: string; contrasena: string }, @Res({ passthrough: true }) res: Response,) {
        const usuario = await this.authService.validarUsuario(data.correo, data.contrasena);
        if (!usuario) throw new UnauthorizedException('Credenciales inválidas');
        const { access_token, refresh_token, usuario: dataUsuario } = await this.authService.login(usuario);

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('access_token', access_token, {
          httpOnly: true,
          secure: isProduction, // 🔥 false en local, true en producción
          sameSite: isProduction ? 'none' : 'lax',
          maxAge: 15 * 60 * 1000,
        });
        
        res.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { message: 'Login exitoso', usuario: dataUsuario };
    }

    @Post('refresh')
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Token renovado correctamente' })
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        
        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) throw new UnauthorizedException('Token requerido');

        const { access_token } = await this.authService.refreshToken(refresh_token);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // Duracion de 15 minutos        
        });
        return { message: 'Token renovado correctamente' };
    }

    @ApiBearerAuth()
    @Post('logout')
    @ApiResponse({ status: 200, description: 'Usuario desconectado correctamente' })
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Sesión cerrada correctamente' };
    }
}
