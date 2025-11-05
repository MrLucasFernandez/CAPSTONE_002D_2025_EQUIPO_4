import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_boleta')
export class DetalleBoleta {
    @PrimaryGeneratedColumn({name: 'iddetalle'})
    idDetalle: number;

    @ManyToOne(() => Boleta, (boleta) => boleta.detalles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idboleta' })
    idBoleta: Boleta;

    @ManyToOne(() => Producto, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idproducto' })
    idProducto: Producto;

    @Column({ type: 'numeric', precision: 12, scale: 3, name: 'cantidad' })
    cantidad: number;

    @Column({name: 'preciounitario'})
    precioUnitario: number;

}
