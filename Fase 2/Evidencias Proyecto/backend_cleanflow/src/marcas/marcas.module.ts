import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { PushTokenModule } from 'src/push_token/push_token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Marca, Producto]), PushTokenModule],
  controllers: [MarcasController],
  providers: [MarcasService],
})
export class MarcasModule {}
