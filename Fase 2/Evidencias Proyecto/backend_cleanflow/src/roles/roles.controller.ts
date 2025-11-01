import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles('Administrador', 'Empleado')
  @Get()
  getAll() {
    return this.rolesService.findAll();
  }

  @Roles('Administrador', 'Empleado')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Roles('Administrador',)
  @Post()
  @ApiBody({
    schema: {
      example: {
        tipoRol: 'Administrador',
        descripcionRol: 'Rol con todos los permisos',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Rol creado correctamente' })
  create(@Body() dto: CreateRolDto) {
    return this.rolesService.create(dto);
  }

  @Roles('Administrador')
  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        tipoRol: 'Usuario',
        descripcionRol: 'Rol con permisos limitados',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return this.rolesService.update(+id, updateRolDto);
  }

  @Roles('Administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
