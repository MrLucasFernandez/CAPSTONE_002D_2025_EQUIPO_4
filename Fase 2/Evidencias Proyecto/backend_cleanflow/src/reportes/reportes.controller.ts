import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { ReportesPdfService } from './reportespdf.service';
import { Roles } from 'src/auth/roles.decorator';
import type { Response } from 'express';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {

    constructor (
        private readonly reportesService: ReportesService,
        private readonly reportesPdfService: ReportesPdfService
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
        try {
            return this.reportesService.resumenVentas(body.desde, body.hasta);
        } catch (error) {
            throw new Error('Error al generar el reporte: ' + error.message);
        }
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
        try {
            return this.reportesService.resumenVentasConDetalle(body.desde, body.hasta);
        } catch (error) {
            throw new Error('Error al generar el reporte: ' + error.message);
        }
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                desde: '2025-11-01',
                hasta: '2025-11-30',
            },
        },
    })
    @ApiResponse({ status: 200, description: 'PDF generado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('resumen/pdf')
    async resumenPdf(
        @Body() body: { desde?: string; hasta?: string },
        @Res() res: Response,
    ) {
        try {
            const { desde, hasta } = body;
            const pdfBuffer = await this.reportesPdfService.generarResumenVentasPdf( desde, hasta);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="resumen-ventas.pdf"`,
            );
            res.send(pdfBuffer);
        } catch (error) {
            throw new Error('Error al generar el PDF: ' + error.message);
        }
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                correo: 'example@example.com',
                desde: '2025-11-01',
                hasta: '2025-11-30',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Reporte enviado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('resumen-detalle/enviar')
    async enviarResumen(@Body() body: { correo: string; desde?: string; hasta?: string }) {
        try {
            await this.reportesPdfService.enviarResumenVentasPdfPorCorreo(body.correo, body.desde, body.hasta);
            return { message: 'Correo enviado correctamente' };
        } catch (error) {
            throw new Error('Error al enviar el correo: ' + error.message);
        }
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
    @ApiResponse({ status: 201, description: 'Reporte generado correctamente' })
    @Roles('Administrador', 'Empleado')    
    @Post('top-usuarios')
    usuariosTop(@Body() body: { desde?: string; hasta?: string }) {
        try {
            return this.reportesService.topUsuarios(body.desde, body.hasta);
        } catch (error) {
            throw new Error('Error al generar el reporte: ' + error.message);
        }
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                correo: 'example@example.com',
                desde: '2025-11-01',
                hasta: '2025-11-31',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Reporte enviado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('top-usuarios/enviar')
    enviarUsuariosTop(@Body() body: { correo: string; desde?: string; hasta?: string }) {
        try {
            return this.reportesPdfService.enviarTopUsuariosPdfPorCorreo(body.correo, body.desde, body.hasta);
        } catch (error) {
            throw new Error('Error al enviar el reporte: ' + error.message);
        }
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
    @ApiResponse({ status: 201, description: 'Reporte generado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('top-productos')
    productosTop(@Body() body: { desde?: string; hasta?: string }) {
        try {
            return this.reportesService.topProductos(body.desde, body.hasta);
        } catch (error) {
            throw new Error('Error al generar el reporte: ' + error.message);
        }
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                correo: 'example@example.com',
                desde: '2025-11-01',
                hasta: '2025-11-31',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Reporte enviado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('top-productos/enviar')
    enviarProductosTop(@Body() body: { correo: string; desde?: string; hasta?: string }) {
        try {
            return this.reportesPdfService.enviarTopProductosPdfPorCorreo(body.correo, body.desde, body.hasta);
        } catch (error) {
            throw new Error('Error al enviar el reporte: ' + error.message);
        }
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                anno: 2025
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Reporte generado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('ventas-mensuales')
    ventasMensuales(@Body() body: { anno: number }) {
        try {
            return this.reportesService.ventasPorMes(body.anno);
        } catch (error) {
            throw new Error('Error al generar el reporte: ' + error.message);
        }
    }

    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                correo: 'example@example.com',
                desde: '2025-11-01',
                hasta: '2025-11-31',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Reporte enviado correctamente' })
    @Roles('Administrador', 'Empleado')
    @Post('ventas-mensuales/enviar')
    enviarVentasMensuales(@Body() body: { correo: string; anno: number }) {
        try {
            return this.reportesPdfService.enviarVentasMensualesPdfPorCorreo(body.correo, body.anno);
        } catch (error) {
            throw new Error('Error al enviar el reporte: ' + error.message);
        }
    }
}