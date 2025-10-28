import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';


@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
}
