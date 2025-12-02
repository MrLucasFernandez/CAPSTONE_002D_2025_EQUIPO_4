import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { ReportesService } from './reportes.service';

@Injectable()
export class ReportesPdfService {
    constructor(private readonly reportesService: ReportesService) {
        Handlebars.registerHelper('inc', function (value: any) {
        return Number(value) + 1;
        });
    }

    private getTemplatePath(templateName: string): string {
        return path.join(__dirname, 'templates', `${templateName}.hbs`);
    }

    private async renderTemplate(
        templateName: string,
        data: any,
    ): Promise<string> {
        const templatePath = this.getTemplatePath(templateName);
        const templateFile = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateFile);
        return template(data);
    }

    private async htmlToPdf(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

    async generarResumenVentasPdf(desde?: string, hasta?: string): Promise<Buffer> {
        const dataResumen = await this.reportesService.resumenVentas(desde, hasta);

        const html = await this.renderTemplate('resumenventas', {
        ...dataResumen,
        rango: desde && hasta ? { desde, hasta } : null,
        });

        return this.htmlToPdf(html);
    }

    async generarTopUsuariosPdf(desde?: string, hasta?: string): Promise<Buffer> {
        const usuarios = await this.reportesService.topUsuarios(
        desde,
        hasta,
        );

        const html = await this.renderTemplate('topusuarios', {
        usuarios,
        rango: desde && hasta ? { desde, hasta } : null,
        });

        return this.htmlToPdf(html);
    }

    async generarTopProductosPdf(desde?: string, hasta?: string): Promise<Buffer> {
        const productos = await this.reportesService.topProductos(
        desde,
        hasta,
        );

        const html = await this.renderTemplate('topproductos', {
        productos,
        rango: desde && hasta ? { desde, hasta } : null,
        });

        return this.htmlToPdf(html);
    }

    async generarVentasMensualesPdf(anno: number): Promise<Buffer> {
        const ventas = await this.reportesService.ventasPorMes(anno);

        const html = await this.renderTemplate('ventaspormes', {
        anno,
        ventas,
        });

        return this.htmlToPdf(html);
    }
}
