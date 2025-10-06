import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Stock } from 'src/stock/entities/stock.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    idProducto: number;

    @Column({ length: 50 })
    nombreProducto: string;

    @Column()
    precioProducto: number;

    @Column({ length: 100, nullable: true })
    descripcionProducto?: string;

    @Column({ nullable: true })
    sku?: string;

    @Column({ default: true })
    productoActivo: boolean;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaActualizacion: Date;

    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: 'SET NULL' })
    idCategoria: Categoria;

    @OneToMany(() => Stock, (stock) => stock.idProducto)
    stock: Stock[];
}
