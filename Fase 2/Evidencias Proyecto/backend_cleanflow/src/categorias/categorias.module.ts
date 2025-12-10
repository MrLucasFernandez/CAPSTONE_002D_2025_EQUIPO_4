import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Producto } from 'src/productos/entities/producto.entity';
import { PushTokenModule } from 'src/push_token/push_token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Producto]), PushTokenModule],
  providers: [CategoriasService],
  controllers: [CategoriasController],
})
export class CategoriasModule {}
