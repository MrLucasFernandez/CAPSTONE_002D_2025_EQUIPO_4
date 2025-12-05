import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from '../boletas/entities/boleta.entity';
import { Pago } from '../pagos/entities/pago.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MercadoPagoService {
    private client: MercadoPagoConfig;

    constructor(
        @InjectRepository(Boleta)
        private readonly boletaRepo: Repository<Boleta>,
        @InjectRepository(Pago)
        private readonly pagoRepo: Repository<Pago>,
        private readonly mailService: MailService,
    ) {
        this.client = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN!,
        });
    }

    async crearPreferencia(idBoleta: number) {
        const boleta = await this.boletaRepo.findOne({ where: { idBoleta }, relations: ['detalles', 'detalles.idProducto']});
        if (!boleta) {
            throw new NotFoundException('Boleta no encontrada');
        }

        const preferencia = new Preference(this.client);

        const resultado = await preferencia.create({ // Crear preferencia de pago en MercadoPago
        body: { // Uso de los detalles de la boleta para crear la preferencia
            items: boleta.detalles.map((detalle) => ({
                id: detalle.idProducto.idProducto.toString(),
                title: detalle.idProducto.nombreProducto,
                unit_price: Number(detalle.precioUnitario),
                quantity: Number(detalle.cantidad),
                currency_id: 'CLP',
            })),
            external_reference: idBoleta.toString(), // Referencia externa para identificar la boleta
            back_urls: { // URLs de retorno según el estado del pago (Modificar en producción a las URL del frontend)
                success: `${process.env.FRONTEND_URL}/mercadopago/success`,
                failure: `${process.env.FRONTEND_URL}/mercadopago/failure`,
                pending: `${process.env.FRONTEND_URL}/mercadopago/pending`,
            },
            notification_url: `${process.env.BACKEND_URL}/mercadopago/webhook`, // URL para notificaciones de pago
            //auto_return: 'approved',  CAMBIAR CUANDO EL FRONTEND ESTE LISTO
        },
    });
        return resultado;
    }

    async verificarPago(paymentId: string) { // Verificar el estado de un pago en MercadoPago
        const url = `https://api.mercadopago.com/v1/payments/${paymentId}`; // Endpoint de pagos de MercadoPago
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }, // Autenticación con token de acceso
        });
        return await res.json();
    }

    async procesarNotificacion(data:any) { // Funciona como webhook para notificaciones de MercadoPago

        if (!data?.data?.id)
            return { status: 'ignored' };

        const paymentId = data.data.id;

        const payment = await this.verificarPago(paymentId);

        if (!payment?.id || payment.status !== 'approved') {
            return { status: 'invalid' };
        }

        const paymentStatus = payment.status;
        const externalReference = payment.external_reference;

        if (!externalReference) return { paymentStatus: 'invalid' };

        const boleta = await this.boletaRepo.findOne({ 
            where: { idBoleta: +externalReference },
            relations: ['idUsuario', 'detalles', 'detalles.idProducto'] 
        });
        if (!boleta) throw new NotFoundException('Boleta no encontrada');

        const pagoExistente = await this.pagoRepo.findOne({ where: { idBoleta: boleta.idBoleta } });
        if (pagoExistente?.estado != 'COMPLETADO') { // Actualizar pago solo si no está completado
            this.pagoRepo.update(pagoExistente!.idPago, {
                fecha: new Date(),
                monto: boleta.totalBoleta,
                metodoPago: 'Mercado Pago',
                estado: paymentStatus === 'approved' ? 'COMPLETADO' : 'PENDIENTE',
            });
            
        } else {
            return { status: 'already_processed', paymentStatus, idBoleta: boleta.idBoleta, paymentId};
        }

        if (paymentStatus === 'approved') {
            boleta.estadoBoleta = 'PAGADA';
            
            // Enviar correo de confirmación
            const productosEmail = boleta.detalles.map(detalle => ({
                nombre: detalle.idProducto.nombreProducto,
                cantidad: Number(detalle.cantidad),
                precioUnitario: Number(detalle.precioUnitario)
            }));

            try {
                await this.mailService.enviarConfirmacionCompra({
                    to: boleta.idUsuario.correo,
                    nombreCliente: boleta.idUsuario.nombreUsuario,
                    idBoleta: boleta.idBoleta,
                    totalBoleta: boleta.totalBoleta,
                    impuesto: boleta.impuesto,
                    fecha: boleta.fecha,
                    productos: productosEmail,
                });
                console.log('Correo de confirmación enviado a', boleta.idUsuario.correo);
                console.log('Datos del mail:' , {
                    to: boleta.idUsuario.correo,
                    nombreCliente: boleta.idUsuario.nombreUsuario,
                    idBoleta: boleta.idBoleta,
                    totalBoleta: boleta.totalBoleta,
                    impuesto: boleta.impuesto,
                    fecha: boleta.fecha,
                    productos: productosEmail,
                });
            } catch (error) {
                console.error('Error al enviar correo de confirmación:', error.message);
            }

        } else if (paymentStatus === 'pending') {
            boleta.estadoBoleta = 'PENDIENTE';
        } else {
            boleta.estadoBoleta = 'RECHAZADA';
        }
        await this.boletaRepo.save(boleta);
        
        return { status: 'processed', paymentStatus, idBoleta: boleta.idBoleta, paymentId};
    }
}
