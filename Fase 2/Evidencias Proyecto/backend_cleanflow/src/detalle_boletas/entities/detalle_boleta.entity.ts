import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_boleta')
export class DetalleBoleta {
    @PrimaryGeneratedColumn()
    idDetalle: number;

    @ManyToOne(() => Boleta, (boleta) => boleta.detalles, { onDelete: 'CASCADE' })
    idBoleta: Boleta;

    @ManyToOne(() => Producto, { onDelete: 'SET NULL' })
    idProducto: Producto;

    @Column({ type: 'numeric', precision: 12, scale: 3 })
    cantidad: number;

    @Column()
    precioUnitario: number;

    @Column({ type: 'numeric', precision: 5, scale: 2 })
    tasaIva: number;
}
