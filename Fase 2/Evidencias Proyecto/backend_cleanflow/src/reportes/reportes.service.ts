import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleta } from 'src/boletas/entities/boleta.entity';
import { DetalleBoleta } from 'src/detalle_boletas/entities/detalle_boleta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository, Between } from 'typeorm';


@Injectable()
export class ReportesService {
    constructor(
        @InjectRepository(Boleta) private boletaRepo: Repository<Boleta>,
        @InjectRepository(DetalleBoleta) private detalleRepo: Repository<DetalleBoleta>,
        @InjectRepository(Producto) private productoRepo: Repository<Producto>,
        @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    ){}

    private async resumenVentasInterno(desde?: string, hasta?: string){
        const where = desde && hasta ? { fecha: Between(new Date(desde), new Date(hasta)) } : {};

        const boletas = await this.boletaRepo.find({where: { estadoBoleta: 'PAGADA', ...where }});
        
        const detallesQuery = this.detalleRepo
            .createQueryBuilder('detalle')
            .leftJoin('detalle.idBoleta', 'boleta')
            .leftJoin('detalle.idProducto', 'producto')
            .where('boleta.estadoBoleta = :estado', { estado: 'PAGADA' });

        if (desde && hasta) {
            detallesQuery.andWhere('boleta.fecha BETWEEN :desde AND :hasta', { desde: new Date(desde), hasta: new Date(hasta) });
        }

        const detalles = await detallesQuery.getMany();

        const totalVentas = boletas.reduce((acc, b) => acc + Number(b.totalBoleta), 0);
        const subtotales = boletas.reduce((acc, b) => acc + Number(b.subtotalBoleta), 0);
        const impuestos = boletas.reduce((acc, b) => acc + Number(b.impuesto), 0);
        
        const utilidad = detalles.reduce((acc, detalle) => {
            const precioCompra = Number(detalle.idProducto.precioCompraProducto) || 0;
            const precioVenta = Number(detalle.precioUnitario) || 0;
            const cantidad = Number(detalle.cantidad) || 0;
            const utilidadProducto = (precioVenta - precioCompra) * cantidad;
            return acc + utilidadProducto;
        }, 0);

        return { totalVentas, subtotales, impuestos, utilidad, cantidadVentas: boletas.length, boletas }
    }

    async resumenVentas(desde?: string, hasta?: string) {
        const { boletas, ...resumen } = await this.resumenVentasInterno(desde, hasta);
        return resumen;
    }

    async resumenVentasConDetalle(desde?: string, hasta?: string) {
        return this.resumenVentasInterno(desde, hasta);
    }

    async topUsuarios(desde?: string, hasta?: string) {
        const where = desde && hasta ? { fecha: Between(new Date(desde), new Date(hasta)) } : {};
        return this.boletaRepo
            .createQueryBuilder('boleta')
            .leftJoin('boleta.idUsuario', 'usuario')
            .select('usuario.nombreUsuario', 'usuario')
            .addSelect('COUNT(boleta.idBoleta)', 'totalVentas')
            .addSelect('SUM(boleta.totalBoleta)', 'montoTotal')
            .where(where)
            .andWhere('boleta.estadoBoleta = :estado', { estado: 'PAGADA' })
            .groupBy('usuario.idUsuario')
            .orderBy('totalVentas', 'DESC')
            .limit(10)
            .getRawMany();
    }

    async topProductos(desde?: string, hasta?: string) {
        const query = this.detalleRepo
            .createQueryBuilder('detalle')
            .leftJoin('detalle.idProducto', 'producto')
            .leftJoin('detalle.idBoleta', 'boleta')
            .select('producto.idProducto', 'idProducto')
            .addSelect('producto.nombreProducto', 'producto')
            .addSelect('SUM(detalle.cantidad)', 'cantidadVendida')
            .addSelect('producto.precioCompraProducto', 'precioCompra');

        if (desde && hasta) {
            query.where('boleta.fecha BETWEEN :desde AND :hasta', { desde, hasta });
            query.andWhere('boleta.estadoBoleta = :estado', { estado: 'PAGADA' });
        } else {
            query.where('boleta.estadoBoleta = :estado', { estado: 'PAGADA' });
        }

        const resultados = await query
            .groupBy('producto.idProducto')
            .addGroupBy('producto.nombreProducto')
            .addGroupBy('producto.precioCompraProducto')
            .orderBy('cantidadVendida', 'DESC')
            .limit(10)
            .getRawMany();

        const detallesQuery = this.detalleRepo
            .createQueryBuilder('detalle')
            .leftJoin('detalle.idProducto', 'producto')
            .leftJoin('detalle.idBoleta', 'boleta')
            .select('producto.idProducto', 'idProducto')
            .addSelect('SUM((detalle.precioUnitario - producto.precioCompraProducto) * detalle.cantidad)', 'utilidad')
            .addSelect('SUM(detalle.precioUnitario * detalle.cantidad)', 'totalVentas');

        if (desde && hasta) {
            detallesQuery.where('boleta.fecha BETWEEN :desde AND :hasta', { desde, hasta });
            detallesQuery.andWhere('boleta.estadoBoleta = :estado', { estado: 'PAGADA' });
        } else {
            detallesQuery.where('boleta.estadoBoleta = :estado', { estado: 'PAGADA' });
        }

        const utilidades = await detallesQuery
            .groupBy('producto.idProducto')
            .getRawMany();

        return resultados.map(resultado => {
            const utilidadData = utilidades.find(u => u.idProducto === resultado.idProducto);
            return {
                ...resultado,
                utilidad: utilidadData ? Number(utilidadData.utilidad) : 0,
                totalVentas: utilidadData ? Number(utilidadData.totalVentas) : 0
            };
        }).sort((a, b) => Number(b.cantidad_vendida) - Number(a.cantidad_vendida)).slice(0, 10);
    }

    async ventasPorMes(anno: number) {
        const resultados = await this.boletaRepo
            .createQueryBuilder('boleta')
            .select("TO_CHAR(boleta.fecha, 'Month')", 'mes')
            .addSelect('SUM(boleta.totalBoleta)', 'total')
            .addSelect('COUNT(boleta.idBoleta)', 'cantidadVentas')
            .where('EXTRACT(YEAR FROM boleta.fecha) = :anno AND boleta.estadoBoleta = :estado', { anno, estado: 'PAGADA' })
            .groupBy('mes')
            .orderBy('MIN(boleta.fecha)', 'ASC')
            .getRawMany();

        const utilidadesPorMes = await this.detalleRepo
            .createQueryBuilder('detalle')
            .leftJoin('detalle.idProducto', 'producto')
            .leftJoin('detalle.idBoleta', 'boleta')
            .select("TO_CHAR(boleta.fecha, 'Month')", 'mes')
            .addSelect('SUM((detalle.precioUnitario - producto.precioCompraProducto) * detalle.cantidad)', 'utilidad')
            .where('EXTRACT(YEAR FROM boleta.fecha) = :anno AND boleta.estadoBoleta = :estado', { anno, estado: 'PAGADA' })
            .setParameter('anno', anno)
            .setParameter('estado', 'PAGADA')
            .groupBy('mes')
            .orderBy('MIN(boleta.fecha)', 'ASC')
            .getRawMany();

        return resultados.map(resultado => {
            const utilidadData = utilidadesPorMes.find(u => u.mes === resultado.mes);
            return {
                mes: resultado.mes,
                total: Number(resultado.total),
                utilidad: utilidadData ? Number(utilidadData.utilidad) : 0,
                cantidadVentas: Number(resultado.cantidadVentas)
            };
        });
    }
}
