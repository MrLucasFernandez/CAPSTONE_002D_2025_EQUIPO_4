import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from '../boletas/entities/boleta.entity';
import { Pago } from '../pagos/entities/pago.entity';

@Injectable()
export class MercadoPagoService {
    private client: MercadoPagoConfig;
    private readonly logger = new Logger(MercadoPagoService.name);

    constructor(
        @InjectRepository(Boleta)
        private readonly boletaRepo: Repository<Boleta>,
        @InjectRepository(Pago)
        private readonly pagoRepo: Repository<Pago>,
    ) {
        this.client = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN!,
        });
    }

    async crearPreferencia(idBoleta: number, items: any[]) {
        const preference = new Preference(this.client);

        const result = await preference.create({
        body: {
            items: items.map((item) => ({
                id: item.idProducto?.toString() ?? crypto.randomUUID(),
                title: item.nombre,
                unit_price: item.precio,
                quantity: item.cantidad,
                currency_id: 'CLP',
            })),
            external_reference: idBoleta.toString(), // Referencia externa para identificar la boleta
            back_urls: { // URLs de retorno según el estado del pago (Modificar en producción)
                success: 'http://localhost:3000/pago/success',
                failure: 'http://localhost:3000/pago/failure',
                pending: 'http://localhost:3000/pago/pending',
            },
            auto_return: 'approved',
        },
    });
        return result;
    }

    async verificarPago(idPago: string) { // Verificar el estado de un pago en MercadoPago
        const url = `https://api.mercadopago.com/v1/payments/${idPago}`; // Endpoint de pagos de MercadoPago
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }, // Autenticación con token de acceso
        });
        return await res.json();
    }

    async procesarNotificacion(data:any) { // Funciona como webhook para notificaciones de MercadoPago
        this.logger.log(`Notificación de MercadoPago: ${JSON.stringify(data)}`);
        if (!data?.data?.id) return { status: 'ignored' };

        const paymentId = data.data.id;
        const paymentStatus = data.type;
        const externalReference = data.external_reference;

        if (!externalReference) return { status: 'invalid' };

        const boleta = await this.boletaRepo.findOne({ where: { idBoleta: +externalReference } });
        if (!boleta) throw new NotFoundException('Boleta no encontrada');

        if (paymentStatus === 'payment') {
            const pago = this.pagoRepo.create({
                idBoleta: boleta,
                fechaPago: new Date(),
                monto: boleta.totalBoleta,
                metodoPago: 'MercadoPago',
                estado: 'COMPLETADO',
            });
        await this.pagoRepo.save(pago);

        boleta.estadoBoleta = 'PAGADA';
        await this.boletaRepo.save(boleta);
        }
        return { status: 'processed' };
    }
}
