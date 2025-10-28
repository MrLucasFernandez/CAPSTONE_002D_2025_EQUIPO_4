import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  getAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.categoriasService.findOne(id);
  }

  @Post()
  @ApiBody({
    schema: {
      example: {
        nombreCategoria: 'Categoria Ejemplo',
        descripcionCategoria: 'Descripcion de la categoria ejemplo',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Categoria creada correctamente' })
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        nombreCategoria: 'Categoria Actualizada',
        descripcionCategoria: 'Descripcion actualizada de la categoria',
        categoriaActiva: false,
      },  
    },
  })
  @ApiResponse({ status: 200, description: 'Categoria actualizada correctamente' })
  update(@Param('id') id: number, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriasService.remove(id);
  }
}
