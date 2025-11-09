import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Marca } from '../../marcas/entities/marca.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn({name: 'idProducto'})
    idProducto: number;

    @Column({ length: 50, name: 'nombreProducto' })
    nombreProducto: string;

    @Column({name: 'precioCompraProducto'})
    precioCompraProducto: number;

    @Column({asExpression: '("precioCompraProducto" * 1.35)', generatedType: 'STORED', name: 'precioVentaProducto'})
    precioVentaProducto: number;

    @Column({asExpression: '("precioCompraProducto" * 0.19)', generatedType: 'STORED', name: 'impuestoCompra'})
    impuestoCompra: number;

    @Column({asExpression: '(("precioCompraProducto" * 1.35) * 0.19)', generatedType: 'STORED', name: 'impuestoVenta'})
    impuestoVenta: number;

    @Column({asExpression: '(("precioCompraProducto" * 1.35) - "precioCompraProducto")', generatedType: 'STORED', name: 'utilidadProducto'})
    utilidadProducto: number;

    @Column({ length: 100, nullable: true, name: 'descripcionProducto' })
    descripcionProducto?: string;

    @Column({ nullable: true, name: 'sku' })
    sku?: string;

    @Column({ default: true, name: 'productoActivo' })
    productoActivo: boolean;

    @Column({ length: 200, nullable: true, name: 'urlImagenProducto' })
    urlImagenProducto?: string;

    @Column({ nullable: true })
    publicIdImagen?: string

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fechaCreacion' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fechaActualizacion' })
    fechaActualizacion: Date;

    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'idCategoria' })
    idCategoria: Categoria;

    @ManyToOne(() => Marca, (marca) => marca.productos, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'idMarca' })
    idMarca: Marca;

    @OneToMany(() => Stock, (stock) => stock.producto)
    stock: Stock[];
}
