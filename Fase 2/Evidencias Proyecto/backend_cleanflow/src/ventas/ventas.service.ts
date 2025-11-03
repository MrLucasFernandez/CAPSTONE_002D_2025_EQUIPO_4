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
    ) {}

    async generarVenta(dto: CrearVentaDto) {
        // Iniciar una transacción generando un query runner para realizar múltiples procesos
        const queryRunner = this.dataSource.createQueryRunner(); 
        await queryRunner.connect(); 
        await queryRunner.startTransaction(); 

        try {
            const usuario = await this.usuarioRepo.findOne({ where: { idUsuario: dto.idUsuario } });
            if (!usuario) throw new NotFoundException('Usuario no encontrado');

            const boleta = this.boletaRepo.create({ // Crear boleta inicial
                idUsuario: usuario,
                fecha: new Date(),
                estadoBoleta: 'PAGADA',
                subtotalBoleta: 0,
                impuesto: 0,
                totalBoleta: 0,
            });
            await queryRunner.manager.save(boleta); // Guardar boleta inicial

            let subtotal = 0;

            for (const item of dto.productos) {// Procesar cada producto en la venta

                const producto = await this.productoRepo.findOne({ where: { idProducto: item.idProducto } });
                if (!producto) throw new NotFoundException(`Producto con ID ${item.idProducto} no encontrado`);

                const stock = await this.stockRepo.findOne({ where: { // Verificar stock disponible
                    idProducto: producto.idProducto, 
                    idBodega: dto.idBodega,
                },
                });

                if (!stock || stock.cantidad < item.cantidad) { // Validar stock suficiente
                    throw new BadRequestException(`Stock insuficiente para el producto ${producto.nombreProducto}`);
                }

                stock.cantidad -= item.cantidad; // Reducir stock disponible
                await queryRunner.manager.save(stock); // Actualizar stock en la base de datos

                const subtotalItem = producto.precioVentaProducto * item.cantidad; // Calcular subtotal del ítem
                subtotal += subtotalItem; // Acumular subtotal de la venta

                const detalle = this.detalleBoletaRepo.create({ // Crear cada detalle de la boleta
                    idBoleta: boleta,
                    idProducto: producto,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precioVentaProducto,
                });

                await queryRunner.manager.save(detalle); // Guardar detalle de la boleta
            }

            const impuesto = Math.round(subtotal * 0.19);
            const total = subtotal + impuesto;

            boleta.subtotalBoleta = subtotal;
            boleta.impuesto = impuesto;
            boleta.totalBoleta = total;

            await queryRunner.manager.save(boleta); // Actualizar boleta con totales e impuestos

            const pago = this.pagoRepo.create({ // Registrar el pago de la boleta
                idBoleta: boleta,
                monto: total,
                metodoPago: dto.metodoPago,
                fechaPago: new Date(),
                estado: 'COMPLETADO',
            });

            await queryRunner.manager.save(pago); // Guardar el pago en la base de datos
            await queryRunner.commitTransaction(); // Confirmar todos los cambios en la transacción

            return {
                mensaje: 'Venta generada exitosamente',
                boleta, pago, total,
            };

            } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error en generarVenta:', error.message);
            throw error;
            } finally {
            await queryRunner.release();
        }
    }

    async listarVentasUsuario(idUsuario: number) { // Listar todas las ventas asociadas a un usuario
        const usuario = await this.usuarioRepo.findOne({ where: { idUsuario } });
        if (!usuario) throw new NotFoundException('Usuario no encontrado');
        return this.boletaRepo.find({
            where: { idUsuario: idUsuario as any }, // Typeorm requiere el any para buscar el id como numero
            relations: ['detalles', 'pagos'],
        });
    }

    async listarVentasFechas(fechaInicio: Date, fechaFin: Date) { // Listar ventas en un rango de fechas
        return this.boletaRepo.createQueryBuilder('boleta')
            .where('boleta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .leftJoinAndSelect('boleta.detalles', 'detalles')
            .leftJoinAndSelect('boleta.pagos', 'pagos')
            .getMany();
    }
}
