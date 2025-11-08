import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Public } from './public.decorator';

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
    async login(@Body() data: { correo: string; contrasena: string }) {
        const usuario = await this.authService.validarUsuario(data.correo, data.contrasena);
        return this.authService.login(usuario);
    }

    @Post('refresh')
    @ApiBody({
        schema: {
            example: {
                refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Token renovado correctamente' })
    async refresh(@Body() { refresh_token }: { refresh_token: string }) {
        if (!refresh_token) throw new UnauthorizedException('Token requerido');
        return this.authService.refreshToken(refresh_token);
    }

    @Post('logout')
    @ApiResponse({ status: 200, description: 'Usuario desconectado correctamente' })
    async logout() {
        return this.authService.logout();
    }
}
