import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }

    // Renderizar plantillas Handlebars
    private renderTemplate(templateName: string, context: any): string {
        const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
        const templateFile = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateFile);
        return template(context);
    }

    // Enviar confirmación de compra
    async enviarConfirmacionCompra(params: {
        to: string;
        nombreCliente: string;
        idBoleta: number;
        totalBoleta: number;
        impuesto: number;
        fecha: Date;
        productos: { nombre: string; cantidad: number; precioUnitario: number }[];
        }) {
        const { to } = params;

        const fechaFormateada = params.fecha.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        const html = this.renderTemplate('confirmacion-compra', {
            ...params,
            fechaFormateada,
        });

        try {
            await sgMail.send({
            to,
            from: process.env.SENDGRID_FROM!,
            subject: `Confirmación de compra #${params.idBoleta}`,
            html,
            });

            this.logger.log(`Correo enviado a ${to}`);
        } catch (error) {
            this.logger.error('Error enviando correo', error.response?.body || error);
            throw error;
        }
    }

    // Enviar reportes PDF
    async enviarReportePDF(params: {
        to: string;
        asunto: string;
        mensaje: string;
        pdfBuffer: Buffer;
        nombreArchivo: string;
        }) {
        const html = this.renderTemplate('reporte-resumen', {
            mensaje: params.mensaje,
        });

        try {
            await sgMail.send({
                to: params.to,
                from: process.env.SENDGRID_FROM!,
                subject: params.asunto,
                html,
                attachments: [
                {
                    content: params.pdfBuffer.toString('base64'),
                    filename: params.nombreArchivo,
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        });
        this.logger.log(`Reporte enviado a ${params.to}`);
        } catch (error) {
            this.logger.error('Error enviando reporte PDF', error.response?.body || error);
            throw error;
        }
    }
}
