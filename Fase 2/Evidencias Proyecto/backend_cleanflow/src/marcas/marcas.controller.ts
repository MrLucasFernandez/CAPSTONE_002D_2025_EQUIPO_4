import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from './dto/marca.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Marcas')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Post()
  @ApiBody({
    schema: {
      example: {
        nombreMarca: 'Marca Ejemplo',
        descripcionMarca: 'Descripción de la marca ejemplo',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Marca creada correctamente' })
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcasService.create(createMarcaDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.marcasService.findAllClientes();
  }

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Get('all')
  findAllAdmin() {
    return this.marcasService.findAllAdmin();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasService.findOne(+id);
  }

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        nombreMarca: 'Marca Actualizada',
        descripcionMarca: 'Descripción actualizada de la marca',
        marcaActiva: false,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Marca actualizada correctamente' })
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcasService.update(+id, updateMarcaDto);
  }

  @Roles('Administrador')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(+id);
  }
}
