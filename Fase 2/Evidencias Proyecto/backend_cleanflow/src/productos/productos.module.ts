import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Bodega } from 'src/bodegas/entities/bodega.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PushTokenModule } from 'src/push_token/push_token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto,Stock, Bodega]), CloudinaryModule, PushTokenModule],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
