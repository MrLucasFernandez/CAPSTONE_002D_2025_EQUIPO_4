import { Module } from '@nestjs/common';
import { BodegasService } from './bodegas.service';
import { BodegasController } from './bodegas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bodega } from './entities/bodega.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bodega])],
  controllers: [BodegasController],
  providers: [BodegasService],
})
export class BodegasModule {}
