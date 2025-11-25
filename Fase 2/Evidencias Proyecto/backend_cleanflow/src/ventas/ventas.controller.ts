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
    generarVenta(@Body() dto: CrearVentaDto) {
        return this.ventasService.generarVenta(dto);
    }

    @ApiBearerAuth()
    @Roles('Administrador', 'Empleado', 'Cliente')
    @Get('usuario/:id')
    @ApiResponse({ status: 200, description: 'Listado de ventas del usuario' })
    listarVentasUsuario(@Param('id') idUsuario: number) {
        return this.ventasService.listarVentasUsuario(idUsuario);
    }

    @ApiBearerAuth()
    @Roles('Administrador', 'Empleado')
    @Get ('fechas')
    @ApiResponse({ status: 200, description: 'Listado de ventas en un rango de fechas' })
    listarVentasFechas(@Param('fechaInicio') fechaInicio: Date, @Param('fechaFin') fechaFin: Date) {
        return this.ventasService.listarVentasFechas(fechaInicio, fechaFin);
    }
}
