import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { Rol } from 'src/roles/entities/rol.entity';
import { RolUsuario } from 'src/rol_usuarios/entities/rol_usuario.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PushTokenModule } from 'src/push_token/push_token.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Usuario, Rol, RolUsuario]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        UsuariosModule,
        PushTokenModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,
        { provide : APP_GUARD, useClass: JwtAuthGuard },
        { provide : APP_GUARD, useClass: RolesGuard },
    ],
    exports: [AuthService],
    
})
export class AuthModule {}
