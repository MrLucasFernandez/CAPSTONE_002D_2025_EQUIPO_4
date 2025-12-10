import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from '../boletas/entities/boleta.entity';
import { Pago } from '../pagos/entities/pago.entity';
import { MailService } from '../mail/mail.service';
import { Stock } from '../stock/entities/stock.entity';
import { PushService } from '../push_token/push_token.service';

@Injectable()
export class MercadoPagoService {
    private client: MercadoPagoConfig;

    constructor(
        @InjectRepository(Boleta)
        private readonly boletaRepo: Repository<Boleta>,
        @InjectRepository(Pago)
        private readonly pagoRepo: Repository<Pago>,
        @InjectRepository(Stock)
        private readonly stockRepo: Repository<Stock>,
        private readonly mailService: MailService,
        private readonly pushService: PushService,
    ) {
        this.client = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN!,
        });
    }

    async crearPreferencia(idBoleta: number, idBodega: number) {
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
            metadata: {
                id_bodega: idBodega
            },
            back_urls: { // URLs de retorno según el estado del pago (Modificar en producción a las URL del frontend)
                success: `${process.env.FRONTEND_URL}/mercadopago/success`,
                failure: `${process.env.FRONTEND_URL}/mercadopago/failure`,
                pending: `${process.env.FRONTEND_URL}/mercadopago/pending`,
            },
            notification_url: `${process.env.BACKEND_URL}/mercadopago/webhook`, // URL para notificaciones de pago
            auto_return: 'approved',
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

            // Descontar stock
            const idBodega = payment.metadata?.id_bodega;
            if (idBodega) {
                for (const detalle of boleta.detalles) {
                    const stock = await this.stockRepo.findOne({
                        where: {
                            producto: { idProducto: detalle.idProducto.idProducto },
                            bodega: { idBodega: Number(idBodega) }
                        }
                    });

                    if (stock) {
                        stock.cantidad -= Number(detalle.cantidad);
                        await this.stockRepo.save(stock);

                        if (stock.cantidad < 10) {
                            try {
                                await this.pushService.sendToRole(
                                    'Administrador',
                                    'Stock Bajo',
                                    `El producto "${detalle.idProducto.nombreProducto}" tiene solo ${stock.cantidad} unidades en bodega #${idBodega}.`,
                                    {
                                        productoId: detalle.idProducto.idProducto.toString(),
                                        bodegaId: idBodega.toString(),
                                        currentStock: stock.cantidad.toString(),
                                        type: 'low_stock_alert',
                                        threshold: '10',
                                    }
                                );
                            } catch (error) {
                                console.warn('Error enviando notificación de stock bajo:', error.message);
                            }
                        }
                    }
                }
            }
            
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
            // Enviar notificaciones push de confirmación
            const userId = boleta.idUsuario.idUsuario;
            await this.pushService.sendToUser(userId, 'Pago confirmado', `Tu pedido #${boleta.idBoleta} fue pagado.`);
            await this.pushService.sendToRole(
                'Administrador',
                'Pago Recibido',
                `Pago confirmado para la orden #${boleta.idBoleta} de ${boleta.idUsuario.nombreUsuario}. Monto: $${boleta.totalBoleta.toLocaleString('es-CL')}`,
                {
                    boletaId: boleta.idBoleta.toString(),
                    type: 'admin_payment_received',
                    userId: userId.toString(),
                    amount: boleta.totalBoleta.toString(),
                }
            );

        } else if (paymentStatus === 'pending') {
            boleta.estadoBoleta = 'PENDIENTE';

            await this.pushService.sendToUser(boleta.idUsuario.idUsuario, 'Pago pendiente', `Tu pago para la orden #${boleta.idBoleta} está pendiente de confirmación.`);
        } else {
            boleta.estadoBoleta = 'RECHAZADA';

            await this.pushService.sendToUser(boleta.idUsuario.idUsuario, 'Pago rechazado', `Tu pago para la orden #${boleta.idBoleta} ha sido rechazado.`);
        }
        await this.boletaRepo.save(boleta);
        
        return { status: 'processed', paymentStatus, idBoleta: boleta.idBoleta, paymentId};
    }
}
