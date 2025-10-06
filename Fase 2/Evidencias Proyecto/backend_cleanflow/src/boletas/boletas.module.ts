import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleta } from './entities/boleta.entity';
import { BoletasService } from './boletas.service';
import { BoletasController } from './boletas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Boleta])],
  providers: [BoletasService],
  controllers: [BoletasController],
})
export class BoletasModule {}
