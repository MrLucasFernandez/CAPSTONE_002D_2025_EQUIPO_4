import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RolUsuariosService } from './rol_usuarios.service';
import { CreateRolUsuarioDto, DeleteRolUsuarioDto } from './dto/rol_usuario.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Rol Usuarios')
@Controller('rol_usuarios')
export class RolUsuariosController {
  constructor(private readonly rolUsuariosService: RolUsuariosService) {}

  @Roles('Administrador', 'Empleado')
  @Get()
  getAll() {
    return this.rolUsuariosService.findAll();
  }

  @Roles('Administrador', 'Empleado')
  @Get('usuario/:idUsuario')
  getByUsuario(@Param('idUsuario') idUsuario: number) {
    return this.rolUsuariosService.findByUsuario(idUsuario);
  }

  @Roles('Administrador', 'Empleado')
  @Get('rol/:idRol')
  getByRol(@Param('idRol') idRol: number) {
    return this.rolUsuariosService.findByRol(idRol);
  }

  @Roles('Administrador')
  @Post()
  @ApiBody({
    schema: {
      example: {
        idUsuario: 1,
        idRol: 1,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Rol de usuario creado correctamente' })
  create(@Body() dto: CreateRolUsuarioDto) {
    return this.rolUsuariosService.create(dto);
  }

  @Roles('Administrador')
  @Delete()
  @ApiBody({
    schema: {
      example: {
        idUsuario: 1,
        idRol: 1,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Rol de usuario eliminado correctamente' })
  remove(@Body() dto: DeleteRolUsuarioDto) {
    return this.rolUsuariosService.remove(dto);
  }
}
