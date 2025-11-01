import { Controller, Get, Post, Body,  Param, Delete, Put } from '@nestjs/common';
import { BodegasService } from './bodegas.service';
import { CreateBodegasDto, UpdateBodegasDto } from './dto/bodega.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Bodegas')
@Controller('bodegas')
export class BodegasController {
  constructor(private readonly bodegasService: BodegasService) {}

  @Roles('Administrador', 'Empleado')
  @Post()
  @ApiBody({
    schema: {
      example: {
        nombre: 'Bodega Central',
        direccion: 'Calle Falsa 123',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Bodega creada correctamente' })
  create(@Body() createBodegasDto: CreateBodegasDto) {
    return this.bodegasService.create(createBodegasDto);
  }
  @Roles('Administrador', 'Empleado')
  @Get()
  getAll() {
    return this.bodegasService.findAll();
  }

  @Roles('Administrador', 'Empleado')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bodegasService.findOne(+id);
  }

  @Roles('Administrador', 'Empleado')
  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        nombre: 'Nuevo Nombre Bodega',
        direccion: 'Avenida Siempre Viva 742',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Bodega actualizada correctamente' })
  update(@Param('id') id: string, @Body() updateBodegasDto: UpdateBodegasDto) {
    return this.bodegasService.update(+id, updateBodegasDto);
  }

  @Roles('Administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bodegasService.remove(+id);
  }
}
