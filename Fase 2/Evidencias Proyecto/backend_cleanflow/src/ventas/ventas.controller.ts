import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CrearVentaDto } from './dto/venta.dto';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
    constructor(private readonly ventasService: VentasService) {}

    @ApiBearerAuth()
    @Roles('Administrador', 'Empleado', 'Cliente')
    @Post()
    @ApiBody({
        schema: {
        example: {
            idUsuario: 1,
            idBodega: 1,
            metodoPago: 'Tarjeta de crédito',
            productos: [
            { idProducto: 1, cantidad: 2 },
            { idProducto: 2, cantidad: 5 },
            ],
        },
        },
    })
    @ApiResponse({ status: 201, description: 'Venta generada exitosamente' })
    async generarVenta(@Body() dto: CrearVentaDto) {
        return await this.ventasService.generarVenta(dto);
    }
}
