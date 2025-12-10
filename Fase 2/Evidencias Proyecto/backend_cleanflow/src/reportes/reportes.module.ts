import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Boleta } from '../boletas/entities/boleta.entity';
import { DetalleBoleta } from '../detalle_boletas/entities/detalle_boleta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesPdfService } from './reportespdf.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boleta, DetalleBoleta, Producto, Usuario]), MailModule],
  controllers: [ReportesController],
  providers: [ReportesService, ReportesPdfService],
  exports: [ReportesService, ReportesPdfService],
})
export class ReportesModule {}
