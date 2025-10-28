import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from './dto/stock.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

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

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':idProducto/:idBodega')
  findOne(
    @Param('idProducto') idProducto: number,
    @Param('idBodega') idBodega: number,
  ) {
    return this.stockService.findOne(+idProducto, +idBodega);
  }

  @Get('producto/:idProducto')
  findByProducto(@Param('idProducto') idProducto: number) {
    return this.stockService.findByProducto(+idProducto);
  }
  @Get('bodega/:idBodega')
  findByBodega(@Param('idBodega') idBodega: number) {
    return this.stockService.findByBodega(+idBodega);
  }

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

  @Delete(':idProducto/:idBodega')
  remove(
    @Param('idProducto') idProducto: number,
    @Param('idBodega') idBodega: number,
  ) {
    return this.stockService.remove(+idProducto, +idBodega);
  }
}
