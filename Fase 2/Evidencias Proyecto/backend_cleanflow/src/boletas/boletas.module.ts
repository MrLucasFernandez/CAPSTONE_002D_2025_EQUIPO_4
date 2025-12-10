import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleta } from './entities/boleta.entity';
import { BoletasService } from './boletas.service';
import { BoletasController } from './boletas.controller';
import { Pago } from '../pagos/entities/pago.entity';
import { PushTokenModule } from 'src/push_token/push_token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boleta, Pago]), PushTokenModule],
  providers: [BoletasService],
  controllers: [BoletasController],
})
export class BoletasModule {}
