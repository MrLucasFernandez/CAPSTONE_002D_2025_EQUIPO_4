import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
    constructor (
        private readonly reportesService: ReportesService
    ){}

    @Post('resumen')
    resumen(@Body() body: { desde?: string; hasta?: string }) {
        return this.reportesService.resumenVentas(body.desde, body.hasta);
    }

    @Post('top-usuarios')
    usuariosTop(@Body() body: { desde?: string; hasta?: string }) {
        return this.reportesService.usuariosConMasVentas(body.desde, body.hasta);
    }

    @Post('top-productos')
    productosTop(@Body() body: { desde?: string; hasta?: string }) {
        return this.reportesService.productosMasVendidos(body.desde, body.hasta);
    }

    @Post('ventas-mensuales')
    ventasMensuales(@Body() body: { anno: number }) {
        return this.reportesService.ventasPorMes(body.anno);
    }
    
}
