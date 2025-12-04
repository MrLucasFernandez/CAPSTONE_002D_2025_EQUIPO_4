import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    // Método para enviar correo de confirmación de compra
    async enviarConfirmacionCompra(params: {
        to: string;
        nombreCliente: string;
        idBoleta: number;
        totalBoleta: number;
        impuesto: number;
        fecha: Date;
        productos: { nombre: string; cantidad: number; precioUnitario: number }[];
        }) {
        const { to, nombreCliente, idBoleta, totalBoleta, impuesto, fecha, productos } = params;
        const fechaFormateada = params.fecha.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        await this.mailerService.sendMail({
            to,
            subject: `Confirmación de compra #${idBoleta}`,
            template: 'confirmacion-compra',
            context: {
                nombreCliente,
                idBoleta,
                totalBoleta,
                impuesto,
                fechaFormateada,
                productos,
            },
        });
    }

    // Método para enviar un reporte PDF por correo electrónico
    async enviarReportePDF(params: {
        to: string;
        asunto: string;
        mensaje: string;
        pdfBuffer: Buffer;
        nombreArchivo: string;
    }) {
        const { to, asunto, mensaje, pdfBuffer, nombreArchivo } = params;

        await this.mailerService.sendMail({
            to,
            subject: asunto,
            template: 'reporte-resumen',
            context: {
                mensaje,
            },
            attachments: [
                {
                filename: nombreArchivo,
                content: pdfBuffer,
                },
            ],
        });
    }
}
