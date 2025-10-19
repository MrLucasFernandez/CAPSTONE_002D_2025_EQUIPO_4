import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() data: { correo: string; contraseña: string }) {
        const usuario = await this.authService.validarUsuario(data.correo, data.contraseña);
        return this.authService.login(usuario);
    }
    @Post('register')
    async register(@Body() data: { correo: string; contraseña: string }) {
        return this.authService.register(data);
    }
}
