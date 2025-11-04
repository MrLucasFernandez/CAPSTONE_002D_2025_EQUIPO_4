import { Controller, Post, Body, Param, Get, Query, Req } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadoPagoController {
    constructor(private readonly mercadoPagoService: MercadoPagoService) {}

    @Post('crear/:idBoleta')
    async crearPreferencia(@Param('idBoleta') idBoleta: number, @Body() body: any) {
        return this.mercadoPagoService.crearPreferencia(idBoleta, body.productos);
    }

    @Post('webhook')
    async recibirWebhook(@Body() data: any) {
        return this.mercadoPagoService.procesarNotificacion(data);
    }

    @Get('success')
    success(@Query() query: any) {
        return { mensaje: 'Pago aprobado', query };
    }

    @Get('failure')
    failure(@Query() query: any) {
        return { mensaje: 'Pago fallido', query };
    }

    @Get('pending')
    pending(@Query() query: any) {
        return { mensaje: 'Pago pendiente', query };
    }
}
