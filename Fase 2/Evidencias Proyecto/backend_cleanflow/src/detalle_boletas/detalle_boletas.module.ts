import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleBoleta } from './entities/detalle_boleta.entity';
import { DetalleBoletasService } from './detalle_boletas.service';
import { DetalleBoletasController } from './detalle_boletas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleBoleta])],
  providers: [DetalleBoletasService],
  controllers: [DetalleBoletasController],
})
export class DetalleBoletasModule {}
