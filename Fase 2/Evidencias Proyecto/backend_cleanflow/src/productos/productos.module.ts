import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Bodega } from 'src/bodegas/entities/bodega.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto,Stock, Bodega])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
