import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from './dto/marca.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Marcas')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @UseGuards(AuthGuard('jwt'))
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

  @Get()
  findAll() {
    return this.marcasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcasService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(+id);
  }
}
