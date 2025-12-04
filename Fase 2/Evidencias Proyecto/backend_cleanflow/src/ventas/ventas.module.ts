import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Boleta } from '../boletas/entities/boleta.entity';
import { DetalleBoleta } from '../detalle_boletas/entities/detalle_boleta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Pago } from '../pagos/entities/pago.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boleta, DetalleBoleta, Producto, Stock, Pago, Usuario]),
    MailModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
