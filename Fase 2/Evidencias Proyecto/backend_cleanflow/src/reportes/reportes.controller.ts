import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
    constructor (
        private readonly reportesService: ReportesService
    ){}

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                desde: '2025-11-01',
                hasta: '2025-11-31',
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Reporte generado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('resumen')
    resumen(@Body() body: { desde?: string; hasta?: string }) {
        return this.reportesService.resumenVentas(body.desde, body.hasta);
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                desde: '2025-11-01',
                hasta: '2025-11-31',
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Reporte de detalles generado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('resumen-detalle')
    resumenConDetalle(@Body() body: { desde?: string; hasta?: string }) {
        return this.reportesService.resumenVentasConDetalle(body.desde, body.hasta);
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                desde: '2025-11-01',
                hasta: '2025-11-31',
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Reporte generado correctamente' })
    @Roles('Administrador', 'Empleado')    
    @Post('top-usuarios')
    usuariosTop(@Body() body: { desde?: string; hasta?: string }) {
        return this.reportesService.topUsuarios(body.desde, body.hasta);
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                desde: '2025-11-01',
                hasta: '2025-11-31',
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Reporte generado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('top-productos')
    productosTop(@Body() body: { desde?: string; hasta?: string }) {
        return this.reportesService.topProductos(body.desde, body.hasta);
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                anno: 2025
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Reporte generado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('ventas-mensuales')
    ventasMensuales(@Body() body: { anno: number }) {
        return this.reportesService.ventasPorMes(body.anno);
    }
    
}
