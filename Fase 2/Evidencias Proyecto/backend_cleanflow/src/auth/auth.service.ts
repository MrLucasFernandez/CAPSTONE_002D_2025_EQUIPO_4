import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { Rol } from 'src/roles/entities/rol.entity';
import { RolUsuario } from 'src/rol_usuarios/entities/rol_usuario.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,

        @InjectRepository(Usuario)
        private usuarioRepo: Repository<Usuario>,

        @InjectRepository(Rol)
        private rolRepo: Repository<Rol>,

        @InjectRepository(RolUsuario)
        private rolUsuarioRepo: Repository<RolUsuario>,
    ) {}

    async validarUsuario(correo: string, password: string): Promise<Omit<Usuario, 'contrasena'>> {
        // Buscar usuario por correo
        const usuario = await this.usuarioRepo.findOne({ where: { correo }, relations: ['roles'] });
        if (!usuario) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        // Validar contraseña
        const passValida = await bcrypt.compare(password, usuario.contrasena);
        if (!passValida) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        return usuario;
    }

    async login(usuario: Omit<Usuario, 'contrasena'>) {
        // Generar payload con rol del usuario
        const roles = usuario.roles.map((rol) => rol.tipoRol) || [];
        const payload = { idUsuario: usuario.idUsuario, correo: usuario.correo, roles };
        // Generar tokens de acceso y refresco
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET}),
            refresh_token: this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET}),
            usuario: {id: usuario.idUsuario, correo: usuario.correo, roles: roles}
        };
    }

    async register( data : { correo: string; contrasena: string, nombreUsuario: string, telefono?: number,
                            apellidoUsuario?: string, rut: string, direccionUsuario?: string }) {

        const usuarioExistente = await this.usuarioRepo.findOne({ where: { correo: data.correo } });
        if (usuarioExistente) {
            throw new ConflictException('El correo ya está registrado');
        }
        // Hash de la contraseña
        const hashPassword = await bcrypt.hash(data.contrasena, 10);
        // Crear nuevo usuario
        const nuevoUsuario = this.usuarioRepo.create({
            correo: data.correo,
            contrasena: hashPassword,
            nombreUsuario: data.nombreUsuario,
            telefono: data.telefono,
            apellidoUsuario: data.apellidoUsuario,
            rut: data.rut,
            direccionUsuario: data.direccionUsuario,
        });

        const usuarioGuardado = await this.usuarioRepo.save(nuevoUsuario);

        // Asignar rol "Cliente" por defecto
        const rolCliente = await this.rolRepo.findOne({ where: { tipoRol: 'Cliente' } });
        const relacionCliente = this.rolUsuarioRepo.create({
            idUsuario: usuarioGuardado.idUsuario,
            idRol: rolCliente?.idRol
        });
        await this.rolUsuarioRepo.save(relacionCliente);
        return {
            message: 'Usuario registrado exitosamente',
            usuario: {
            id: usuarioGuardado.idUsuario,
            correo: usuarioGuardado.correo,
            rolAsignado: rolCliente?.tipoRol,
            },
        };
    } 

    async refreshToken(refresh_token: string) {
        try {
            // Verificar y decodificar el token de refresco
            const payload = this.jwtService.verify(refresh_token, { secret: process.env.JWT_REFRESH_SECRET });
            if (!payload) {
                throw new UnauthorizedException('Token de refresco inválido');
            }
            // Obtener el usuario asociado al token
            const usuario = await this.usuarioRepo.findOne({ where: { idUsuario: payload.idUsuario } });
            if (!usuario) {
                throw new UnauthorizedException('Usuario no encontrado');
            }
            // Generar un nuevo token de acceso
            const nuevoAccessToken = this.jwtService.sign({ id: usuario.idUsuario, correo: usuario.correo, roles: usuario.roles?.map(r => r.tipoRol), }, 
                { secret: process.env.JWT_SECRET});
            
            return {access_token: nuevoAccessToken};
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }

    async getProfile(idUsuario: number) {
        const usuario = await this.usuarioRepo.findOne({
            where: { idUsuario },
            relations: ['roles'],
        });
    
        if (!usuario) throw new NotFoundException('Usuario no encontrado');
    
        const { contrasena, ...safeUser } = usuario;

        return safeUser;
    }
}
