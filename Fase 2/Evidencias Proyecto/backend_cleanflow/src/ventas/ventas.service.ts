import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Boleta } from '../boletas/entities/boleta.entity';
import { DetalleBoleta } from '../detalle_boletas/entities/detalle_boleta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Pago } from '../pagos/entities/pago.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CrearVentaDto } from './dto/venta.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Boleta)
        private readonly boletaRepo: Repository<Boleta>,
        @InjectRepository(DetalleBoleta)
        private readonly detalleBoletaRepo: Repository<DetalleBoleta>,
        @InjectRepository(Producto)
        private readonly productoRepo: Repository<Producto>,
        @InjectRepository(Stock)
        private readonly stockRepo: Repository<Stock>,
        @InjectRepository(Pago)
        private readonly pagoRepo: Repository<Pago>,
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
        private readonly dataSource: DataSource,
        private readonly mailService: MailService,
    ) {}

    async generarVenta(dto: CrearVentaDto) {
        // Iniciar una transacción generando un query runner para realizar múltiples procesos
        const queryRunner = this.dataSource.createQueryRunner(); 
        await queryRunner.connect(); 
        await queryRunner.startTransaction(); 

        try {
            const usuario = await queryRunner.manager.findOne(Usuario, { where: { idUsuario: dto.idUsuario } });
            if (!usuario) throw new NotFoundException('Usuario no encontrado');

            const boleta = this.boletaRepo.create({ // Crear boleta inicial
                idUsuario: usuario,
                fecha: new Date(),
                estadoBoleta: 'PENDIENTE',
                subtotalBoleta: 0,
                impuesto: 0,
                totalBoleta: 0,
            });
            await queryRunner.manager.save(boleta); // Guardar boleta inicial

            let total = 0;

            for (const item of dto.productos) {// Procesar cada producto en la venta

                const producto = await this.productoRepo.findOne({ where: { idProducto: item.idProducto } });
                if (!producto) throw new NotFoundException(`Producto con ID ${item.idProducto} no encontrado`);

                const stock = await queryRunner.manager.findOne(Stock, {where:{ // Verificar stock disponible
                    producto: {idProducto: producto.idProducto}, 
                    bodega: {idBodega: dto.idBodega},
                },
                });

                if (!stock || stock.cantidad < item.cantidad) { // Validar stock suficiente
                    throw new BadRequestException(`Stock insuficiente para el producto ${producto.nombreProducto}`);
                }
                
                const subtotalItem = producto.precioVentaProducto * item.cantidad; // Calcular subtotal del ítem
                total += subtotalItem; // Acumular total de la venta

                const detalle = this.detalleBoletaRepo.create({ // Crear cada detalle de la boleta
                    idBoleta: boleta,
                    idProducto: producto,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precioVentaProducto,
                });

                await queryRunner.manager.save(detalle); // Guardar detalle de la boleta
            }

            const impuesto = Math.round(total * 0.19);
            const subtotal = total - impuesto;
            

            boleta.subtotalBoleta = subtotal;
            boleta.impuesto = impuesto;
            boleta.totalBoleta = total;

            await queryRunner.manager.save(boleta); // Actualizar boleta con totales e impuestos

            const pago = this.pagoRepo.create({ // Registrar el pago de la boleta
                idBoleta: boleta.idBoleta,
                monto: total,
                metodoPago: dto.metodoPago,
                fecha: new Date(),
                estado: 'PENDIENTE',
            });

            await queryRunner.manager.save(pago); // Guardar el pago en la base de datos
            await queryRunner.commitTransaction(); // Confirmar todos los cambios en la transacción

            return {
                mensaje: 'Venta generada exitosamente',
                boleta, pago, total,
            };

        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            console.error('Error en generarVenta:', error.message);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
