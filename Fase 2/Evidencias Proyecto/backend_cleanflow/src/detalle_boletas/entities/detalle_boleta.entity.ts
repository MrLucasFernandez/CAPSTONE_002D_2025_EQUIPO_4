import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_boleta')
export class DetalleBoleta {
    @PrimaryGeneratedColumn({name: 'idDetalle'})
    idDetalle: number;

    @ManyToOne(() => Boleta, (boleta) => boleta.detalles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idBoleta' })
    idBoleta: Boleta;

    @ManyToOne(() => Producto, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idProducto' })
    idProducto: Producto;

    @Column({ type: 'numeric', precision: 12, scale: 3, name: 'cantidad' })
    cantidad: number;

    @Column({name: 'precioUnitario'})
    precioUnitario: number;

}
