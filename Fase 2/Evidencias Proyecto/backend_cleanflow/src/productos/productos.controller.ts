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
  @ApiResponse({ status: 200, description: 'Lista de productos para clientes' })
  getAll() {
    return this.productosService.findAllClientes();
  }

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Get('all')
  @ApiResponse({ status: 200, description: 'Lista de productos para administradores' })
  getAllAdmin() {
    return this.productosService.findAllAdmin();
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
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
  async create(@Body() dto: CreateProductoDto, @UploadedFile() file?: Express.Multer.File,) {
    return this.productosService.create(dto,file);
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
  async update(@Param('id') id: number, @Body() dto: UpdateProductoDto, @UploadedFile() file?: Express.Multer.File,) {
    try {
      return this.productosService.update(id, dto, file);
    } catch (error) {
      throw new Error('Error al actualizar el producto: ' + error.message);
    }
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
  @UseInterceptors(FileInterceptor('imagen'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinaryService.uploadFile(file);
    return { url };
  }
  
  @Public()
  @ApiBearerAuth()
  @Get('categoria/:id')
  getByCategoria(@Param('id') id: number) {
    return this.productosService.buscarPorCategoria(id);
  }

  @Public()
  @ApiBearerAuth()
  @Get('marca/:id')
  getByMarca(@Param('id') id: number) {
    return this.productosService.buscarPorMarca(id);
  }
}
