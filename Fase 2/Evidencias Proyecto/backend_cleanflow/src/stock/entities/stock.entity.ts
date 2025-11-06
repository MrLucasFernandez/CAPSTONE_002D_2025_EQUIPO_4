import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Bodega } from '../../bodegas/entities/bodega.entity';

@Entity('stock') 
export class Stock {
    
    @PrimaryColumn({ name: 'idProducto' })
    idProducto: number;

    @PrimaryColumn({ name: 'idBodega' })
    idBodega: number;

    @ManyToOne(() => Producto, { onDelete: 'CASCADE' }) // eager hace que delstock venga el producto y la bodega sin hacer relaciones manuales
    @JoinColumn({ name: 'idProducto' })
    producto: Producto;

    @ManyToOne(() => Bodega, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idBodega' })
    bodega: Bodega;

    @Column({ name: 'cantidad' })
    cantidad: number;
}
