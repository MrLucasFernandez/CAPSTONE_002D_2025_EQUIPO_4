import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleta } from './entities/boleta.entity';
import { BoletasService } from './boletas.service';
import { BoletasController } from './boletas.controller';
import { Pago } from '../pagos/entities/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boleta, Pago])],
  providers: [BoletasService],
  controllers: [BoletasController],
})
export class BoletasModule {}
