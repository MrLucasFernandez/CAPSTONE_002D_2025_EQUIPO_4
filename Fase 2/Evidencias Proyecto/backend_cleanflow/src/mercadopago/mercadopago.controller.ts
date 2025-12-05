import { Controller, Post, Body, Param, Get, Query, Req, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';

@ApiBearerAuth()
@ApiTags('MercadoPago')
@Controller('mercadopago')
export class MercadoPagoController {
    constructor(private readonly mercadoPagoService: MercadoPagoService) {}

    @Post('crear/:idBoleta')
    @ApiParam({ name: 'idBoleta', type: Number, description: 'ID de la boleta a pagar', example: 1 })
    @ApiResponse({ status: 201, description: 'Preferencia de pago creada correctamente' })
    async crearPreferencia(@Param('idBoleta', ParseIntPipe) idBoleta: number) {
        return this.mercadoPagoService.crearPreferencia(idBoleta);
    }

    @Public()
    @Post('webhook')
    @ApiParam({ name: 'data', type: Object, description: 'Datos del webhook de MercadoPago' })
    @ApiResponse({ status: 200, description: 'Notificación procesada correctamente' })
    async recibirWebhook(@Body() data: any) {
        console.log('Webhook recibido:', data);
        await this.mercadoPagoService.procesarNotificacion(data);
        return { received: true };
    }
}
