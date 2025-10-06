import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolUsuario } from './entities/rol_usuario.entity';
import { RolUsuariosService } from './rol_usuarios.service';
import { RolUsuariosController } from './rol_usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RolUsuario])],
  providers: [RolUsuariosService],
  controllers: [RolUsuariosController],
})
export class RolUsuariosModule {}
