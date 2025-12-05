import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadopago.controller';
import { Boleta } from '../boletas/entities/boleta.entity';
import { Pago } from '../pagos/entities/pago.entity';
import { MailModule } from '../mail/mail.module';
import { Stock } from '../stock/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boleta, Pago, Stock]),
    MailModule,
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
