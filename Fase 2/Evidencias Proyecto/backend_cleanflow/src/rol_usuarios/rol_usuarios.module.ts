import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolUsuario } from './entities/rol_usuario.entity';
import { RolUsuariosService } from './rol_usuarios.service';
import { RolUsuariosController } from './rol_usuarios.controller';
import { PushTokenModule } from 'src/push_token/push_token.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([RolUsuario]), PushTokenModule, RolesModule],
  providers: [RolUsuariosService],
  controllers: [RolUsuariosController],
})
export class RolUsuariosModule {}
