import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Roles('Administrador', 'Empleado')
  @Get()
  getAll() {
    return this.usuariosService.findAll();
  }

  @Roles('Administrador', 'Empleado')
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usuariosService.findOne(id);
  }

  @Roles('Administrador')
  @Post()
  @ApiBody({
    schema: {
      example: {
        correo: 'correo.ejemplo@correo.com',
        nombreUsuario: 'Juan',
        apellidoUsuario: 'Pérez',
        telefono: '912345678',
        rut: '12345678-9',
        direccionUsuario: 'Calle Ejemplo 123',
        contrasena: 'contraseñaSegura123',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Roles('Administrador', 'Empleado')
  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        correo: 'correo.ejemplo@correo.com',
        nombreUsuario: 'Juan',
        apellidoUsuario: 'Pérez',
        telefono: '912345678',
        direccionUsuario: 'Calle Ejemplo 123',
        contrasena: 'contraseñaSegura123',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente' })
  update(@Param('id') id: number, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, dto);
  }

  @Roles('Administrador')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usuariosService.remove(id);
  }
}
