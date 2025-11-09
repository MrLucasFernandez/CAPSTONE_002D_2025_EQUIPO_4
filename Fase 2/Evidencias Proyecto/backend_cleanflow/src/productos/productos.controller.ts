import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService,
              private readonly cloudinaryService: CloudinaryService
  ) {}

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
        precioCompraProducto: 1000,
        descripcionProducto: 'Descripcion del Producto A',
        idMarca: 1,
        stockInicial: 50,
        idBodega: 1,
        urlImagenProducto: 'http://example.com/imagen.jpg',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  @UseInterceptors(FileInterceptor('imagen'))
  async create(@Body() dto: CreateProductoDto, file: Express.Multer.File) {
    return this.productosService.create(dto, file);
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
  @UseInterceptors(FileInterceptor('imagen'))
  update(@Param('id') id: number, @Body() dto: UpdateProductoDto, file: Express.Multer.File) {
    return this.productosService.update(id, dto, file);
  }

  @Roles('Administrador')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productosService.remove(id);
  }

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinaryService.uploadFile(file);
    return { url };
  }
  
}
