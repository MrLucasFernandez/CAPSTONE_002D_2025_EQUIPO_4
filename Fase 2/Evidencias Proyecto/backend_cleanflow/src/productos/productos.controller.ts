import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Public()
  @Get()
  getAll() {
    return this.productosService.findAll();
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.productosService.findOne(id);
  }

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Post()
  @ApiBody({
    schema: {
      example: {
        idCategoria: 1,
        sku: 'PROD-001',
        nombreProducto: 'Producto A',
        precioCompraProducto: 1000,/*
        precioVentaProducto: 1500,
        impuestoCompra: 190,
        impuestoVenta: 285,*/
        descripcionProducto: 'Descripcion del Producto A',
        idMarca: 1,
        stockInicial: 50,
        idBodega: 1,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        idCategoria: 2,
        sku: 'PROD-002',
        nombreProducto: 'Producto B',
        precioProducto: 1200,
        precioVentaProducto: 1700,
        descripcionProducto: 'Descripcion del Producto B',
        idMarca: 2,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente' })
  update(@Param('id') id: number, @Body() dto: UpdateProductoDto) {
    return this.productosService.update(id, dto);
  }

  @Roles('Administrador')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productosService.remove(id);
  }
}
