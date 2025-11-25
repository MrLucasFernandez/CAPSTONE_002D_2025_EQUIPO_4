import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Bodega } from 'src/bodegas/entities/bodega.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Bodega, Producto])],
  controllers: [StockController],
  providers: [StockService],
})

export class StockModule {}
