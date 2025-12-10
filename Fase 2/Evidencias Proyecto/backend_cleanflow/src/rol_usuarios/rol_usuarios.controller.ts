import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RolUsuariosService } from './rol_usuarios.service';
import { CreateRolUsuarioDto, DeleteRolUsuarioDto, UpdateRolUsuarioDto } from './dto/rol_usuario.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { PushService } from 'src/push_token/push_token.service';
import { RolesService } from 'src/roles/roles.service';

@ApiBearerAuth()
@ApiTags('Rol Usuarios')
@Controller('rol_usuarios')
export class RolUsuariosController {
  constructor(private readonly rolUsuariosService: RolUsuariosService,
              private readonly pushService: PushService,
              private readonly rolesService: RolesService
  ) {}

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

  @Roles('Administrador')
  @Post('update')
  @ApiBody({
    schema: {
      example: {
        dtoDelete: { idUsuario: 1, idRol: 1 },
        dtoCreate: { idUsuario: 1, idRol: 2 }
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Rol de usuario actualizado correctamente' })
  async update(@Body() body: UpdateRolUsuarioDto) {
    await this.rolUsuariosService.remove(body.dtoDelete);
    await this.rolUsuariosService.create(body.dtoCreate);

    const rol = await this.rolesService.findOne(body.dtoCreate.idRol);
    
    await this.pushService.sendToUser(
      body.dtoCreate.idUsuario,
      'Rol actualizado',
      `Tu rol ha cambiado a ${rol.descripcionRol}.`
    );
    await this.pushService.sendToRole(
      'Administrador',
      'Rol de usuario actualizado',
      `El usuario con ID ${body.dtoCreate.idUsuario} ha cambiado su rol a ${rol.descripcionRol}.`
    );

    return { message: 'Rol de usuario actualizado correctamente' };
  }
}