import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Marca } from '../../marcas/entities/marca.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    idProducto: number;

    @Column({ length: 50 })
    nombreProducto: string;

    @Column()
    precioCompraProducto: number;

    @Column({asExpression: '("precioCompraProducto" * 1.35)', generatedType: 'STORED'})
    precioVentaProducto: number;

    @Column({asExpression: '("precioCompraProducto" * 0.19)', generatedType: 'STORED'})
    impuestoCompra: number;

    @Column({asExpression: '(("precioCompraProducto" * 1.35) * 0.19)', generatedType: 'STORED'})
    impuestoVenta: number;

    @Column({asExpression: '(("precioCompraProducto" * 1.35) - "precioCompraProducto")', generatedType: 'STORED'})
    utilidadProducto: number;

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

    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: 'RESTRICT' })
    idCategoria: Categoria;

    @ManyToOne(() => Marca, (marca) => marca.productos, { onDelete: 'RESTRICT' })
    idMarca: Marca;

    @OneToMany(() => Stock, (stock) => stock.producto)
    stock: Stock[];
}
