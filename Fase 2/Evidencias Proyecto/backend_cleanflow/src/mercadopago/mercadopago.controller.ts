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
    async recibirWebhook(@Query('secret') @Body() data: any) {
        if (!data?.data?.id) {
            return { status: 'ignored' };
        }
        await this.mercadoPagoService.procesarNotificacion(data);
        return { received: true };
    }

    @Get('success')
    @ApiParam({ name: 'query', type: Object, description: 'Parámetros de consulta de éxito' })
    @ApiResponse({ status: 200, description: 'Pago aprobado' })
    success(@Query() query: any) {
        return { mensaje: 'Pago aprobado', query };
    }

    @Get('failure')
    @ApiParam({ name: 'query', type: Object, description: 'Parámetros de consulta de fallo' })
    @ApiResponse({ status: 200, description: 'Pago fallido' })
    failure(@Query() query: any) {
        return { mensaje: 'Pago fallido', query };
    }

    @Get('pending')
    @ApiParam({ name: 'query', type: Object, description: 'Parámetros de consulta de pendiente' })
    @ApiResponse({ status: 200, description: 'Pago pendiente' })
    pending(@Query() query: any) {
        return { mensaje: 'Pago pendiente', query };
    }
}
