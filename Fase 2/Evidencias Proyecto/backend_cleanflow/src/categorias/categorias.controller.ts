import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';

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
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriasService.remove(id);
  }
}
