import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  getAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.productosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProductoDto) {
    return this.productosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productosService.remove(id);
  }
}
