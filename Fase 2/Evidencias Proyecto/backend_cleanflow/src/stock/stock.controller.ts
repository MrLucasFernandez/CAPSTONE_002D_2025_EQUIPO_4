import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from './dto/stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
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
