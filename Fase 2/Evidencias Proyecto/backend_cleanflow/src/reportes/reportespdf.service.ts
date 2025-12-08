import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { ReportesService } from './reportes.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ReportesPdfService {
    constructor(private readonly reportesService: ReportesService,
                private readonly mailService: MailService
    ) {
        Handlebars.registerHelper('inc', function (value: any) {
        return Number(value) + 1;
        });
    }

    // Método para obtener la ruta de una plantilla Handlebars
    private getTemplatePath(templateName: string): string {
        return path.join(__dirname, 'templates', `${templateName}.hbs`);
    }

    // Método para renderizar una plantilla Handlebars con datos
    private async renderTemplate( templateName: string, data: any, ): Promise<string> {
        const templatePath = this.getTemplatePath(templateName);
        const templateFile = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateFile);
        return template(data);
    }

    // Método para convertir HTML a PDF usando Puppeteer
    private async htmlToPdf(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process',
                '--no-zygote',],
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfUint8Array = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '10mm', bottom: '20mm', left: '10mm' },
        });

        await browser.close();
        return Buffer.from(pdfUint8Array);
    }

    // Método para generar el PDF del resumen de ventas
    async generarResumenVentasPdf(desde?: string, hasta?: string): Promise<Buffer> {
        const dataResumen = await this.reportesService.resumenVentas(desde, hasta);

        const html = await this.renderTemplate('resumen-ventas', {
        ...dataResumen,
        rango: desde && hasta ? { desde, hasta } : null,
        });

        return this.htmlToPdf(html);
    }

    // Método para enviar el PDF por correo electrónico
    async enviarResumenVentasPdfPorCorreo(correo: string, desde?: string, hasta?: string) {
        const pdfBuffer = await this.generarResumenVentasPdf(desde, hasta);

        await this.mailService.enviarReportePDF({
        to: correo,
        asunto: 'Reporte de Resumen de Ventas',
        mensaje: 'Adjunto encontrará el reporte en formato PDF del resumen de ventas.',
        pdfBuffer,
        nombreArchivo: 'resumen_ventas.pdf',
        });
    }

    // Método para generar el PDF del top de usuarios
    async generarTopUsuariosPdf(desde?: string, hasta?: string): Promise<Buffer> {
        const usuarios = await this.reportesService.topUsuarios(
        desde,
        hasta,
        );

        const html = await this.renderTemplate('top-usuarios', {
        usuarios,
        rango: desde && hasta ? { desde, hasta } : null,
        });

        return this.htmlToPdf(html);
    }

    // Método para generar el PDF del top de productos
    async generarTopProductosPdf(desde?: string, hasta?: string): Promise<Buffer> {
        const productos = await this.reportesService.topProductos(
        desde,
        hasta,
        );

        const html = await this.renderTemplate('top-productos', {
        productos,
        rango: desde && hasta ? { desde, hasta } : null,
        });

        return this.htmlToPdf(html);
    }

    // Método para generar el PDF de las ventas mensuales
    async generarVentasMensualesPdf(anno: number): Promise<Buffer> {
        const ventas = await this.reportesService.ventasPorMes(anno);

        const html = await this.renderTemplate('ventas-por-mes', {
        anno,
        ventas,
        });

        return this.htmlToPdf(html);
    }
}
