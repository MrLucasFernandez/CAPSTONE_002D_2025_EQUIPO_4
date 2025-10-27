import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Usuario)
        private usuarioRepo: Repository<Usuario>,
    ) {}

    async validarUsuario(correo: string, password: string): Promise<Omit<Usuario, 'contrasena'>> {
        const usuario = await this.usuarioRepo.findOne({ where: { correo } });
        if (!usuario) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        const passValida = await bcrypt.compare(password, usuario.contrasena);
        if (!passValida) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        return usuario;
    }

    async login(usuario: Omit<Usuario, 'contrasena'>) {
        const payload = { id: usuario.idUsuario, correo: usuario.correo };
        return {
            access_token: this.jwtService.sign(payload),
            usuario: {id: usuario.idUsuario, correo: usuario.correo}
        };
    }

    async register( data : { correo: string; contrasena: string, nombreUsuario: string, telefono?: number,
                            apellidoUsuario?: string, rut: string, direccionUsuario?: string }) {
        const usuarioExistente = await this.usuarioRepo.findOne({ where: { correo: data.correo } });
        if (usuarioExistente) {
            throw new ConflictException('El correo ya está registrado');
        }

        const hashPassword = await bcrypt.hash(data.contrasena, 10);

        const nuevoUsuario = this.usuarioRepo.create({
            correo: data.correo,
            contrasena: hashPassword,
            nombreUsuario: data.nombreUsuario,
            telefono: data.telefono,
            apellidoUsuario: data.apellidoUsuario,
            rut: data.rut,
            direccionUsuario: data.direccionUsuario,
        });

        return this.usuarioRepo.save(nuevoUsuario);
    } 
}
