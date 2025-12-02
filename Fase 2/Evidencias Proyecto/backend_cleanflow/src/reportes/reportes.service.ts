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

        const boletas = await this.boletaRepo.find({where})

        const totalVentas = boletas.reduce((acc, b) => acc + Number(b.totalBoleta), 0);
        const subtotales = boletas.reduce((acc, b) => acc + Number(b.subtotalBoleta), 0);
        const impuestos = boletas.reduce((acc, b) => acc + Number(b.impuesto), 0);

        return { totalVentas, subtotales, impuestos, cantidadVentas: boletas.length, boletas }
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
            .addSelect('COUNT(boleta.idBoleta)', 'total_ventas')
            .where(where)
            .groupBy('usuario.idUsuario')
            .orderBy('total_ventas', 'DESC')
            .limit(10)
            .getRawMany();
    }

    async topProductos(desde?: string, hasta?: string) {
        const query = this.detalleRepo
            .createQueryBuilder('detalle')
            .leftJoin('detalle.idProducto', 'producto')
            .leftJoin('detalle.idBoleta', 'boleta')
            .select('producto.nombreProducto', 'producto')
            .addSelect('SUM(detalle.cantidad)', 'cantidad_vendida');

        if (desde && hasta) {
            query.where('boleta.fecha BETWEEN :desde AND :hasta', { desde, hasta });
        }

        return query
            .groupBy('producto.idProducto')
            .orderBy('cantidad_vendida', 'DESC')
            .limit(10)
            .getRawMany();
    }

    async ventasPorMes(anno: number) {
        return this.boletaRepo
            .createQueryBuilder('boleta')
            .select("TO_CHAR(boleta.fecha, 'Month')", 'mes')
            .addSelect('SUM(boleta.totalBoleta)', 'total')
            .where('EXTRACT(YEAR FROM boleta.fecha) = :anno', { anno })
            .groupBy('mes')
            .orderBy('MIN(boleta.fecha)', 'ASC')
            .getRawMany();
    }
}
