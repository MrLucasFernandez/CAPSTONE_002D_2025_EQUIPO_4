import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RolUsuariosService } from './rol_usuarios.service';
import { CreateRolUsuarioDto, DeleteRolUsuarioDto } from './dto/rol_usuario.dto';

@Controller('rol_usuarios')
export class RolUsuariosController {
  constructor(private readonly rolUsuariosService: RolUsuariosService) {}

  @Get()
  getAll() {
    return this.rolUsuariosService.findAll();
  }

  @Get('usuario/:idUsuario')
  getByUsuario(@Param('idUsuario') idUsuario: number) {
    return this.rolUsuariosService.findByUsuario(idUsuario);
  }

  @Get('rol/:idRol')
  getByRol(@Param('idRol') idRol: number) {
    return this.rolUsuariosService.findByRol(idRol);
  }

  @Post()
  create(@Body() dto: CreateRolUsuarioDto) {
    return this.rolUsuariosService.create(dto);
  }

  @Delete()
  remove(@Body() dto: DeleteRolUsuarioDto) {
    return this.rolUsuariosService.remove(dto);
  }
}
