import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from './dto/stock.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Post()
  @ApiBody({
    schema: {
      example: {
        idProducto: 1,
        idBodega: 1,
        cantidad: 100,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Stock creado correctamente' })
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  

  @Public()
  @Get('producto/:idProducto')
  findByProducto(@Param('idProducto') idProducto: number) {
    return this.stockService.findByProducto(idProducto);
  }

  @Public()
  @Get('bodega/:idBodega')
  findByBodega(@Param('idBodega') idBodega: number) {
    return this.stockService.findByBodega(+idBodega);
  }

  @Public()
  @Get(':idProducto/:idBodega')
  findOne(
    @Param('idProducto') idProducto: number,
    @Param('idBodega') idBodega: number,
  ) {
    return this.stockService.findOne(+idProducto, +idBodega);
  }

  @Roles('Administrador', 'Empleado')
  @ApiBearerAuth()
  @Put(':idProducto/:idBodega')
  @ApiBody({
    schema: {
      example: {
        cantidad: 150,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Stock actualizado correctamente' })
  update(
    @Param('idProducto') idProducto: number,
    @Param('idBodega') idBodega: number,
    @Body() dto: UpdateStockDto,
  ) {
    return this.stockService.update(+idProducto, +idBodega, dto);
  }

  @Roles('Administrador')
  @ApiBearerAuth()
  @Delete(':idProducto/:idBodega')
  remove(
    @Param('idProducto') idProducto: number,
    @Param('idBodega') idBodega: number,
  ) {
    return this.stockService.remove(+idProducto, +idBodega);
  }
}
